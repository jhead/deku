export type Component = {
  type: 'Component'
  componentName: string
}

export type ComponentName<T extends Component> = T['componentName']
