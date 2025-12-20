import { useMemo } from 'react'
import { darkTheme, getDefaultWallets, lightTheme, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { defineChain, http } from 'viem'
import { createConfig, WagmiProvider } from 'wagmi'
import { mainnet } from 'wagmi/chains'

import { findItemInCollections } from '@/lib/collections'
import { useEVMChainsStore } from '@/store/chains'
import { useEVMCollectionStore, type EVMContract } from '@/store/collections'
import { useEVMTabStore } from '@/store/tabs'

import { useTheme } from './ThemeProvider'

export function EVMProvider({ children }: React.PropsWithChildren) {
  const { collections, temporaryContracts } = useEVMCollectionStore()
  const { activeTabId } = useEVMTabStore()
  const { chains: chainList } = useEVMChainsStore()

  const { resolvedTheme } = useTheme()

  const smartContract = useMemo(() => {
    if (!activeTabId) return undefined

    // Check temporary contracts first
    if (temporaryContracts[activeTabId]) {
      return temporaryContracts[activeTabId]
    }

    // Then check in collections
    return findItemInCollections(collections, activeTabId) as EVMContract
  }, [collections, temporaryContracts, activeTabId])

  const definedChain = useMemo(() => {
    if (!activeTabId) {
      return mainnet
    }

    const chain = chainList.find((chain) => chain.chainId === smartContract?.chainId)
    if (!chain) {
      return mainnet
    }

    const rpcHTTP = chain.rpc
      .filter(
        (rpc) =>
          rpc.url.startsWith('http') &&
          !rpc.url.includes('API_KEY') &&
          (rpc?.tracking === 'none' || rpc?.tracking === undefined),
      )
      .map((rpc) => rpc.url)

    return defineChain({
      id: chain.chainId,
      name: chain.name,
      nativeCurrency: chain.nativeCurrency,
      rpcUrls: {
        default: {
          http: rpcHTTP,
        },
        public: {
          http: rpcHTTP,
        },
      },
    })
  }, [activeTabId, chainList, smartContract?.chainId])

  const { connectors } = getDefaultWallets({
    appName: 'Laika',
    projectId: import.meta.env.VITE_PROJECT_ID ?? 'YOUR_PROJECT_ID',
  })

  const wagmiConfig = createConfig({
    chains: [definedChain],
    transports: {
      [definedChain.id]: http(),
    },
    connectors,
  })

  const resolvedRainbowKitTheme = useMemo(() => {
    const options = { borderRadius: 'small' } as const
    if (resolvedTheme === 'dark') {
      return darkTheme(options)
    } else {
      return lightTheme(options)
    }
  }, [resolvedTheme])

  return (
    <WagmiProvider config={wagmiConfig}>
      <RainbowKitProvider id="rainbowkit" theme={resolvedRainbowKitTheme}>
        {children}
      </RainbowKitProvider>
    </WagmiProvider>
  )
}
