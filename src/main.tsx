import 'allotment/dist/style.css'
import '@/styles/index.css'
import '@rainbow-me/rainbowkit/styles.css'

import React from 'react'
import ReactDOM from 'react-dom/client'

import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { mainnet, polygon, optimism, arbitrum, base, zora } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'

import App from '@/pages/App.tsx'

const { chains, publicClient } = configureChains([mainnet, polygon, optimism, arbitrum, base, zora], [publicProvider()])
const { connectors } = getDefaultWallets({
  appName: 'Laika',
  projectId: 'YOUR_PROJECT_ID',
  chains,
})
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <App />
      </RainbowKitProvider>
    </WagmiConfig>
  </React.StrictMode>,
)
