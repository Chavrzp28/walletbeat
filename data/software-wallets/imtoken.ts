import { polymutex } from '@/data/contributors/polymutex'
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
import { featureSupported, notSupported, supported } from '@/schema/features/support'
import { comprehensiveFeesShownByDefault } from '@/schema/features/transparency/fee-display'
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
			Founded in 2016 with a focus on Ethereum mobile wallets, imToken has grown into a popular multichain wallet supporting over 50 major networks — including Ethereum, Bitcoin, and Tron — with a mission to build the most reliable and intuitive digital wallet that gives everyone equal access to the tokenized world.
		`),
		contributors: [polymutex],
		iconExtension: 'svg',
		lastUpdated: '2025-05-05',
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
					url: 'https://support.token.im/hc/en-us/categories/360000120973',
				},
			],
		},
		chainAbstraction: null,
		chainConfigurability: {
			customChains: true,
			l1RpcEndpoint: RpcEndpointConfiguration.YES_BEFORE_ANY_REQUEST,
			otherRpcEndpoints: RpcEndpointConfiguration.YES_BEFORE_ANY_REQUEST,
			ref: [
				{
					explanation:
						'imToken allows users to configure custom RPC endpoints for any network, including Ethereum mainnet, before making any requests to the default endpoints.',
					url: 'https://support.token.im/hc/en-us/articles/900000039643',
				},
			],
		},
		ecosystem: {
			delegation: null,
		},
		integration: {
			browser: null,
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
		multiAddress: featureSupported,
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
										'imToken only makes requests about one active address at a time, so it cannot be correlated with other addresses.',
									url: 'https://support.token.im/',
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
			privacyPolicy: 'https://token.im/privacy',
			transactionPrivacy: {
				defaultFungibleTokenTransferMode: 'PUBLIC',
				[PrivateTransferTechnology.STEALTH_ADDRESSES]: notSupported,
				[PrivateTransferTechnology.TORNADO_CASH_NOVA]: notSupported,
				[PrivateTransferTechnology.PRIVACY_POOLS]: notSupported,
			},
		},
		profile: WalletProfile.GENERIC,
		security: {
			bugBountyProgram: null,
				hardwareWalletSupport: {
				[Variant.MOBILE]: {
					ref: [
						{
							explanation:
								'imToken works with the imKey Bluetooth hardware wallet and with Keystone via QR codes. imToken mobile also supports Ledger and Trezor hardware wallets via Bluetooth connection.',
							url: 'https://support.token.im/hc/en-us/articles/360000670394',
						},
					],
					wallets: {
						[HardwareWalletType.LEDGER]: supported<SupportedHardwareWallet>({
							connectionTypes: [HardwareWalletConnection.bluetooth],
						}),
						[HardwareWalletType.TREZOR]: supported<SupportedHardwareWallet>({
							connectionTypes: [HardwareWalletConnection.bluetooth],
						}),
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
					ref: 'https://cure53.de/pentest-report_imtoken.pdf',
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
				sendTransactionWarning: supported({
					leaksRecipient: false,
					leaksUserAddress: false,
					leaksUserIp: false,
					newRecipientWarning: true,
					ref: [
						{
							explanation:
								'imToken warns when sending to new addresses for the first time and displays address details with historical interaction records to help users verify address accuracy.',
							url: 'https://support.token.im/hc/en-us/articles/21850966355737-Revamped-imToken-signature-for-safer-and-more-intuitive-transactions',
						},
					],
					userWhitelist: false,
				}),
			},
		},
		selfSovereignty: {
			transactionSubmission: {
				l1: {
					selfBroadcastViaDirectGossip: notSupported,
					selfBroadcastViaSelfHostedNode: supported({
						ref: [
							{
								explanation:
									'imToken can broadcast transactions through a custom RPC that the user operates.',
								url: 'https://support.token.im/hc/en-us/articles/900000039643',
							},
						],
					}),
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
