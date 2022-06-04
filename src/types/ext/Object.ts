import { callByName, CallByName } from "./Function"

export const safePatch = (target: any, name: string) =>
  Object.defineProperty(target.prototype, name, {
    enumerable: false,
    writable: true
  })

declare global {
  interface Object {
    cast<T>(check: CallByName<boolean>): T | undefined
  }

  function cast<T>(val: any, check: () => boolean): val is T
}

safePatch(Object, 'cast')
Object.prototype.cast = function <T>(
  check: CallByName<boolean>
): T | undefined {
  return cast(this, check) ? this : undefined
}

function cast<T>(val: any, check: CallByName<boolean>): val is T {
  return callByName(check)
}

