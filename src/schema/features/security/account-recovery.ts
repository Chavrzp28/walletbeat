import type { Entity, WalletDeveloper } from '@/schema/entity'
import type { WithRef } from '@/schema/reference'
import type { NonEmptyArray } from '@/types/utils/non-empty'

import type { Support } from '../support'

/**
 * What happens during the wallet onboarding flow with respect to the
 * seed phrase backup?
 */
export enum SeedphraseBackupOnboardingFlowBehavior {
	/**
	 * The user is not prompted to back up their seed phrase on a dedicated
	 * step.
	 */
	NO_DEDICATED_BACKUP_STEP = 'NO_DEDICATED_BACKUP_STEP',

	/** The user is prompted to back up their seed phrase on a dedicated step. */
	BACKUP_SUGGESTED_ON_DEDICATED_STEP = 'BACKUP_SUGGESTED_ON_DEDICATED_STEP',

	/** The user is quizzed on their seed phrase but may bypass this. */
	BYPASSABLE_QUIZ = 'BYPASSABLE_QUIZ',

	/**
	 * The user is quizzed on their seed phrase, and must pass this quiz
	 * to finish onboarding.
	 */
	MANDATORY_QUIZ = 'MANDATORY_QUIZ',
}

/**
 * How does the wallet ensure the user has backed up their seed phrase?
 */
export interface SeedPhraseBackup {
	/** What happens during the wallet onboarding flow? */
	onboardingFlow: SeedphraseBackupOnboardingFlowBehavior
}

/** The type of a single guardian. */
export enum GuardianType {
	/** The wallet user using a self-custodied private key. */
	SELF_CUSTODY = 'SELF_CUSTODY',

	/** A service provided by the wallet developer. */
	WALLET_PROVIDER = 'WALLET_PROVIDER',

	/** An account owned by the user, unrelated to the wallet. */
	USER_EXTERNAL_ACCOUNT = 'USER_EXTERNAL_ACCOUNT',

	/** A private key stored as a passkey. */
	PASSKEY = 'PASSKEY',

	/** A ZK ID scheme (zkPassport, Anon Aadhaar, etc.) */
	ZKID = 'ZKID',
}

/** A single guardian represented by a self-custodied private key. */
export interface GuardianSelfCustody {
	type: GuardianType.SELF_CUSTODY
}

/** A single guardian represented by a service provided by the wallet developer. */
export interface GuardianWalletProvider {
	type: GuardianType.WALLET_PROVIDER
	entity: WalletDeveloper
}

/** A single guardian represented by an account owned by the user, unrelated to the wallet. */
export interface GuardianUserExternalAccount {
	type: GuardianType.USER_EXTERNAL_ACCOUNT
	entity: Exclude<Entity, WalletDeveloper>
}

/** A single guardian represented by a private key stored as a passkey. */
export interface GuardianPasskey {
	type: GuardianType.PASSKEY
}

/** A single guardian represented by a ZK ID scheme (zkPassport, Anon Aadhaar, etc.) . */
export interface GuardianZKID {
	type: GuardianType.ZKID
}

/** A single guardian within a broader multi-guardian setup. */
export type Guardian =
	| GuardianSelfCustody
	| GuardianWalletProvider
	| GuardianUserExternalAccount
	| GuardianPasskey
	| GuardianZKID

/** Type of guardian configuration. */
export enum GuardianPolicyType {
	/**
	 * A recovery secret (seedphrase or other cryptographic material sufficient
	 * to perform recovery) is split into shares, and then the shares are spread
	 * across guardians.
	 */
	SECRET_SPLIT_ACROSS_GUARDIANS = 'SECRET_SPLIT_ACROSS_GUARDIANS',

	/** K of N guardians required to perform recovery under timelock. */
	K_OF_N_WITH_TIMELOCK = 'K_OF_N_WITH_TIMELOCK',
}

/**
 * A single specific configuration of guardians requiring K of N signatures
 * to perform a recovery action under a timelock.
 */
export type GuardianPolicySecretSplitAcrossGuardians = {
	type: GuardianPolicyType.SECRET_SPLIT_ACROSS_GUARDIANS

	/** Which guardians are supported? */
	possibleGuardians: NonEmptyArray<Guardian>

	/** Number of shares the secret is split into. */
	numSharesTotal: number

	/** Number of shares required for recovery. */
	numSharesRequiredForRecovery: number

	/**
	 * Where the secret is reconstitued.
	 * Currently only supports client-side reconstitution; may be expanded later
	 * if other wallets do something different.
	 */
	secretReconstitution: 'CLIENT_SIDE'
}

/**
 * A single specific configuration of guardians requiring K of N signatures
 * to perform a recovery action under a timelock.
 */
export type GuardianPolicyKOfNWithTimelocks = {
	type: GuardianPolicyType.K_OF_N_WITH_TIMELOCK

	/**
	 * What are the configured guardians?
	 * Each guardian is assumed to have identical weight.
	 */
	configuredGuardians: NonEmptyArray<Guardian>

	/**
	 * What is the minimum number of signatures needed to perform a recovery
	 * action that requires timelock?
	 */
	minimumSignaturesWithTimelock: number

	/** What is the minimum number of signatures needed to perform a recovery
	 * action that bypasses timelock?
	 */
	minimumSignaturesBypassTimelock: number
}

/** A single specific configuration of guardians. */
export type GuardianPolicy =
	| GuardianPolicySecretSplitAcrossGuardians
	| GuardianPolicyKOfNWithTimelocks

/**
 * For wallets supporting social recovery (guardian-based), what policy does
 * it use for the guardians?
 */
export interface GuardianRecovery {
	/**
	 * What is the *minimum* policy that the wallet requires the user to set up?
	 */
	minimumGuardianPolicy: GuardianPolicy
}

/**
 * How the wallet makes it possible for the user to recover their account.
 */
export interface AccountRecovery {
	/**
	 * If the wallet supports seed phrases, how does it make sure the user
	 * keeps a backup?
	 * 'NO_SEED_PHRASE' means the wallet does not support seed phrases at all.
	 */
	seedPhraseBackup: WithRef<SeedPhraseBackup> | 'NO_SEED_PHRASE'

	/**
	 * If the wallet supports "social recovery" (guardian-based), what policy
	 * does it use for the guardians?
	 */
	guardianRecovery: Support<WithRef<GuardianRecovery>>
}
