import type { WithRef } from '@/schema/reference'

export enum InteroperabilityType {
	PASS = 'PASS',
	PARTIAL = 'PARTIAL',
	FAIL = 'FAIL',
}

export interface InteroperabilitySupport {
	type: InteroperabilityType
	url?: string
	details?: string
	interoperability: InteroperabilityType
	noSupplierLinkage: InteroperabilityType
}

export type InteroperabilityImplementation = WithRef<InteroperabilitySupport>
