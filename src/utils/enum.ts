import {
	assertNonEmptyArray,
	type NonEmptyArray,
	type NonEmptySet,
	nonEmptySetFromArray,
	setContains,
	setItems,
	setUnion,
} from '@/types/utils/non-empty'

/**
 * Helper class for enums.
 */
export class Enum<E extends string> {
	/** A complete list of enum values. */
	public readonly items: NonEmptyArray<E>

	/** A complete set of enum values. */
	public readonly set: NonEmptySet<E>

	constructor(record: Record<E, true>) {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Safe because we know all keys are E.
		this.items = assertNonEmptyArray<E>(Object.keys(record) as E[])
		this.set = nonEmptySetFromArray<E>(this.items)
	}

	/**
	 * @returns Whether the given object is an enum value.
	 */
	public is(obj: unknown): obj is E {
		if (typeof obj !== 'string') {
			return false
		}

		// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Safe because this is exactly what we are trying to establish
		return setContains(this.set, obj as E)
	}
}

/**
 * Merge two enum classes together into a larger enum class.
 */
export function mergeEnums<E1 extends string, E2 extends string>(
	e1: Enum<E1>,
	e2: Enum<E2>,
): Enum<E1 | E2> {
	const mergedSet = setUnion<E1 | E2>([
		// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Safe because E1|E2 is a superset of E1.
		e1.set as NonEmptySet<E1 | E2>,
		// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Safe because E1|E2 is a superset of E2.
		e2.set as NonEmptySet<E1 | E2>,
	])
	// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Safe because the mergedSet is guaranteed to contain all elements of E1 and E2.
	const mergedRecord = Object.fromEntries(setItems(mergedSet).map(e => [e, true])) as Record<
		E1 | E2,
		true
	>

	return new Enum<E1 | E2>(mergedRecord)
}
