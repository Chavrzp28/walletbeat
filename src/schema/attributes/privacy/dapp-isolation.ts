import {
	type Attribute,
	type Evaluation,
	exampleRating,
	exampleRatingUnimplemented,
	Rating,
	type Value,
} from '@/schema/attributes'
import { type ResolvedFeatures } from '@/schema/features'
import {
	type DappIsolation,
	ExposedAccountsBehavior,
	type ExposedAccountSet,
	sameExposedAccountSet,
} from '@/schema/features/privacy/dapp-isolation'
import { featureSupported, isSupported, notSupported, supported } from '@/schema/features/support'
import { type FullyQualifiedReference, mergeRefs } from '@/schema/reference'
import { WalletType } from '@/schema/wallet-types'
import { markdown, mdParagraph, paragraph, sentence } from '@/types/content'

import { exempt, pickWorstRating, unrated } from '../common'

const brand = 'attributes.privacy.dapp_isolation'

export type DappIsolationValue = Value & {
	__brand: 'attributes.privacy.dapp_isolation'
}

function rateDappIsolation(dappIsolation: DappIsolation): Evaluation<DappIsolationValue> {
	let references: FullyQualifiedReference[] = []

	if (!isSupported(dappIsolation.createInDappConnectionFlow)) {
		return {
			value: {
				id: 'no_account_creation_in_connection_flow',
				displayName: 'No per-dApp account option',
				rating: Rating.FAIL,
				shortExplanation: sentence(`
					{{WALLET_NAME}} does not have an option to create a new account
					as part of the dApp connection flow.
				`),
				__brand: brand,
			},
			details: markdown(`
				When connecting to a dApp, {{WALLET_NAME}} does not provide a way
				to create a new account unique to the dApp.
			`),
			impact: paragraph(`
				Without per-dApp accounts, dApps can correlate a user's history and
				activity across web3. While this has composability benefits, having
				this as default behavior creates an irreversible privacy problem and
				a regression from the low bar of web2 privacy practices.
			`),
			howToImprove: markdown(`
				{{WALLET_NAME}} should have a way to create a dApp-specific account
				as part of the dApp connection flow, and have this as the default
				option.
			`),
			references,
		}
	}

	references = mergeRefs(references, dappIsolation.createInDappConnectionFlow.ref)

	if (!isSupported(dappIsolation.useDappSpecificLastConnectedAddresses)) {
		return {
			value: {
				id: 'no_reuse_last_connection_addresses',
				displayName: 'No per-dApp account persistence',
				rating: Rating.FAIL,
				shortExplanation: sentence(`
					{{WALLET_NAME}} does not remember which set of addresses you last
					used when connecting to a dApp.
				`),
				__brand: brand,
			},
			details: markdown(`
				When connecting to a dApp you have connected to before,
				{{WALLET_NAME}} does not default to the same set of addresses as you
				had last selected.
			`),
			impact: paragraph(`
				{{WALLET_NAME}} makes it likely for the user to accidentally expose
				other addresses beyond the one they had initially intended for
				the dApp to be able to access. Once connected, this allows the dApp to
				correlate more of the user's activity than the user had initially
				intended.
			`),
			howToImprove: markdown(`
				{{WALLET_NAME}} should locally store the set of addresses that the
				user selected when connecting to dApps, and use this set of addresses
				by default when reconnecting to them.
			`),
			references,
		}
	}

	references = mergeRefs(references, dappIsolation.useDappSpecificLastConnectedAddresses.ref)

	let commonExposedAccountSet: ExposedAccountSet | null = null

	for (const exposedAccountSet of [dappIsolation.ethAccounts, dappIsolation.erc7846WalletConnect]) {
		if (!isSupported(exposedAccountSet)) {
			continue
		}

		references = mergeRefs(references, exposedAccountSet.ref)

		if (commonExposedAccountSet === null) {
			commonExposedAccountSet = exposedAccountSet
			continue
		}

		if (!sameExposedAccountSet(commonExposedAccountSet, exposedAccountSet)) {
			throw new Error('Unimplemented; implement this when a wallet actually does this.')
		}
	}

	if (commonExposedAccountSet === null) {
		throw new Error('Unreachable by type system')
	}

	switch (commonExposedAccountSet.defaultBehavior) {
		case ExposedAccountsBehavior.ACTIVE_ACCOUNT_ONLY:
			return {
				value: {
					id: 'active_account_only',
					displayName: 'Encourages account reuse across dApps',
					rating: Rating.FAIL,
					shortExplanation: sentence(`
						{{WALLET_NAME}} defaults to reusing the same account when
						connecting to various dApps.
					`),
					__brand: brand,
				},
				details: markdown(`
					When connecting to a new dApp, {{WALLET_NAME}} uses the same
					account as it does when connecting to any other dApp by default.
				`),
				impact: paragraph(`
					By reusing the same accounts across dApps, all dApps can correlate
					a user's history and activity across web3. While this has
					composability benefits, having this as default behavior creates
					an irreversible privacy problem and a regression from the low bar
					of web2 privacy practices.
				`),
				howToImprove: markdown(`
					When connecting to a new dApp, {{WALLET_NAME}} should offer to
					create a new account for that dApp by default.
				`),
				references,
			}
		case ExposedAccountsBehavior.ALL_ACCOUNTS:
			return {
				value: {
					id: 'all_accounts_exposed',
					displayName: 'All accounts exposed to all dApps',
					rating: Rating.FAIL,
					shortExplanation: sentence(`
						{{WALLET_NAME}} exposes all your accounts to all connected
						dApps by default.
					`),
					__brand: brand,
				},
				details: markdown(`
					When connecting to a dApp, {{WALLET_NAME}} exposes all your
					accounts by default.
				`),
				impact: paragraph(`
					By reusing the same accounts across dApps, all dApps can correlate
					a user's history and activity across web3. While this has
					composability benefits, having this as default behavior creates
					an irreversible privacy problem and a regression from the low bar
					of web2 privacy practices.
				`),
				howToImprove: markdown(`
					When connecting to a new dApp, {{WALLET_NAME}} should offer to
					create a new account for that dApp by default.
				`),
				references,
			}
		case ExposedAccountsBehavior.DAPP_SPECIFIC_ACCOUNT:
			return {
				value: {
					id: 'dapp_specific_account',
					displayName: 'Per-dApp account',
					rating: Rating.PASS,
					shortExplanation: sentence(`
						{{WALLET_NAME}} creates dApp-specific accounts by default.
					`),
					__brand: brand,
				},
				details: markdown(`
					When connecting to a dApp, {{WALLET_NAME}} offers the user to
					create a new dApp-specific account by default.
					Doing so improves your privacy across web3 by preventing dApps
					from correlating your history across dApps.
				`),
				references,
			}
		case ExposedAccountsBehavior.NO_DEFAULT:
			return {
				value: {
					id: 'no_default_behavior',
					displayName: 'Supports per-dApp accounts',
					rating: Rating.PARTIAL,
					shortExplanation: sentence(`
						{{WALLET_NAME}} supports the creation of dApp-specific accounts.
						However, this isn't the default.
					`),
					__brand: brand,
				},
				details: markdown(`
					When connecting to a dApp, {{WALLET_NAME}} offers the user to
					create a new dApp-specific account.
					Doing so improves your privacy across web3 by preventing dApps
					from correlating your history across dApps.
					However, this isn't the default option, which can encourage
					users to reuse accounts across dApps nonetheless.
				`),
				references,
			}
	}
}

export const dappIsolation: Attribute<DappIsolationValue> = {
	id: 'dappIsolation',
	icon: '\u{1f3dd}', // Desert island
	displayName: 'dApp isolation',
	wording: {
		midSentenceName: 'dApp isolation',
	},
	question: sentence(`
		If you connect to a dApp, will it be able to learn your past activity
		from other dApps by default?
	`),
	why: markdown(`
		On the web, website \`A\` is not allowed to query your browsing history from
		website \`B\` by default. This ensures your browsing activity remains private
		across websites. This principle is enshrined in the HTTP protocol as the
		[**Same-Origin Policy**](hhttps://en.wikipedia.org/wiki/Same-origin_policy):
		by default, each website has its own isolated data about a user,
		and may not obtain any other information without explicit consent.

		In web3, address reuse allows dApps to correlate your usage and browsing
		history across other dApps. While this can be a useful feature that
		enables easy composability, it is also an irreversible privacy problem
		and a regression from web2-level privacy.

		For web3 to avoid perpetuating this privacy problem, users need to be
		able to control the amount of information each new dApp may learn about
		their past onchain history.

		Maintaining per-dApp accounts creates complex fragmentation and UX issues
		which are difficult to abstract away from users. Nonetheless, address
		reuse creates an indelible data trail for users.
	`),
	methodology: markdown(`
		Wallets are assessed based on whether they make it easy for the user to
		create a distinct account for each new dApp they use, and whether this is
		the default choice.

		When connecting to dApps that the user previously connected to, the
		wallet must use the address(es) that were last used for this specific
		dApp.

		Wallets that do not support connecting to dApps are exempt from this
		attribute.
	`),
	ratingScale: {
		display: 'fail-pass',
		exhaustive: true,
		fail: [
			exampleRating(
				paragraph(`
					The wallet does not allow the creation of per-dApp accounts
					during the dApp connection flow.
				`),
				rateDappIsolation({
					ethAccounts: supported({
						defaultBehavior: ExposedAccountsBehavior.ACTIVE_ACCOUNT_ONLY,
					}),
					erc7846WalletConnect: supported({
						defaultBehavior: ExposedAccountsBehavior.ACTIVE_ACCOUNT_ONLY,
					}),
					createInDappConnectionFlow: notSupported,
					useDappSpecificLastConnectedAddresses: featureSupported,
				}),
			),
			exampleRating(
				paragraph(`
					The wallet does not remember the address (or set of addresses)
					that was last used when connecting to a previously-connected dApp.
				`),
				rateDappIsolation({
					ethAccounts: supported({
						defaultBehavior: ExposedAccountsBehavior.DAPP_SPECIFIC_ACCOUNT,
					}),
					erc7846WalletConnect: supported({
						defaultBehavior: ExposedAccountsBehavior.DAPP_SPECIFIC_ACCOUNT,
					}),
					createInDappConnectionFlow: featureSupported,
					useDappSpecificLastConnectedAddresses: notSupported,
				}),
			),
			exampleRating(
				paragraph(`
					The wallet supports creating per-dApp accounts when connecting to
					a dApp, but the default behavior is to reuse existing accounts.
				`),
				rateDappIsolation({
					ethAccounts: supported({
						defaultBehavior: ExposedAccountsBehavior.ACTIVE_ACCOUNT_ONLY,
					}),
					erc7846WalletConnect: supported({
						defaultBehavior: ExposedAccountsBehavior.ACTIVE_ACCOUNT_ONLY,
					}),
					createInDappConnectionFlow: featureSupported,
					useDappSpecificLastConnectedAddresses: featureSupported,
				}),
			),
			exampleRating(
				mdParagraph(`
					The wallet has different behavior across the dApp connection
					standards it supports:
					\`eth_accounts\` RPC vs ERC-7846 \`wallet_connect\` RPC.
				`),
				exampleRatingUnimplemented,
			),
		],
		pass: [
			exampleRating(
				paragraph(`
					The wallet supports creating per-dApp accounts when connecting to
					a dApp, and encourages the user to do this by default.
				`),
				rateDappIsolation({
					ethAccounts: supported({
						defaultBehavior: ExposedAccountsBehavior.DAPP_SPECIFIC_ACCOUNT,
					}),
					erc7846WalletConnect: supported({
						defaultBehavior: ExposedAccountsBehavior.DAPP_SPECIFIC_ACCOUNT,
					}),
					createInDappConnectionFlow: featureSupported,
					useDappSpecificLastConnectedAddresses: featureSupported,
				}),
			),
		],
	},
	evaluate: (features: ResolvedFeatures): Evaluation<DappIsolationValue> => {
		if (features.type !== WalletType.SOFTWARE) {
			return exempt(
				dappIsolation,
				sentence('Only software wallets are expected to deal with connecting to dApps.'),
				brand,
				null,
			)
		}

		if (features.privacy.dappIsolation === null) {
			return unrated(dappIsolation, brand, null)
		}

		if (features.privacy.dappIsolation === 'DAPP_CONNECTION_NOT_SUPPORTED') {
			return exempt(
				dappIsolation,
				sentence('{{WALLET_NAME}} does not support connecting to dApps.'),
				brand,
				null,
			)
		}

		return rateDappIsolation(features.privacy.dappIsolation)
	},
	aggregate: pickWorstRating<DappIsolationValue>,
}
