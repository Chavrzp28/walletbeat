import { nconsigny } from '@/data/contributors/nconsigny'
import { ackee } from '@/data/entities/ackee'
import { certora } from '@/data/entities/certora'
import { AccountType, TransactionGenerationCapability } from '@/schema/features/account-support'
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
import { FeeDisplayLevel } from '@/schema/features/transparency/fee-display' // for level
import { License } from '@/schema/features/transparency/license' // assuming path
import { Variant } from '@/schema/variants'
import type { SoftwareWallet } from '@/schema/wallet'
import { paragraph } from '@/types/content'

export const safe: SoftwareWallet = {
	metadata: {
		id: 'safe',
		displayName: 'Safe',
		tableName: 'Safe',
		blurb: paragraph(`
			Safe (formerly Gnosis Safe) is a smart contract wallet focused on secure asset management
			with multi-signature functionality for individuals and organizations.
		`),
		contributors: [nconsigny],
		iconExtension: 'svg',
		lastUpdated: '2025-03-12',
		repoUrl: 'https://github.com/safe-global',
		url: 'https://safe.global',
	},
	features: {
		accountSupport: {
			defaultAccountType: AccountType.safe,
			eip7702: notSupported,
			eoa: notSupported,
			mpc: notSupported,
			rawErc4337: supported({
				contract: 'UNKNOWN',
				controllingSharesInSelfCustodyByDefault: 'YES',
				keyRotationTransactionGeneration:
					TransactionGenerationCapability.USING_OPEN_SOURCE_STANDALONE_APP,
				ref: {
					explanation: 'Safe supports ERC-4337 via their 4337 module implementation',
					url: 'https://github.com/safe-global/safe-modules/tree/master/4337',
				},
				tokenTransferTransactionGeneration:
					TransactionGenerationCapability.USING_OPEN_SOURCE_STANDALONE_APP,
			}),
			safe: supported({
				canDeployNew: true,
				controllingSharesInSelfCustodyByDefault: 'YES',
				defaultConfig: {
					modules: [],
					owners: 1,
					threshold: 1,
				},
				keyRotationTransactionGeneration:
					TransactionGenerationCapability.USING_OPEN_SOURCE_STANDALONE_APP,
				supportedConfigs: {
					maxOwners: 'unlimited',
					minOwners: 1,
					moduleSupport: 'full',
					supportsAnyThreshold: true,
				},
				supportsKeyRotationWithoutModules: true,
				tokenTransferTransactionGeneration:
					TransactionGenerationCapability.USING_OPEN_SOURCE_STANDALONE_APP,
			}),
		},
		addressResolution: {
			chainSpecificAddressing: {
				erc7828: null,
				erc7831: null,
			},
			nonChainSpecificEnsResolution: null,
			ref: null,
		},
		chainAbstraction: null,
		chainConfigurability: {
			customChains: false,
			l1RpcEndpoint: RpcEndpointConfiguration.YES_BEFORE_ANY_REQUEST,
			otherRpcEndpoints: RpcEndpointConfiguration.YES_BEFORE_ANY_REQUEST,
		},
		ecosystem: {
			delegation: null,
		},
		integration: {
			browser: {
				'1193': null,
				'2700': null,
				'6963': null,
				ref: null,
			},
			walletCall: supported({
				atomicMultiTransactions: featureSupported,
				ref: {
					explanation: 'Safe supports EIP-5792 for transaction batching.',
					url: 'https://github.com/safe-global/safe-wallet-monorepo/blob/f918ceb9b561dd3a27af96903071cd56c1fb5ddd/apps/web/src/services/safe-wallet-provider/index.ts#L184',
				},
			}),
		},
		license: {
			license: License.GPL_3_0,
			ref: [
				{
					explanation: 'Safe uses the LGPL-3.0 license for its source code', // keep explanation but change enum if needed
					label: 'Safe License File',
					url: 'https://github.com/safe-global/safe-wallet-monorepo',
				},
			],
		},
		monetization: {
			ref: [
				{
					explanation:
						'SafeDAO has received ecosystem grants; example Optimism grant proposal in the Optimism governance forum.',
					url: 'https://gov.optimism.io/t/draft-gf-phase-1-proposal-old-template-safe/3400',
				},
				{
					explanation:
						'Safe community updates covering grants and RPGF-related support across ecosystems.',
					url: 'https://forum.safe.global/t/safedao-community-updates/4213',
				},
				{
					explanation:
						'Community‑Aligned Fees: revenue (e.g., Native Swaps) pledged to SafeDAO; fee approach is explained publicly.',
					url: 'https://safefoundation.org/blog/safedao-community-aligned-fees-introduction',
				},
				{
					explanation:
						'SAFE tokenomics and governance scope; currently primarily used for SafeDAO treasury resource allocation (e.g., grants).',
					url: 'https://safefoundation.org/blog/safe-tokenomics',
				},
			],
			revenueBreakdownIsPublic: false,
			strategies: {
				donations: false,
				ecosystemGrants: true,
				governanceTokenLowFloat: false,
				governanceTokenMostlyDistributed: false,
				hiddenConvenienceFees: false,
				publicOffering: false,
				selfFunded: false,
				transparentConvenienceFees: true, // based on community-aligned fees
				ventureCapital: false,
			},
		},
		multiAddress: null,
		privacy: {
			appIsolation: null,
			dataCollection: null,
			privacyPolicy: 'https://safe.global/privacy',
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
				ref: {
					explanation:
						'Safe natively supports Ledger and Trezor over USB, and Keystone and GridPlus Lattice1 via QR / WalletConnect; any other hardware wallet that works through MetaMask or a similar connector can also act as a Safe signer.',
					url: 'https://help.safe.global/en/articles/40824-what-hardware-wallets-are-supported',
				},
				wallets: {
					[HardwareWalletType.LEDGER]: supported<SupportedHardwareWallet>({
						connectionTypes: [HardwareWalletConnection.webUSB],
					}),
					[HardwareWalletType.TREZOR]: supported<SupportedHardwareWallet>({
						connectionTypes: [HardwareWalletConnection.webUSB],
					}),
					[HardwareWalletType.KEYSTONE]: supported<SupportedHardwareWallet>({
						connectionTypes: [HardwareWalletConnection.WALLET_CONNECT],
					}),
					[HardwareWalletType.GRIDPLUS]: supported<SupportedHardwareWallet>({
						connectionTypes: [HardwareWalletConnection.WALLET_CONNECT],
					}),
				},
			},
			lightClient: {
				ethereumL1: null,
			},
			passkeyVerification: {
				details: 'Safe uses FreshCryptoLib for passkey verification in their 4337 modules.',
				library: PasskeyVerificationLibrary.FRESH_CRYPTO_LIB,
				libraryUrl:
					'https://github.com/safe-global/safe-modules/tree/main/modules/passkey/contracts/vendor/FCL',
				ref: [
					{
						url: 'https://github.com/safe-global/safe-modules/tree/main/modules/passkey/contracts/vendor/FCL',
					},
					{
						explanation: 'Safe uses FCL P256 verifier for passkey verification.',
						url: 'https://github.com/safe-global/safe-modules/blob/main/modules/passkey/contracts/verifiers/FCLP256Verifier.sol',
					},
				],
			},
			publicSecurityAudits: [
				{
					auditDate: '2025-01-14',
					auditor: certora,
					ref: 'https://github.com/safe-global/safe-smart-account/blob/main/docs/Safe_Audit_Report_1_5_0_Certora.pdf',
					unpatchedFlaws: 'NONE_FOUND',
					variantsScope: 'ALL_VARIANTS',
				},
				{
					auditDate: '2025-05-28',
					auditor: ackee,
					ref: 'https://github.com/safe-global/safe-smart-account/blob/main/docs/Safe_Audit_Report_1_5_0_Ackee.pdf',
					unpatchedFlaws: 'NONE_FOUND',
					variantsScope: 'ALL_VARIANTS',
				},
			],
			scamAlerts: {
				contractTransactionWarning: supported({
					contractRegistry: true, //blockaid
					leaksContractAddress: true,
					leaksUserAddress: true,
					leaksUserIp: true,
					previousContractInteractionWarning: false,
					recentContractWarning: true, //blockaid
				}),
				scamUrlWarning: supported({
					leaksIp: true,
					leaksUserAddress: true,
					leaksVisitedUrl: 'FULL_URL',
				}),
				sendTransactionWarning: supported({
					leaksRecipient: true,
					leaksUserAddress: true,
					leaksUserIp: true,
					newRecipientWarning: true, //blockaid
					userWhitelist: true,
				}),
			},
		},
		selfSovereignty: {
			transactionSubmission: {
				l1: {
					selfBroadcastViaDirectGossip: notSupported,
					selfBroadcastViaSelfHostedNode: featureSupported,
				},
				l2: {
					[TransactionSubmissionL2Type.arbitrum]:
						TransactionSubmissionL2Support.SUPPORTED_BUT_NO_FORCE_INCLUSION,
					[TransactionSubmissionL2Type.opStack]:
						TransactionSubmissionL2Support.SUPPORTED_BUT_NO_FORCE_INCLUSION,
				},
			},
		},
		transparency: {
			operationFees: {
				builtInErc20Swap: supported({
					afterSingleAction: FeeDisplayLevel.COMPREHENSIVE,
					byDefault: FeeDisplayLevel.COMPREHENSIVE,
					fullySponsored: false,
				}),
				erc20L1Transfer: supported({
					afterSingleAction: FeeDisplayLevel.COMPREHENSIVE,
					byDefault: FeeDisplayLevel.COMPREHENSIVE,
					fullySponsored: false,
				}),
				ethL1Transfer: supported({
					afterSingleAction: FeeDisplayLevel.COMPREHENSIVE,
					byDefault: FeeDisplayLevel.COMPREHENSIVE,
					fullySponsored: false,
				}),
				uniswapUSDCToEtherSwap: supported({
					afterSingleAction: FeeDisplayLevel.COMPREHENSIVE,
					byDefault: FeeDisplayLevel.COMPREHENSIVE,
					fullySponsored: false,
				}),
			},
		},
	},
	variants: {
		[Variant.MOBILE]: true,
		[Variant.BROWSER]: true,
	},
}
