import ReactDOM from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { createRouter } from './router'

import './globals.css'

const router = createRouter()

const rootElement = document.getElementById('root')!

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(<RouterProvider router={router} />)
}
