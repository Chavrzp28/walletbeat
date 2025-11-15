import type { Attribute } from '@/schema/attributes'
import { WalletLadderType } from '@/schema/ladders'
import { ladders } from '@/schema/ladders'
import type { WalletStageCriterion } from '@/schema/stages'

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
 * Find which stage numbers (0-indexed) an attribute is used in across all ladders.
 * @param attribute The attribute to check
 * @returns An array of objects containing ladder type and stage numbers where the attribute is used
 */
export function getAttributeStages(attribute: Attribute<any>): Array<{ ladderType: WalletLadderType, stageNumbers: number[] }> {
	const result: Array<{ ladderType: WalletLadderType, stageNumbers: number[] }> = []

	for (const [ladderType, ladder] of Object.entries(ladders) as [WalletLadderType, typeof ladders[WalletLadderType]][]) {
		const stageNumbers: number[] = []

		for (let stageIndex = 0; stageIndex < ladder.stages.length; stageIndex++) {
			const stage = ladder.stages[stageIndex]
			
			// Check if the attribute is used in any criterion in this stage
			const isUsed = stage.criteriaGroups.some(criteriaGroup =>
				criteriaGroup.criteria.some(criterion => {
					const attributeId = getCriterionAttributeId(criterion)
					return attributeId === attribute.id
				})
			)

			if (isUsed) {
				stageNumbers.push(stageIndex)
			}
		}

		if (stageNumbers.length > 0) {
			result.push({ ladderType, stageNumbers })
		}
	}

	return result
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

	for (const [ladderType, ladder] of Object.entries(ladders) as [WalletLadderType, typeof ladders[WalletLadderType]][]) {
		for (let stageIndex = 0; stageIndex < ladder.stages.length; stageIndex++) {
			const stage = ladder.stages[stageIndex]
			
			for (const criteriaGroup of stage.criteriaGroups) {
				for (const criterion of criteriaGroup.criteria) {
					const attributeId = getCriterionAttributeId(criterion)
					if (attributeId === attribute.id) {
						result.push({ ladderType, stageNumber: stageIndex, criterion })
					}
				}
			}
		}
	}

	return result
}

