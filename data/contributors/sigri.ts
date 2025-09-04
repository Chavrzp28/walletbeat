import type { Contributor } from '@/schema/wallet'
import { mtpelerin } from '@/data/entities/mtpelerin'

export const sigri: Contributor = {
	name: 'sigri',
	affiliation: [
		{
			developer: mtpelerin,
			hasEquity: false,
			role: 'CONSULTANT',
		},
	],
	url: 'https://github.com/sigri44',
}
