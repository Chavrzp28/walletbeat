import {
	assertNonEmptyArray,
	type NonEmptyArray,
	type NonEmptySet,
	nonEmptySetFromArray,
	setContains,
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
