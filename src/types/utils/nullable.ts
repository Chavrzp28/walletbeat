export type NullableObject = object | null

export type Nullable<T extends NullableObject> = { [K in keyof T]: T[K] | null } | null

export type NonNull<T extends NullableObject> = { [K in keyof T]: Exclude<T[K], null> }

export function isNonNull<T extends NullableObject>(obj: Nullable<T>): obj is NonNull<T> {
	if (obj === null) {
		return false
	}

	return !Object.values(obj).includes(null)
}
