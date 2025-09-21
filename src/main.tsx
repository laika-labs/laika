import { StrictMode } from 'react'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import ReactDOM from 'react-dom/client'
import TagManager from 'react-gtm-module'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

import '@/styles/index.css'
import 'allotment/dist/style.css'
import '@rainbow-me/rainbowkit/styles.css'

// Create a new router instance
const router = createRouter({ routeTree })

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const gtmId = import.meta.env.VITE_GTM_ID
if (gtmId) {
  const tagManagerArgs = {
    gtmId,
  }
  TagManager.initialize(tagManagerArgs)
}

// Render the app
const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  )
}
