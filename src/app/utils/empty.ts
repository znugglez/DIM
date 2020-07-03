/**
 * Stable empty versions of common data structures, to use in reducers.
 *
 * These always return the same instance so they'll always be referentially equal.
 */

const EMPTY_OBJ = {};
export function emptyObject<T extends object>(): T {
  return EMPTY_OBJ as T;
}

const EMPTY_ARRAY = [];
export function emptyArray<T>(): T[] {
  return EMPTY_ARRAY as T[];
}

const EMPTY_SET = new Set();
export function emptySet<T>(): Set<T> {
  return EMPTY_SET as Set<T>;
}

const EMPTY_MAP = new Map();
export function emptyMap<K, V>(): Map<K, V> {
  return EMPTY_MAP as Map<K, V>;
}

/** it always returns false. that's the tweet. */
export function returnFalse() {
  return false;
}

/** does absolutely nothing but still counts as a function */
export function doNothing() {
  // do absolutely nothing
}
