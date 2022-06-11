import { AppContext } from '../app/AppContext'

export const createCanvas = (ctx: AppContext, root: HTMLElement) => {
  root.appendChild(ctx.app.view)
}
