import type { CorporateEntity, WalletDeveloper } from '@/schema/entity'

export const imToken: CorporateEntity & WalletDeveloper = {
	id: 'imtoken',
	name: 'imToken',
	legalName: { name: 'imToken', soundsDifferent: false },
	type: {
		chainDataProvider: false,
		corporate: true,
		dataBroker: false,
		exchange: false,
		offchainDataProvider: false,
		securityAuditor: false,
		transactionBroadcastProvider: false,
		walletDeveloper: true,
	},
	crunchbase: 'https://www.crunchbase.com/organization/imtoken',
	farcaster: { type: 'NO_FARCASTER_PROFILE' },
	icon: {
		extension: 'svg',
	},
	jurisdiction: 'China',
	linkedin: 'https://www.linkedin.com/company/imtoken',
	privacyPolicy: 'https://token.im/privacy',
	repoUrl: 'https://github.com/consenlabs/token-core-monorepo',
	twitter: 'https://twitter.com/imTokenOfficial',
	url: 'https://token.im/',
}
