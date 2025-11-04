import type { WithRef, MustRef } from '@/schema/reference'
import type { Support } from '../support'

/**
 * Platforms of bug bounty programs
 */
export enum BugBountyPlatform {
	SELF_HOSTED = 'Self-hosted',
	HACKER_ONE = 'Hacker One',
	BUG_CROWD = 'Bugcrowd',
	INTIGRITI = 'Intigriti',
}

/**
 * Types of legal protection provided to security researchers
 * SAFE_HARBOR: Explicit Safe Harbor language
 * LEGAL_ASSURANCE: Pledges not to sue, similar protections
 */
export enum LegalProtectionType {
	SAFE_HARBOR = 'SAFE_HARBOR',
	LEGAL_ASSURANCE = 'LEGAL_ASSURANCE',
}

/**
 * Information about legal protections for security researchers
 */
export type LegalProtection = MustRef<{
	/**
	 * The type of legal protection provided
	 */
	type: LegalProtectionType

	/**
	 * Specific details or excerpt of the legal protection language
	 */
	details?: string
}>

/**
 * The availability of the bug bounty program
 */
export enum BugBountyProgramAvailability {
	ACTIVE = 'ACTIVE', // Running now, accepting reports
	INACTIVE = 'INACTIVE', // Temporarily paused
	NEVER = 'NEVER', // Never existed
}

/**
 * The coverage breadth of the bug bounty program
 */
export enum CoverageBreadth {
	FULL = 'FULL',
	PARTIAL = 'PARTIAL',
	APP_ONLY = 'APP_ONLY',
	FIRMWARE_ONLY = 'FIRMWARE_ONLY',
	HARDWARE_ONLY = 'HARDWARE_ONLY',
	NONE = 'NONE',
}

/**
 * Information about the bug bounty program implementation
 */
export type BugBountyProgramSupport = WithRef<{
	/**
	 * The date the bug bounty program started
	 */
	dateStarted: Date

	/**
	 * The availability of the bug bounty program
	 */
	availability: BugBountyProgramAvailability

	/**
	 * The coverage breadth of the bug bounty program
	 */
	coverageBreadth: CoverageBreadth

	/**
	 * The rewards for the bug bounty program
	 */
	rewards: Support<{
		minimum: number
		maximum: number
		currency: string
	}>


	/**
	 * The platform of the bug bounty program
	 */
	platform?: BugBountyPlatform

	/**
	 * The disclosure process of the bug bounty program;
	 * number of days, privacy of reports, etc.
	 */
	disclouse: Support<{
		numberOfDays: number
	}>

	/**
	 * Whether the wallet offers an upgrade path for security issues
	 */
	upgradePathAvailable: boolean

	/**
	 * The legal protections offered to security researchers
	 */
	legalProtections: Support<LegalProtection>
}>

/**
 * A record of bug bounty program support
 */
export type BugBountyProgramImplementation = WithRef<BugBountyProgramSupport>
