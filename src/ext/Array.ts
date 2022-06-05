import { safePatch } from "./Object"

export {}

declare global {
  interface Array<T> {
    mapNotNull<R>(mapper: (item: T) => R | undefined | null): Array<R>
    filterInstanceOf<R>(check: (item: T) => boolean): Array<R>
    associate<A, K extends keyof any, V>(
      this: Array<A>,
      assoc: (A) => [K, V]
    ): Record<K, V>
  }
}

safePatch(Array, 'mapNotNull')
Array.prototype.mapNotNull = function <T, R>(
  this: Array<T>,
  mapper: (T) => R | undefined | null
): Array<R> {
  const results: R[] = []

  for (const item of this) {
    const res = mapper(item)
    if (typeof res !== 'undefined' && res != null) {
      results.push(res)
    }
  }

  return results
}

safePatch(Array, 'filterInstanceOf')
Array.prototype.filterInstanceOf = function <T, R>(
  this: Array<T>,
  check: (T) => boolean
): Array<R> {
  return this.mapNotNull<R>((item) => item.cast<R>(check(item)))
}

safePatch(Array, 'associate')
Array.prototype.associate = function <A, K extends keyof any, V>(
  this: Array<A>,
  assoc: (A) => [K, V]
): Record<K, V> {
  return this.reduce((acc, next) => {
    const [key, value] = assoc(next)
    return { ...acc, [key]: value }
  }, <Record<K, V>>{})
}
