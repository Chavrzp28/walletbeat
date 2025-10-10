import { describe, expect, it } from 'vitest'

import { commonExclusions, getCodebaseIndex, type IndexedFile } from './utils/codebase'

interface BannedExpression {
	name: string
	regexp: RegExp
	explanation: string
}

const bannedExpressions: BannedExpression[] = [
	{
		name: 'third party',
		regexp: /\bthird([-_ ]|\s*)?part(y|ies)\b/i,
		explanation:
			'To distinguish between "third-party" as in "other than the wallet developer" and "non-local", use another term. Consider using "external" or "external provider" when talking about a network-level "third party", or "independent" when talking about a party different from the wallet developer.',
	},
]

interface FileBannedExpressionNames {
	matchedExprs: Set<string>
}

async function codebaseBannedExpressionIndex(): Promise<Map<string, Set<string>>> {
	const bannedMap = new Map<string, Set<string>>()

	await getCodebaseIndex({
		indexFn: (_, fileContents: string): FileBannedExpressionNames => {
			const matched = new Set<string>()

			for (const bannedExpr of bannedExpressions) {
				if (bannedExpr.regexp.test(fileContents)) {
					matched.add(bannedExpr.name)
				}
			}

			return { matchedExprs: matched }
		},
		aggregateFn: (fileMatch: IndexedFile<FileBannedExpressionNames>) => {
			for (const bannedExprName of fileMatch.matchedExprs.keys()) {
				let fileSet = bannedMap.get(bannedExprName)

				if (fileSet === undefined) {
					fileSet = new Set<string>()
					bannedMap.set(bannedExprName, fileSet)
				}

				fileSet.add(fileMatch.filePath)
			}
		},
		ignore: commonExclusions.concat([
			// Exclude test files.
			/\.test.ts$/i,

			// Exclude governance documents (meeting transcripts etc).
			/^governance\//i,
		]),
	})

	return bannedMap
}

describe('banned expressions', async () => {
	const index = await codebaseBannedExpressionIndex()

	for (const banned of bannedExpressions) {
		it(`does not contain the expression: "${banned.name}"`, () => {
			const fileMatches = index.get(banned.name)

			expect(fileMatches).toSatisfy(
				val => val === undefined,
				`Expression "${banned.name}" found in files:\n${
					fileMatches === undefined
						? ''
						: Array.from(fileMatches.keys())
								.map(path => `- ${path}`)
								.join('\n')
				}\n${banned.explanation}`,
			)
		})
	}
})
