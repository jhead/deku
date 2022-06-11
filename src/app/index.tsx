import ReactDOM from 'react-dom/client'
import { App } from './App'

export const createApp = (el: HTMLElement) => {
  const root = ReactDOM.createRoot(el)
  root.render(<App />)
}
