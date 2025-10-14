import type { Contributor } from '@/schema/wallet'

import { gemEntity } from '../entities/gem'

export const h3rman: Contributor = {
	// cspell:disable-next-line
	name: '0xh3rman',
	affiliation: [
		{
			developer: gemEntity,
			hasEquity: true,
			role: 'EMPLOYEE',
		},
	],
	// cspell:disable-next-line
	url: 'https://github.com/0xh3rman',
}
