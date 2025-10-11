import type { WithRef } from '@/schema/reference'

import type { Support } from '../support'

/**
 * What set of accounts are exposed?
 */
export enum ExposedAccountsBehavior {
	/** The wallet exposes all user accounts. */
	ALL_ACCOUNTS = 'ALL_ACCOUNTS',

	/** The wallet exposes only the active account. */
	ACTIVE_ACCOUNT_ONLY = 'ACTIVE_ACCOUNT_ONLY',

	/** The wallet exposes a dapp-specific address. */
	DAPP_SPECIFIC_ACCOUNT = 'DAPP_SPECIFIC_ACCOUNT',
}

/** Set of exposed accounts. */
export interface ExposedAccountSet {
	/** What set of accounts is exposed by default? */
	defaultBehavior: ExposedAccountsBehavior

	/**
	 * Does the user have control over which set of accounts is exposed over
	 * the default?
	 */
	userCustomizable: boolean
}

/**
 * How the wallet isolates dapps from getting data that other dapps may also
 * gather.
 */
export interface DappIsolation {
	/**
	 * How does the wallet handle the `eth_accounts` RPC?
	 */
	ethAccounts: Support<WithRef<ExposedAccountSet>>

	/**
	 * If the wallet supports ERC-7846 (`wallet_connect` RPC), what set of
	 * accounts are exposed?
	 */
	erc7846WalletConnect: Support<WithRef<ExposedAccountSet>>
}
