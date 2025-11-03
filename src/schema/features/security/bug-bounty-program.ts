import type { WithRef } from '@/schema/reference'


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
 */
export enum LegalProtectionType {
	SAFE_HARBOR = 'SAFE_HARBOR', // Explicit Safe Harbor language
	LEGAL_ASSURANCE = 'LEGAL_ASSURANCE', // Pledges not to sue, similar protections
	NONE = 'NONE', // No legal protections mentioned
}

/**
 * Information about legal protections for security researchers
 */
export interface LegalProtection {
	/**
	 * The type of legal protection provided
	 */
	type: LegalProtectionType

	/**
	 * URL or reference to the legal protection language
	 */
	reference?: string

	/**
	 * Specific details or excerpt of the legal protection language
	 */
	details?: string

	/**
	 * Whether they participate in #legalbugbounty or similar standardization
	 */
	standardizedLanguage?: boolean
}



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
export interface BugBountyProgramSupport {
	/**
	 * The date the bug bounty program started
	 */
	dateStarted?: Date

	/**
	 * The availability of the bug bounty program
	 */
	availability?: BugBountyProgramAvailability

	/**
	 * The coverage breadth of the bug bounty program
	 */
	coverageBreadth?: CoverageBreadth

	/**
	 * The maximum reward for a bug bounty program
	 */
	maximumReward?: number

	/**
	 * The minimum reward for a bug bounty program
	 */
	minimumReward?: number

	/**
	 * URL to the bug bounty program details
	 */
	url?: string

	/**
	 * The platform of the bug bounty program
	 */
	platform?: BugBountyPlatform

	/**
	 * The URL to the bug bounty program
	 */
	platformUrl?: string

	/**
	 * Additional details about the bug bounty program implementation
	 */
	details?: string

	/**
	 * The disclosure process of the bug bounty program;
	 * number of days, privacy of reports, etc.
	 */
	disclosureProcess?: string

	/**
	 * Whether the wallet offers an upgrade path for security issues
	 */
	upgradePathAvailable: boolean

	/**
	 * The legal protections offered to security researchers
	 */
	legalProtections?: LegalProtection
}

/**
 * A record of bug bounty program support
 */
export type BugBountyProgramImplementation = WithRef<BugBountyProgramSupport>
