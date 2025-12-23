import type { Contributor } from '@/schema/wallet'

import { keycard } from '../entities/keycard'

export const phift: Contributor = {
	name: 'phift',
	affiliation: [
		{
			developer: keycard,
			hasEquity: false,
			role: 'EMPLOYEE',
		},
	],
}
