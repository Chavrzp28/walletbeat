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
 * Get the stage number (0-indexed) for a wallet stage.
 * Returns null if the stage is not a WalletStage object.
 */
export function getStageNumber(
	stage: WalletStage | 'NOT_APPLICABLE' | 'QUALIFIED_FOR_NO_STAGES',
	ladderEvaluation: WalletLadderEvaluation,
): number | null {
	if (stage === 'NOT_APPLICABLE' || stage === 'QUALIFIED_FOR_NO_STAGES') {
		return null
	}

	const stageIndex = ladderEvaluation.ladder.stages.findIndex(s => s.id === stage.id)
	return stageIndex >= 0 ? stageIndex : null
}

