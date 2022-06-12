export type Measured<T> = [T, number]

export const measure = <T>(block: () => T): Measured<T> => {
  const start = Date.now()
  const res = block()
  const duration = Date.now() - start
  return [res, duration]
}
