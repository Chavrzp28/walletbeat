import { phift } from '@/data/contributors/phift'
import { HardwareWalletManufactureType, WalletProfile } from '@/schema/features/profile'
import { refTodo } from '@/schema/reference'
import { Variant } from '@/schema/variants'
import type { HardwareWallet } from '@/schema/wallet'
import { paragraph } from '@/types/content'

export const keycardShell: HardwareWallet = {
	metadata: {
		id: 'keycardShell',
		displayName: 'Keycard Shell',
		tableName: 'Keycard Shell',
		blurb: paragraph(`
			Keycard Shell is a modular, air-gapped hardware wallet that uses QR code signing
			via ERC-4527. It features a built-in keypad, display, and camera for fully air-gapped
			operation, with optional USB connectivity that can be disabled. The device uses
			removable Keycards for secure key storage, enabling multiple backups across cards.
			Each Shell includes 2 Keycards.
		`),
		contributors: [phift],
		hardwareWalletManufactureType: HardwareWalletManufactureType.FACTORY_MADE,
		hardwareWalletModels: [
			{
				id: 'keycard-shell',
				name: 'Keycard Shell',
				isFlagship: true,
				url: 'https://get.keycard.tech/pages/keycard-shell',
			},
		],
		iconExtension: 'svg',
		lastUpdated: '2025-12-23',
		urls: {
			docs: ['https://keycard.tech/start/shell'],
			repositories: [
				'https://github.com/keycard-tech/keycard-shell',
				'https://github.com/keycard-tech/status-keycard',
			],
			socials: {
				x: 'https://x.com/Keycard_',
			},
			websites: ['https://keycard.tech/', 'https://shell.keycard.tech/'],
		},
	},
	features: {
		accountSupport: null,
		appConnectionSupport: null,
		licensing: null,
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
			dataCollection: null,
			hardwarePrivacy: null,
			privacyPolicy: 'https://keycard.tech/legal/privacy-policy',
			transactionPrivacy: null,
		},
		profile: WalletProfile.GENERIC,
		security: {
			accountRecovery: null,
			bugBountyProgram: null,
			firmware: null,
			keysHandling: null,
			lightClient: {
				ethereumL1: null,
			},
			publicSecurityAudits: null,
			secureElement: null,
			supplyChainDIY: null,
			supplyChainFactory: null,
			transactionLegibility: null,
			userSafety: null,
		},
		selfSovereignty: {
			interoperability: null,
		},
		transparency: {
			maintenance: null,
			operationFees: null,
			reputation: null,
		},
	},
	variants: {
		[Variant.HARDWARE]: true,
	},
}
