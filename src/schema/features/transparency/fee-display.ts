import type { WithRef } from '@/schema/reference'

import { type Support } from '../support'

/**
 * What level of information is shown about fees.
 */
export enum FeeDisplayLevel {
	/**
	 * No fee transparency shown at all.
	 * Example: Fees built into spreads during swaps.
	 */
	NONE = 'NONE',

	/**
	 * A single number is shown displaying the total amount of fees
	 * being paid.
	 */
	AGGREGATED = 'AGGREGATED',

	/**
	 * Full fee breakdown shown by default: which fees goes to who.
	 */
	COMPREHENSIVE = 'COMPREHENSIVE',
}

/** How much fee information is displayed by default and after an action. */
export interface FeeDisplay {
	/**
	 * Level of information shown with the wallet's default configuration, with
	 * no setting modified from defaults and with zero fee-specific clicks on
	 * the transaction approval flow.
	 */
	byDefault: FeeDisplayLevel

	/**
	 * Level of information shown with the wallet's default configuration,
	 * no setting modified from defaults, and with at most one action
	 * (click/tap) on the transaction approval flow.
	 */
	afterSingleAction: FeeDisplayLevel

	/**
	 * Whether the wallet fully sponsors these fees.
	 */
	fullySponsored: boolean
}

/** Shorthand for fees that are comprehensive by default. */
export const comprehensiveFeesShownByDefault: WithRef<FeeDisplay> = {
	byDefault: FeeDisplayLevel.COMPREHENSIVE,
	afterSingleAction: FeeDisplayLevel.COMPREHENSIVE,
	fullySponsored: false,
	ref: [],
}

/** Shorthand for fees that are fully sponsored and not shown. */
export const fullySponsoredFees: WithRef<FeeDisplay> = {
	byDefault: FeeDisplayLevel.NONE,
	afterSingleAction: FeeDisplayLevel.NONE,
	fullySponsored: true,
	ref: [],
}

/**
 * Details about how the wallet displays fees for basic operations.
 */
export interface BasicOperationFees {
	/** How does the wallet display fees for simple ETH transfers on L1? */
	ethL1Transfer: Support<WithRef<FeeDisplay>>

	/** How does the wallet display fees for simple ERC-20 transfers on L1? */
	erc20L1Transfer: Support<WithRef<FeeDisplay>>

	/** If the wallet has a built-in ERC-20 swap feature, how are fees displayed? */
	builtInErc20Swap: Support<WithRef<FeeDisplay>>

	/**
	 * For a Uniswap transaction exchanging USDC for Ether, initiated
	 * through the Uniswap frontend (not the wallet's built-in swap
	 * feature, if any), how are fees displayed?
	 */
	uniswapUSDCToEtherSwap: Support<WithRef<FeeDisplay>>

	// Private token transfer transactions are already encoded in their
	// respective types, so no need to redeclare them here.
	// Same for native cross-chain bridging.
}
