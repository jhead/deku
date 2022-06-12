export type Component = {
  type: 'Component'
  componentName: string
}

export type ComponentName<T extends Component> = T['componentName']

export type ComponentRef<T extends Component> = {
  name: ComponentName<T>
}

export const componentRef = <T extends Component>(
  name: ComponentName<T>,
): ComponentRef<T> => ({ name })
