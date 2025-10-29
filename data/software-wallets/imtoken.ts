import { mako } from '@/data/contributors/mako'
import { AccountType } from '@/schema/features/account-support'
import type { AddressResolutionData } from '@/schema/features/privacy/address-resolution'
import {
	CollectionPolicy,
	DataCollectionPurpose,
	MultiAddressPolicy,
	RegularEndpoint,
	UserFlow,
	WalletInfo,
} from '@/schema/features/privacy/data-collection'
import { PrivateTransferTechnology } from '@/schema/features/privacy/transaction-privacy'
import { WalletProfile } from '@/schema/features/profile'
import { BugBountyProgramType } from '@/schema/features/security/bug-bounty-program'
import {
	HardwareWalletConnection,
	HardwareWalletType,
	type SupportedHardwareWallet,
} from '@/schema/features/security/hardware-wallet-support'
import { PasskeyVerificationLibrary } from '@/schema/features/security/passkey-verification'
import { RpcEndpointConfiguration } from '@/schema/features/self-sovereignty/chain-configurability'
import {
	TransactionSubmissionL2Support,
	TransactionSubmissionL2Type,
} from '@/schema/features/self-sovereignty/transaction-submission'
import { notSupported, supported } from '@/schema/features/support'
import {
	comprehensiveFeesShownByDefault,
	FeeDisplayLevel,
} from '@/schema/features/transparency/fee-display'
import { License } from '@/schema/features/transparency/license'
import { Variant } from '@/schema/variants'
import type { SoftwareWallet } from '@/schema/wallet'
import { paragraph } from '@/types/content'

import { cure53 } from '../entities/cure53'
import { imToken } from '../entities/imtoken'

export const imtoken: SoftwareWallet = {
	metadata: {
		id: 'imtoken',
		displayName: 'imToken',
		tableName: 'imToken',
		blurb: paragraph(`
			imToken is a reliable and intuitive digital wallet, enabling easy access to over 50+ major networks including Bitcoin, Ethereum, and Tron. imToken supports hardware wallets, token swap and DApp browser etc., and provides secure and trusted non-custodial wallet services to millions of users in more than 150 countries and regions around the world.
		`),
		contributors: [mako],
		iconExtension: 'svg',
		lastUpdated: '2025-10-28',
		repoUrl: 'https://github.com/consenlabs/token-core-monorepo',
		url: 'https://token.im',
	},
	features: {
		accountSupport: {
			defaultAccountType: AccountType.eoa,
			eip7702: notSupported,
			eoa: supported({
				canExportPrivateKey: true,
				keyDerivation: {
					type: 'BIP32',
					canExportSeedPhrase: true,
					derivationPath: 'BIP44',
					seedPhrase: 'BIP39',
				},
			}),
			mpc: notSupported,
			rawErc4337: notSupported,
		},
		addressResolution: {
			chainSpecificAddressing: {
				erc7828: notSupported,
				erc7831: notSupported,
			},
			nonChainSpecificEnsResolution: supported<AddressResolutionData>({
				medium: 'CHAIN_CLIENT',
			}),
			ref: [
				{
					explanation:
						'imToken supports ENS human-readable names and resolves them on-chain before sending funds.',
					url: 'https://support.token.im/hc/articles/360039928813',
				},
			],
		},
		chainAbstraction: supported({
			bridging: {
				builtInBridging: supported({
					feesLargerThan1bps: {
						afterSingleAction: FeeDisplayLevel.COMPREHENSIVE,
						byDefault: FeeDisplayLevel.COMPREHENSIVE,
						fullySponsored: false,
					},
					ref: [
						{
							explanation:
								'imToken provides built-in cross-chain bridging through cBridge and other bridge protocols, with clear risk explanations and fee breakdowns.',
							url: 'https://support.token.im/hc/en-us/articles/4404355206553-How-to-use-cBridge-with-imToken',
						},
					],
					risksExplained: 'VISIBLE_BY_DEFAULT',
				}),
				suggestedBridging: notSupported,
			},
			crossChainBalances: {
				ether: {
					crossChainSumView: notSupported,
					perChainBalanceViewAcrossMultipleChains: notSupported,
				},
				globalAccountValue: notSupported,
				perChainAccountValue: notSupported,
				usdc: {
					crossChainSumView: notSupported,
					perChainBalanceViewAcrossMultipleChains: notSupported,
				},
			},
		}),
		chainConfigurability: {
			customChains: true,
			l1RpcEndpoint: RpcEndpointConfiguration.YES_BEFORE_ANY_REQUEST,
			otherRpcEndpoints: RpcEndpointConfiguration.YES_BEFORE_ANY_REQUEST,
			ref: [
				{
					explanation:
						'imToken allows users to set custom RPC endpoints for any EVM network before sending requests to the default ones.',
					url: 'https://support.token.im/hc/en-us/articles/900005324266-imToken-now-supports-custom-RPC-Experience-the-layer-2-ecosystem-today',
				},
			],
		},
		ecosystem: {
			delegation: null,
		},
		integration: {
			browser: 'NOT_A_BROWSER_WALLET',
			walletCall: null,
		},
		license: {
			[Variant.MOBILE]: {
				license: License.APACHE_2_0,
				ref: [
					{
						explanation:
							'imToken publishes its core code under the Apache-2.0 open-source license.',
						url: 'https://github.com/consenlabs/token-core-monorepo/blob/main/LICENSE',
					},
				],
			},
		},
		monetization: {
			ref: [
				{
					explanation:
						'imToken announced a USD 30 million Series B funding round led by institutional investors.',
					url: 'https://support.token.im/hc/en-us/articles/900005414706-imToken-Announces-US-30-million-Series-B-Investment',
				},
			],
			revenueBreakdownIsPublic: false,
			strategies: {
				donations: false,
				ecosystemGrants: false,
				governanceTokenLowFloat: false,
				governanceTokenMostlyDistributed: false,
				hiddenConvenienceFees: false,
				publicOffering: false,
				selfFunded: false,
				transparentConvenienceFees: true,
				ventureCapital: true,
			},
		},
		multiAddress: supported({
			ref: [
				{
					explanation:
						'Each request only involves one active address, preventing any correlation between multiple addresses.'
				},
			],
		}),
		privacy: {
			appIsolation: {
				[Variant.MOBILE]: null,
			},
			dataCollection: {
				[UserFlow.NATIVE_SWAP]: {
					collected: [],
				},
				[UserFlow.SEND]: {
					collected: [],
				},
				[UserFlow.TRANSACTION]: {
					collected: [
						{
							byEntity: imToken,
							dataCollection: {
								[WalletInfo.ACCOUNT_ADDRESS]: CollectionPolicy.ALWAYS,
								endpoint: RegularEndpoint,
								multiAddress: {
									type: MultiAddressPolicy.ACTIVE_ADDRESS_ONLY,
								},
							},
							purposes: [DataCollectionPurpose.CHAIN_DATA_LOOKUP],
							ref: [
								{
									explanation:
										"Technically, imToken could associate your wallet address with your mobile network’s dynamic IP address, but it strictly follows privacy principles and never collects personally identifiable information (PII). Each request only involves one active address, preventing any correlation between multiple addresses.",
									url: 'https://token.im/tos-en.html',
								},
							],
						},
					],
				},
				[UserFlow.APP_CONNECTION]: {
					collected: [],
				},
				[UserFlow.ONBOARDING]: {
					collected: [],
					publishedOnchain: 'NO_DATA_PUBLISHED_ONCHAIN',
				},
			},
			privacyPolicy: 'https://token.im/tos-en.html',
			transactionPrivacy: {
				defaultFungibleTokenTransferMode: 'PUBLIC',
				[PrivateTransferTechnology.STEALTH_ADDRESSES]: notSupported,
				[PrivateTransferTechnology.TORNADO_CASH_NOVA]: notSupported,
				[PrivateTransferTechnology.PRIVACY_POOLS]: notSupported,
			},
		},
		profile: WalletProfile.GENERIC,
		security: {
			bugBountyProgram: {
				type: BugBountyProgramType.COMPREHENSIVE,
				details:
					'imToken operates a comprehensive bug bounty program through Bugrap platform, covering both the wallet and the website. The program has a wide scope, competitive rewards, and a responsive disclosure process.',
				ref: [
					{
						explanation:
							'imToken bug bounty program covers both wallet and website security vulnerabilities.',
						url: 'https://bugrap.io/bounties/imToken%20Wallet',
					},
					{
						explanation: 'imToken website bug bounty program for security vulnerabilities.',
						url: 'https://bugrap.io/bounties/imToken%20Website',
					},
				],
				upgradePathAvailable: true,
				url: 'https://bugrap.io/bounties/imToken%20Wallet',
			},
			hardwareWalletSupport: {
				[Variant.MOBILE]: {
					ref: [
						{
							explanation:
								'imToken works with the imKey Bluetooth hardware wallet and with Keystone via QR codes.',
							url: 'https://support.token.im/hc/en-us/articles/25985632007193-imToken-and-Hardware-Wallets-Uncompromised-Protection-Unparalleled-Convenience',
						},
					],
					wallets: {
						[HardwareWalletType.KEYSTONE]: supported<SupportedHardwareWallet>({
							connectionTypes: [HardwareWalletConnection.QR],
						}),
						[HardwareWalletType.OTHER]: supported<SupportedHardwareWallet>({
							connectionTypes: [HardwareWalletConnection.bluetooth],
						}),
					},
				},
			},
			lightClient: {
				ethereumL1: notSupported,
			},
			passkeyVerification: {
				[Variant.MOBILE]: {
					library: PasskeyVerificationLibrary.NONE,
					ref: null,
				},
			},
			publicSecurityAudits: [
				{
					auditDate: '2018-05-07',
					auditor: cure53,
					ref: [
						{
							explanation:
								"imToken underwent a comprehensive security audit by Cure53 in 2018. While the core codebase has remained stable, the audit is now more than six years old. Since then, imToken has maintained a rigorous internal audit process for each release.",
							url: 'https://cure53.de/pentest-report_imtoken.pdf',
						},
					],
					unpatchedFlaws: 'ALL_FIXED',
					variantsScope: 'ALL_VARIANTS',
				},
			],
			scamAlerts: {
				contractTransactionWarning: supported({
					contractRegistry: true,
					leaksContractAddress: true,
					leaksUserAddress: true,
					leaksUserIp: true,
					previousContractInteractionWarning: true,
					recentContractWarning: false,
					ref: [
						{
							explanation:
								'imToken displays detailed contract interaction information including token quantity changes, authorization details (approve and permit), and warns when transferring funds to contract addresses or authorizing ordinary accounts. It also alerts users about high slippage during token swapping.',
							url: 'https://support.token.im/hc/en-us/articles/21850966355737-Revamped-imToken-signature-for-safer-and-more-intuitive-transactions',
						},
					],
				}),
				scamUrlWarning: supported({
					leaksIp: false,
					leaksUserAddress: false,
					leaksVisitedUrl: 'NO',
					ref: [
						{
							explanation:
								'imToken warns about risky signatures such as eth_sign, non-standard EIP-712 Type signatures, and ENS security risks including zero-width characters. It also marks risky tokens, addresses, and DApps.',
							url: 'https://support.token.im/hc/en-us/articles/21850966355737-Revamped-imToken-signature-for-safer-and-more-intuitive-transactions',
						},
					],
				}),
				sendTransactionWarning: notSupported,
			},
		},
		selfSovereignty: {
			transactionSubmission: {
				l1: {
					selfBroadcastViaDirectGossip: notSupported,
					selfBroadcastViaSelfHostedNode: null,
				},
				l2: {
					[TransactionSubmissionL2Type.arbitrum]:
						TransactionSubmissionL2Support.NOT_SUPPORTED_BY_WALLET_BY_DEFAULT,
					[TransactionSubmissionL2Type.opStack]:
						TransactionSubmissionL2Support.NOT_SUPPORTED_BY_WALLET_BY_DEFAULT,
				},
			},
		},
		transparency: {
			operationFees: {
				builtInErc20Swap: null,
				erc20L1Transfer: supported(comprehensiveFeesShownByDefault),
				ethL1Transfer: supported(comprehensiveFeesShownByDefault),
				uniswapUSDCToEtherSwap: null,
			},
		},
	},
	variants: {
		[Variant.MOBILE]: true,
	},
}
