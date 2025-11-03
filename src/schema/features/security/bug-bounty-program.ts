import type { WithRef } from '@/schema/reference'

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
}

/**
 * A record of bug bounty program support
 */
export type BugBountyProgramImplementation = WithRef<BugBountyProgramSupport>
