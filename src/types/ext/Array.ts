import { safePatch } from "./Object"

export {}

declare global {
  interface Array<T> {
    mapNotNull<R>(mapper: (item: T) => R | undefined | null): Array<R>
    filterInstanceOf<R>(check: (item: T) => boolean): Array<R>
    fold<R>(initial: R, op: (acc: R, next: T) => R): R
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

safePatch(Array, 'fold')
Array.prototype.fold = function <T, R>(
  this: Array<T>,
  initial: R,
  op: (acc: R, next: T) => R
): R {
  const [first, ...rest] = this
  let res: R = op(initial, first)
  rest.forEach((it) => {
    res = op(res, it)
  })
  return res
}

safePatch(Array, 'associate')
Array.prototype.associate = function <A, K extends keyof any, V>(
  this: Array<A>,
  assoc: (A) => [K, V]
): Record<K, V> {
  return this.fold(<Record<K, V>>{}, (acc, next) => {
    const [key, value] = assoc(next)
    return { ...acc, [key]: value }
  })
}
