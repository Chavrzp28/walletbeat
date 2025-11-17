import type { Attribute } from '@/schema/attributes'
import { attributeTree } from '@/schema/attribute-groups'
import { WalletLadderType } from '@/schema/ladders'
import { ladders } from '@/schema/ladders'
import type { WalletStage, WalletStageCriterion } from '@/schema/stages'

/**
 * Iterate over all stages across all ladders.
 */
function* allStages(): Generator<{ ladderType: WalletLadderType, stage: WalletStage, stageIndex: number }> {
	for (const [ladderType, ladder] of Object.entries(ladders) as [WalletLadderType, typeof ladders[WalletLadderType]][]) {
		for (let stageIndex = 0; stageIndex < ladder.stages.length; stageIndex++) {
			yield { ladderType, stage: ladder.stages[stageIndex], stageIndex }
		}
	}
}

/**
 * Map of all unique stage IDs to their stage numbers (using the first occurrence).
 * This is useful for creating filter definitions and other stage-related operations.
 */
export const stagesById = (
	new Map(
		Object.values(ladders)
			.flatMap(ladder => (
				ladder.stages.map((stage, stageIndex) => [stage.id, stageIndex] as const)
			))
			.filter(([stageId], idx, arr) => (
				arr.findIndex(([id]) => id === stageId) === idx
			))
	)
)

/**
 * Iterate over all criteria in a stage.
 */
function* allCriteriaInStage(stage: WalletStage): Generator<WalletStageCriterion> {
	for (const criteriaGroup of stage.criteriaGroups) {
		for (const criterion of criteriaGroup.criteria) {
			yield criterion
		}
	}
}

/**
 * Check if an attribute is used in any stage requirement by checking if the attribute
 * is referenced in the ladder structure. Since variantsMustPassAttribute creates closures
 * that capture the attribute, we check if the attribute ID appears in the serialized
 * ladder definitions (which includes the attribute references).
 * @param attribute The attribute to check
 * @returns true if the attribute is used in any stage criterion
 */
export function isAttributeUsedInStages(attribute: Attribute<any>): boolean {
	// The attribute objects are referenced in the stage definitions via variantsMustPassAttribute
	// We can check if the attribute ID appears in the ladder structure
	// by serializing and checking for the attribute ID
	const ladderString = JSON.stringify(ladders, (key, value) => {
		// When we encounter an attribute object, include its ID
		if (value && typeof value === 'object' && 'id' in value && 'displayName' in value && 'question' in value) {
			return { id: value.id, _isAttribute: true }
		}
		return value
	})
	
	return ladderString.includes(`"id":"${attribute.id}"`)
}

/**
 * Check if an attribute is used in a specific stage.
 * @param attribute The attribute to check
 * @param stage The stage to check
 * @returns true if the attribute is used in the stage
 */
function isAttributeUsedInStageObject(attribute: Attribute<any>, stage: WalletStage): boolean {
	return Array.from(allCriteriaInStage(stage)).some(criterion => {
		const attributeId = getCriterionAttributeId(criterion)
		return attributeId === attribute.id
	})
}

/**
 * Check if an attribute is used in a specific stage by stage ID.
 * @param attribute The attribute to check
 * @param stageId The stage ID to check
 * @returns true if the attribute is used in the stage
 */
export function isAttributeUsedInStage(attribute: Attribute<any>, stageId: string): boolean {
	for (const { stage } of allStages()) {
		if (stage.id === stageId && isAttributeUsedInStageObject(attribute, stage)) {
			return true
		}
	}
	return false
}

/**
 * Find which stage numbers (0-indexed) an attribute is used in across all ladders.
 * @param attribute The attribute to check
 * @returns An array of objects containing ladder type and stage numbers where the attribute is used
 */
export function getAttributeStages(attribute: Attribute<any>): Array<{ ladderType: WalletLadderType, stageNumbers: number[] }> {
	const byLadder = new Map<WalletLadderType, number[]>()
	
	for (const { ladderType, stage, stageIndex } of allStages()) {
		if (isAttributeUsedInStageObject(attribute, stage)) {
			const stageNumbers = byLadder.get(ladderType) ?? []
			stageNumbers.push(stageIndex)
			byLadder.set(ladderType, stageNumbers)
		}
	}

	return Array.from(byLadder.entries()).map(([ladderType, stageNumbers]) => ({
		ladderType,
		stageNumbers,
	}))
}

/**
 * Extract the attribute ID from a stage criterion if it uses variantsMustPassAttribute.
 * @param criterion The criterion to check
 * @returns The attribute ID if found, null otherwise
 */
export function getCriterionAttributeId(criterion: { evaluate: (wallet: any) => any }): string | null {
	// First check if the evaluate function has the __attributeId property attached
	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
	const attachedId = (criterion.evaluate as any).__attributeId
	if (typeof attachedId === 'string') {
		return attachedId
	}

	// Fallback to serialization for other cases
	const criterionString = JSON.stringify(criterion, (key, value) => {
		if (value && typeof value === 'object' && 'id' in value && 'displayName' in value && 'question' in value) {
			return { id: value.id, _isAttribute: true }
		}
		return value
	})
	
	// Try to extract the attribute ID from the serialized string
	const attributeIdMatch = criterionString.match(/"id":"([^"]+)","_isAttribute":true/)
	return attributeIdMatch ? attributeIdMatch[1] : null
}

/**
 * Get all criteria that reference a specific attribute across all ladders.
 * @param attribute The attribute to find criteria for
 * @returns An array of objects containing ladder type, stage number, and criterion
 */
export function getAttributeCriteria(attribute: Attribute<any>): Array<{ ladderType: WalletLadderType, stageNumber: number, criterion: WalletStageCriterion }> {
	const result: Array<{ ladderType: WalletLadderType, stageNumber: number, criterion: WalletStageCriterion }> = []

	for (const { ladderType, stage, stageIndex } of allStages()) {
		if (isAttributeUsedInStageObject(attribute, stage)) {
			for (const criterion of allCriteriaInStage(stage)) {
				if (getCriterionAttributeId(criterion) === attribute.id) {
					result.push({ ladderType, stageNumber: stageIndex, criterion })
				}
			}
		}
	}

	return result
}

/**
 * Find an attribute by ID in the attribute tree.
 * @param attributeId The attribute ID to find
 * @returns The attribute if found, null otherwise
 */
export function findAttributeById(attributeId: string): Attribute<any> | null {
	for (const attrGroup of Object.values(attributeTree)) {
		const attr = attrGroup.attributes[attributeId]
		if (attr) {
			return attr
		}
	}
	return null
}

