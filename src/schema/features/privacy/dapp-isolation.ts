import type { WithRef } from '@/schema/reference'

import type { Support, Supported } from '../support'

/**
 * What set of accounts are exposed?
 */
export enum ExposedAccountsBehavior {
	/** The wallet exposes all user accounts. */
	ALL_ACCOUNTS = 'ALL_ACCOUNTS',

	/** The wallet exposes only the active account. */
	ACTIVE_ACCOUNT_ONLY = 'ACTIVE_ACCOUNT_ONLY',

	/**
	 * There is no default set of exposed accounts; the user must make a choice.
	 */
	NO_DEFAULT = 'NO_DEFAULT',

	/** The wallet exposes a dapp-specific address. */
	DAPP_SPECIFIC_ACCOUNT = 'DAPP_SPECIFIC_ACCOUNT',
}

/** Set of exposed accounts. */
export interface ExposedAccountSet {
	/** What set of accounts is exposed by default? */
	defaultBehavior: ExposedAccountsBehavior
}

/**
 * @returns whether the two given `ExposedAccountSet`s are equal.
 */
export function sameExposedAccountSet(
	exposedAccountSet1: ExposedAccountSet,
	exposedAccountSet2: ExposedAccountSet,
): boolean {
	return exposedAccountSet1.defaultBehavior === exposedAccountSet2.defaultBehavior
}

/**
 * How the wallet isolates dapps from getting data that other dapps may also
 * gather.
 */
interface BaseDappIsolation {
	/**
	 * How does the wallet handle the `eth_accounts` RPC?
	 */
	ethAccounts: Support<WithRef<ExposedAccountSet>>

	/**
	 * If the wallet supports ERC-7846 (`wallet_connect` RPC), what set of
	 * accounts are exposed?
	 */
	erc7846WalletConnect: Support<WithRef<ExposedAccountSet>>

	/**
	 * When connecting to a new dApp, does the wallet allow creating a new
	 * address or set of addresses as part of the dApp connection flow?
	 */
	createInDappConnectionFlow: Support<WithRef<{}>>

	/**
	 * When connecting to a previously-connected dApp, does the wallet remember
	 * which address(es) the user had selected to connect for that specific
	 * dApp, and use them by default?
	 */
	useDappSpecificLastConnectedAddresses: Support<WithRef<{}>>
}

/**
 * How the wallet isolates dapps from getting data that other dapps may also
 * gather.
 */
export type DappIsolation = BaseDappIsolation &
	// Either `eth_accounts` or `wallet_connect` must be supported.
	(| { ethAccounts: Supported<WithRef<ExposedAccountSet>> }
		| { erc7846WalletConnect: Supported<WithRef<ExposedAccountSet>> }
	)
