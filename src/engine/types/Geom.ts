export type Scale = Scale.Static | Scale.Relative

export namespace Scale {
  export type Static = {
    type: "static"
    value: number
  }

  export type Relative = {
    type: "relative"
    value: number
  }

  export const Relative = (value: number): Relative => ({
    type: "relative",
    value,
  })

  export const isRelative = (val: any): val is Relative =>
    "type" in val && val.type === "relative"

  export const Static = (value: number): Static => ({
    type: "static",
    value,
  })

  export const isStatic = (val: any): val is Static =>
    "type" in val && val.type === "static"

  export const toStatic = (val: Scale, parent: number): Static =>
    isStatic(val) ? val : Static(val.value * parent)
}

export type Size = {
  width: Scale
  height: Scale
}

export namespace Size {
  export const toStatic = (value: Size, parent: Size): Size => ({
    width: Scale.toStatic(value.width, parent.width.value),
    height: Scale.toStatic(value.height, parent.height.value),
  })
}

export type Point = {
  x: number
  y: number
}

export namespace Point {
  export const Zero: Point = { x: 0, y: 0 }
}
