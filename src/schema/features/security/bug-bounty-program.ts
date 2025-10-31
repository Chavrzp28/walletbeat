import type { WithRef } from '@/schema/reference'

/**
 * Types of bug bounty programs that can be implemented
 */
export enum BugBountyProgramType {
	COMPREHENSIVE = 'COMPREHENSIVE',
	BASIC = 'BASIC',
	DISCLOSURE_ONLY = 'DISCLOSURE_ONLY',
	NONE = 'NONE',
}

/**
 * The availability of the bug bounty program
 */
export enum BugBountyProgramAvailability {
  ACTIVE = 'ACTIVE', // Running now, accepting reports
  INACTIVE = 'INACTIVE', // Temporarily paused
  HISTORICAL = 'HISTORICAL', // Ended, not returning
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
	 * The type of bug bounty program implemented
	 */
	type: BugBountyProgramType

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
	 * URL to the bug bounty program details
	 */
	url?: string

	/**
	 * Additional details about the bug bounty program implementation
	 */
	details?: string

	/**
	 * Whether the wallet offers an upgrade path for security issues
	 */
	upgradePathAvailable: boolean
}

/**
 * A record of bug bounty program support
 */
export type BugBountyProgramImplementation = WithRef<BugBountyProgramSupport>
