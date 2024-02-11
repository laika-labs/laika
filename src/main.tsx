import 'allotment/dist/style.css'
import '@/styles/index.css'
import '@rainbow-me/rainbowkit/styles.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import TagManager from 'react-gtm-module'

import App from '@/pages/App.tsx'

const gtmId = import.meta.env.VITE_GTM_ID
if (gtmId) {
  const tagManagerArgs = {
    gtmId,
  }
  TagManager.initialize(tagManagerArgs)
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
