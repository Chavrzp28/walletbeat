import {
	type Attribute,
	type Evaluation,
	exampleRating,
	Rating,
	type Value,
} from '@/schema/attributes'
import type { ResolvedFeatures } from '@/schema/features'
import {
	BugBountyProgramAvailability,
	type BugBountyProgramSupport,
	CoverageBreadth,
} from '@/schema/features/security/bug-bounty-program'
import { popRefs } from '@/schema/reference'
import { type AtLeastOneVariant } from '@/schema/variants'
import { WalletType } from '@/schema/wallet-types'
import { markdown, mdParagraph, mdSentence, paragraph, sentence } from '@/types/content'

import { exempt, pickWorstRating, unrated } from '../common'

const brand = 'attributes.security.bug_bounty_program'

export type BugBountyProgramValue = Value & {
	availability: BugBountyProgramAvailability
	coverageBreadth: CoverageBreadth
	upgradePathAvailable: boolean
	__brand: 'attributes.security.bug_bounty_program'
}

function getCoverageDescription(breadth: CoverageBreadth): string {
	switch (breadth) {
		case CoverageBreadth.FULL:
			return 'The program covers all aspects of the wallet including hardware, firmware, and software.'
		case CoverageBreadth.PARTIAL:
			return 'The program has partial coverage of wallet components.'
		case CoverageBreadth.APP_ONLY:
			return 'The program covers only the application layer.'
		case CoverageBreadth.FIRMWARE_ONLY:
			return 'The program covers only firmware vulnerabilities.'
		case CoverageBreadth.HARDWARE_ONLY:
			return 'The program covers only hardware vulnerabilities.'
		case CoverageBreadth.NONE:
			return 'The program has no defined coverage scope.'
		default:
			return ''
	}
}

function getRewardDescription(support: BugBountyProgramSupport): string {
	if (support.minimumReward && support.maximumReward) {
		return `with rewards ranging from $${support.minimumReward.toLocaleString()} to $${support.maximumReward.toLocaleString()}`
	} else if (support.maximumReward) {
		return `with rewards up to $${support.maximumReward.toLocaleString()}`
	} else if (support.minimumReward) {
		return `with rewards starting at $${support.minimumReward.toLocaleString()}`
	}

	return ''
}

function noBugBountyProgram(): Evaluation<BugBountyProgramValue> {
	return {
		value: {
			id: 'no_bug_bounty_program',
			rating: Rating.FAIL,
			displayName: 'No bug bounty program',
			shortExplanation: sentence(
				"{{WALLET_NAME}} does not implement a bug bounty program and doesn't provide security updates.",
			),
			availability: BugBountyProgramAvailability.NEVER,
			coverageBreadth: CoverageBreadth.NONE,
			upgradePathAvailable: false,
			__brand: brand,
		},
		details: paragraph(
			'{{WALLET_NAME}} does not implement a bug bounty program and does not provide a clear path for security researchers to report vulnerabilities. The wallet also lacks a documented process for providing security updates to address critical issues.',
		),
		howToImprove: paragraph(
			'{{WALLET_NAME}} should implement a bug bounty program to incentivize security researchers to responsibly disclose vulnerabilities. At minimum, the wallet should provide a clear vulnerability disclosure policy and ensure a process exists for providing security updates to users.',
		),
	}
}

function bugBountyAvailable(support: BugBountyProgramSupport): Evaluation<BugBountyProgramValue> {
	const rewardInfo = getRewardDescription(support)
	const coverageInfo = support.coverageBreadth
		? getCoverageDescription(support.coverageBreadth)
		: ''

	const isActive = support.availability === BugBountyProgramAvailability.ACTIVE
	const availabilityInfo = isActive
		? 'The program is currently active and accepting vulnerability reports.'
		: support.availability === BugBountyProgramAvailability.INACTIVE
			? 'Note that the program is currently inactive and not accepting new reports.'
			: ''

	return {
		value: {
			id: 'bug_bounty_available',
			rating: isActive ? Rating.PASS : Rating.PARTIAL,
			displayName: isActive ? 'Bug bounty program available' : 'Bug bounty program inactive',
			shortExplanation: mdSentence(
				`{{WALLET_NAME}} has a bug bounty program ${rewardInfo}${isActive ? '' : ', but it is currently inactive'}.`,
			),
			availability: support.availability || BugBountyProgramAvailability.NEVER,
			coverageBreadth: support.coverageBreadth || CoverageBreadth.NONE,
			upgradePathAvailable: support.upgradePathAvailable,
			__brand: brand,
		},
		details: markdown(`
			{{WALLET_NAME}} has implemented a bug bounty program ${rewardInfo} that provides incentives for security researchers to find and report vulnerabilities.

			${coverageInfo}

			${availabilityInfo}

			${support.url ? `For more information, visit their [bug bounty program page](${support.url}).` : ''}

			${support.disclosureProcess ? `**Disclosure Process**: ${support.disclosureProcess}` : ''}

			${
				support.upgradePathAvailable
					? 'Positively, the wallet does provide an upgrade path for users when security issues are identified.'
					: 'Unfortunately, the wallet does not provide a clear upgrade path for users when security issues are identified.'
			}
		`),
		howToImprove: markdown(`
			{{WALLET_NAME}} should:
			${!isActive ? '- Reactivate their bug bounty program to continue accepting vulnerability reports' : ''}
			${!support.upgradePathAvailable ? '- Establish a clear upgrade path for users when security vulnerabilities are discovered' : ''}
			${support.coverageBreadth && support.coverageBreadth !== CoverageBreadth.FULL ? '- Expand coverage to all wallet components' : ''}
			${isActive && support.upgradePathAvailable && support.coverageBreadth === CoverageBreadth.FULL ? '- Continue maintaining and improving the bug bounty program' : ''}
		`),
	}
}

function determineRating(support: BugBountyProgramSupport): Evaluation<BugBountyProgramValue> {
	// Has financial rewards = bug bounty program exists
	const hasBugBounty = support.minimumReward !== undefined || support.maximumReward !== undefined

	// No bug bounty program at all
	if (!hasBugBounty) {
		return noBugBountyProgram()
	}

	// Has bug bounty program
	return bugBountyAvailable(support)
}

export const bugBountyProgram: Attribute<BugBountyProgramValue> = {
	id: 'bugBountyProgram',
	icon: '\u{1F41B}', // Bug emoji
	displayName: 'Bug Bounty Program',
	wording: {
		midSentenceName: null,
		howIsEvaluated: "How is a hardware wallet's bug bounty program evaluated?",
		whatCanWalletDoAboutIts: sentence(
			'What can {{WALLET_NAME}} do to improve its bug bounty program?',
		),
	},
	question: sentence(
		'Does {{WALLET_NAME}} maintain an active bug bounty program with a clear disclosure and upgrade process for security issues?',
	),
	why: markdown(`
		Hardware wallets manage sensitive cryptographic keys and access to users' funds, making them high-value targets for attackers.
		Bug bounty programs incentivize security researchers to responsibly discover and disclose vulnerabilities, rather than exploit them.
		
		A well-structured bug bounty program:
		1. Provides clear guidelines for researchers to report vulnerabilities
		2. Offers appropriate rewards based on severity of findings
		3. Demonstrates a commitment to addressing security issues quickly
		4. Communicates transparently about discovered vulnerabilities and their resolution
		
		Additionally, hardware wallets should provide upgrade paths for users when critical security issues are discovered,
		as these physical devices can't always be fixed with simple software updates.
	`),
	methodology: markdown(`
		Hardware wallets are assessed based on the comprehensiveness of their bug bounty program:

		1. **Pass (Best)**: Implements a comprehensive bug bounty program with:
			- Active program accepting vulnerability reports
			- Full coverage of hardware, firmware, and software components
			- Competitive financial rewards based on severity
			- Responsive disclosure process
			- Transparent communication about fixes
			- Clear upgrade paths for users when needed

		2. **Partial**: Implements a basic bug bounty program with limitations:
			- May have limited coverage (only certain components)
			- Smaller or unclear rewards
			- Basic vulnerability disclosure policy without formal rewards
			- Slower response times
			- Unclear upgrade paths for users
			- Inactive or temporarily paused programs

		3. **Fail**: No bug bounty program or security update process:
			- No formal process for reporting vulnerabilities
			- No incentives for responsible disclosure
			- No clear path for providing security updates
			- Known critical vulnerabilities remain unaddressed
	`),
	ratingScale: {
		display: 'pass-fail',
		exhaustive: true,
		pass: [
			exampleRating(
				mdParagraph(`
					The hardware wallet has an active bug bounty program with competitive rewards (e.g., up to $50,000),
					full coverage of all components, and provides upgrade paths for users.
				`),
				bugBountyAvailable({
					availability: BugBountyProgramAvailability.ACTIVE,
					coverageBreadth: CoverageBreadth.FULL,
					maximumReward: 50000,
					minimumReward: 1000,
					upgradePathAvailable: true,
				}),
			),
		],
		partial: [
			exampleRating(
				mdParagraph(`
					The hardware wallet has a bug bounty program with rewards (e.g., up to $5,000),
					but it is currently inactive and not accepting new reports.
				`),
				bugBountyAvailable({
					availability: BugBountyProgramAvailability.INACTIVE,
					coverageBreadth: CoverageBreadth.PARTIAL,
					maximumReward: 5000,
					upgradePathAvailable: true,
				}),
			),
		],
		fail: [
			exampleRating(
				mdParagraph(`
					The hardware wallet does not implement any bug bounty program or vulnerability disclosure policy.
					It also lacks a clear process for providing security updates to address critical issues.
				`),
				noBugBountyProgram(),
			),
		],
	},
	aggregate: (perVariant: AtLeastOneVariant<Evaluation<BugBountyProgramValue>>) =>
		pickWorstRating<BugBountyProgramValue>(perVariant),
	evaluate: (features: ResolvedFeatures): Evaluation<BugBountyProgramValue> => {
		// This attribute is only applicable for hardware wallets
		// For software wallets, we exempt them from this attribute
		if (features.type !== WalletType.HARDWARE) {
			return exempt(
				bugBountyProgram,
				sentence('This attribute is only applicable for hardware wallets.'),
				brand,
				{
					availability: BugBountyProgramAvailability.NEVER,
					coverageBreadth: CoverageBreadth.NONE,
					upgradePathAvailable: false,
				},
			)
		}

		if (features.security.bugBountyProgram === null) {
			return unrated(bugBountyProgram, brand, {
				availability: BugBountyProgramAvailability.NEVER,
				coverageBreadth: CoverageBreadth.NONE,
				upgradePathAvailable: false,
			})
		}

		const { withoutRefs, refs } = popRefs<BugBountyProgramSupport>(
			features.security.bugBountyProgram,
		)

		const result = determineRating(withoutRefs)

		// Return result with references if any
		return {
			...result,
			...(refs.length > 0 && { references: refs }),
		}
	},
}
