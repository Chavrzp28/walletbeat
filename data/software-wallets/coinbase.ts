import { nconsigny } from '@/data/contributors/nconsigny'
import { polymutex } from '@/data/contributors/polymutex'
import { AccountType, TransactionGenerationCapability } from '@/schema/features/account-support'
import { PrivateTransferTechnology } from '@/schema/features/privacy/transaction-privacy'
import { WalletProfile } from '@/schema/features/profile'
import {
	HardwareWalletConnection,
	HardwareWalletType,
	type SupportedHardwareWallet,
} from '@/schema/features/security/hardware-wallet-support'
import { PasskeyVerificationLibrary } from '@/schema/features/security/passkey-verification'
import { TransactionSubmissionL2Type } from '@/schema/features/self-sovereignty/transaction-submission'
import { notSupported, supported } from '@/schema/features/support'
import { License } from '@/schema/features/transparency/license'
import { refTodo } from '@/schema/reference'
import { Variant } from '@/schema/variants'
import type { SoftwareWallet } from '@/schema/wallet'
import { paragraph } from '@/types/content'

import { cantina } from '../entities/cantina'
import { certora } from '../entities/certora'
import { code4rena } from '../entities/code4rena'

export const coinbase: SoftwareWallet = {
	metadata: {
		id: 'coinbase',
		displayName: 'Coinbase Wallet',
		tableName: 'Coinbase',
		blurb: paragraph(`
			Coinbase Wallet is a self-custodial wallet built by Coinbase. It
			integrates with Coinbase exchange accounts to bring them onchain.
		`),
		contributors: [polymutex, nconsigny],
		iconExtension: 'svg',
		lastUpdated: '2025-03-14',
		repoUrl: 'https://github.com/coinbase/smart-wallet',
		url: 'https://www.coinbase.com/wallet',
	},
	features: {
		accountSupport: {
			defaultAccountType: AccountType.eip7702,
			eip7702: supported({
				ref: {
					explanation: 'Coinbase Wallet announced support for EIP-7702.',
					url: 'https://www.coinbase.com/blog/coinbase-wallet-introduces-support-for-eip-7702',
				},
				contract: 'UNKNOWN',
			}),
			eoa: supported({
				ref: refTodo,
				canExportPrivateKey: true,
				canExportSeedPhrase: true,
				keyDerivation: {
					type: 'BIP32',
					canExportSeedPhrase: true,
					derivationPath: 'BIP44',
					seedPhrase: 'BIP39',
				},
			}),
			mpc: notSupported,
			rawErc4337: supported({
				ref: {
					explanation: 'Coinbase Wallet supports ERC-4337 via its smart wallet implementation.',
					url: 'https://github.com/coinbase/smart-wallet',
				},
				contract: 'UNKNOWN',
				controllingSharesInSelfCustodyByDefault: 'YES',
				keyRotationTransactionGeneration: TransactionGenerationCapability.IMPOSSIBLE,
				tokenTransferTransactionGeneration:
					TransactionGenerationCapability.USING_OPEN_SOURCE_STANDALONE_APP,
			}),
			safe: notSupported,
		},
		addressResolution: {
			ref: refTodo,
			chainSpecificAddressing: {
				erc7828: null,
				erc7831: null,
			},
			nonChainSpecificEnsResolution: null,
		},
		chainAbstraction: null,
		chainConfigurability: null,
		ecosystem: {
			delegation: null,
		},
		integration: {
			browser: {
				ref: refTodo,
				'1193': null,
				'2700': null,
				'6963': null,
			},
			walletCall: null,
		},
		license: {
			ref: {
				explanation: 'Coinbase Wallet uses the BSD-3-Clause license for its source code',
				urls: [
					{
						label: 'Coinbase Wallet License File',
						url: 'https://github.com/coinbase/wallet-mobile/blob/master/LICENSE.md',
					},
				],
			},
			license: License.BSD_3_CLAUSE,
		},
		monetization: {
			ref: refTodo,
			revenueBreakdownIsPublic: false,
			strategies: {
				donations: null,
				ecosystemGrants: null,
				governanceTokenLowFloat: null,
				governanceTokenMostlyDistributed: null,
				hiddenConvenienceFees: null,
				publicOffering: null,
				selfFunded: null,
				transparentConvenienceFees: null,
				ventureCapital: null,
			},
		},
		multiAddress: null,
		privacy: {
			appIsolation: null,
			dataCollection: null,
			privacyPolicy: 'https://wallet.coinbase.com/privacy-policy',
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
				ref: refTodo,
				wallets: {
					[HardwareWalletType.LEDGER]: supported<SupportedHardwareWallet>({
						connectionTypes: [HardwareWalletConnection.webUSB],
					}),
				},
			},
			lightClient: {
				ethereumL1: null,
			},
			passkeyVerification: {
				ref: {
					explanation: 'Coinbase uses the webauthn-sol library for passkey verification.',
					url: 'https://github.com/base/webauthn-sol/tree/619f20ab0f074fef41066ee4ab24849a913263b2',
				},
				library: PasskeyVerificationLibrary.WEB_AUTHN_SOL,
				libraryUrl:
					'https://github.com/base/webauthn-sol/tree/619f20ab0f074fef41066ee4ab24849a913263b2',
			},
			publicSecurityAudits: [
				{
					ref: 'https://github.com/coinbase/smart-wallet/blob/main/audits/Cantina-April-2024.pdf',
					auditDate: '2024-04-01',
					auditor: cantina,
					unpatchedFlaws: 'NONE_FOUND',
					variantsScope: 'ALL_VARIANTS',
				},
				{
					ref: 'https://github.com/coinbase/smart-wallet/blob/main/audits/Code4rena-March-2024.md',
					auditDate: '2024-03-01',
					auditor: code4rena,
					unpatchedFlaws: 'NONE_FOUND',
					variantsScope: 'ALL_VARIANTS',
				},
				{
					ref: 'https://github.com/coinbase/smart-wallet/blob/main/audits/Certora-February-2024.pdf',
					auditDate: '2024-02-01',
					auditor: certora,
					unpatchedFlaws: 'NONE_FOUND',
					variantsScope: 'ALL_VARIANTS',
				},
				{
					ref: 'https://github.com/coinbase/smart-wallet/blob/main/audits/Cantina-December-2023.pdf',
					auditDate: '2023-12-01',
					auditor: cantina,
					unpatchedFlaws: 'NONE_FOUND',
					variantsScope: 'ALL_VARIANTS',
				},
			],
			scamAlerts: null,
		},
		selfSovereignty: {
			transactionSubmission: {
				l1: {
					ref: refTodo,
					selfBroadcastViaDirectGossip: null,
					selfBroadcastViaSelfHostedNode: null,
				},
				l2: {
					[TransactionSubmissionL2Type.arbitrum]: null,
					[TransactionSubmissionL2Type.opStack]: null,
					ref: refTodo,
				},
			},
		},
		transparency: {
			operationFees: null,
		},
	},
	variants: {
		[Variant.MOBILE]: true,
		[Variant.BROWSER]: true,
	},
}
