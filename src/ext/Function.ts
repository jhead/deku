export type CallByName<T> = T | (() => T)

export const callByName = <T>(cbn: CallByName<T>): T =>
  isFunction(cbn) ? cbn() : cbn

export function isFunction(val: any): val is Function {
  return typeof val === 'function'
}
