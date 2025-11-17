import { setContains } from '@/types/utils/non-empty'

import { WalletLadderType } from '@/schema/ladders'
import type { WalletLadderEvaluation, WalletStage } from '@/schema/stages'
import type { RatedWallet } from '@/schema/wallet'
import { WalletType } from '@/schema/wallet-types'

/**
 * Get the primary stage and ladder evaluation for a wallet.
 * Returns the stage from the most relevant ladder for the wallet.
 * For software wallets, returns the SOFTWARE ladder stage.
 * For other wallet types, returns the first applicable ladder stage.
 */
export function getWalletStageAndLadder(
	wallet: RatedWallet,
): {
	stage: WalletStage | 'NOT_APPLICABLE' | 'QUALIFIED_FOR_NO_STAGES' | null
	ladderEvaluation: WalletLadderEvaluation | null
} {
	// Prioritize SOFTWARE ladder if the wallet is a software wallet
	if (setContains<WalletType>(wallet.types, WalletType.SOFTWARE)) {
		const softwareLadder = wallet.ladders[WalletLadderType.SOFTWARE]
		if (softwareLadder && softwareLadder.stage !== 'NOT_APPLICABLE') {
			return {
				stage: softwareLadder.stage,
				ladderEvaluation: softwareLadder,
			}
		}
	}

	// Otherwise, return the first applicable ladder evaluation
	for (const ladderEvaluation of Object.values(wallet.ladders)) {
		if (ladderEvaluation.stage !== 'NOT_APPLICABLE') {
			return {
				stage: ladderEvaluation.stage,
				ladderEvaluation,
			}
		}
	}

	return {
		stage: null,
		ladderEvaluation: null,
	}
}

/**
 * Get the primary stage for a wallet.
 * Returns the stage from the most relevant ladder for the wallet.
 * For software wallets, returns the SOFTWARE ladder stage.
 * For other wallet types, returns the first applicable ladder stage.
 */
export function getWalletStage(wallet: RatedWallet): WalletStage | 'NOT_APPLICABLE' | 'QUALIFIED_FOR_NO_STAGES' | null {
	return getWalletStageAndLadder(wallet).stage
}

/**
 * Check if a stage is a valid WalletStage object (not a string constant).
 */
function isValidStage(stage: WalletStage | 'NOT_APPLICABLE' | 'QUALIFIED_FOR_NO_STAGES' | null): stage is WalletStage {
	return stage !== null && typeof stage !== 'string'
}

/**
 * Find a stage index by ID in a ladder.
 */
function findStageIndex(stages: WalletStage[], stageId: string): number | null {
	const index = stages.findIndex(s => s.id === stageId)
	return index >= 0 ? index : null
}

/**
 * Get the stage number (0-indexed) for a wallet stage.
 * Returns null if the stage is not a WalletStage object.
 */
export function getStageNumber(
	stage: WalletStage | 'NOT_APPLICABLE' | 'QUALIFIED_FOR_NO_STAGES',
	ladderEvaluation: WalletLadderEvaluation,
): number | null {
	if (!isValidStage(stage)) {
		return null
	}
	return findStageIndex(ladderEvaluation.ladder.stages, stage.id)
}

/**
 * Get a stage by ID from a ladder evaluation.
 * @param stageId The stage ID to find
 * @param ladderEvaluation The ladder evaluation to search
 * @returns The stage if found, null otherwise
 */
export function getStageById(
	stageId: string,
	ladderEvaluation: WalletLadderEvaluation,
): WalletStage | null {
	return ladderEvaluation.ladder.stages.find(s => s.id === stageId) ?? null
}

/**
 * Get the stage number for a stage ID in a ladder evaluation.
 * @param stageId The stage ID
 * @param ladderEvaluation The ladder evaluation
 * @returns The stage number (0-indexed) if found, null otherwise
 */
export function getStageNumberById(
	stageId: string,
	ladderEvaluation: WalletLadderEvaluation,
): number | null {
	return findStageIndex(ladderEvaluation.ladder.stages, stageId)
}

/**
 * Get the ladder type for a given ladder evaluation from a wallet.
 * @param wallet The wallet to search
 * @param ladderEvaluation The ladder evaluation to find
 * @returns The ladder type if found, null otherwise
 */
export function getLadderType(
	wallet: RatedWallet,
	ladderEvaluation: WalletLadderEvaluation | null,
): WalletLadderType | null {
	if (!ladderEvaluation) {
		return null
	}
	return (Object.entries(wallet.ladders).find(([_, evaluation]) => evaluation === ladderEvaluation)?.[0] as WalletLadderType) ?? null
}

/**
 * Get the stage value for a wallet: 'QUALIFIED_FOR_NO_STAGES', 'NOT_APPLICABLE', or the stage ID.
 * This simplifies stage handling by returning a single string value.
 */
export function getWalletStageValue(wallet: RatedWallet): 'QUALIFIED_FOR_NO_STAGES' | 'NOT_APPLICABLE' | string {
	const { stage, ladderEvaluation } = getWalletStageAndLadder(wallet)
	
	if (stage === 'NOT_APPLICABLE' || stage === null || ladderEvaluation === null) {
		return 'NOT_APPLICABLE'
	}
	
	if (stage === 'QUALIFIED_FOR_NO_STAGES') {
		return 'QUALIFIED_FOR_NO_STAGES'
	}
	
	return stage.id
}

