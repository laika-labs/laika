import { UUID } from 'crypto'
import { PropsWithChildren, useMemo } from 'react'
import { defineChain } from 'viem'
import { mainnet } from 'viem/chains'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'

import { useEVMChainsStore } from '@/store/chains'
import { EVMContract, useEVMCollectionStore } from '@/store/collections'
import { useEVMTabStore } from '@/store/tabs'
import { findItemInCollections } from '@/utils/collections'
import { darkTheme, getDefaultWallets, lightTheme, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { jsonRpcProvider } from '@wagmi/core/providers/jsonRpc'

import { useTheme } from './ThemeProvider'

export function EVMProvider({ children }: PropsWithChildren) {
  const { collections } = useEVMCollectionStore()
  const { activeTabId } = useEVMTabStore()
  const { chains: chainList } = useEVMChainsStore()

  const { resolvedTheme } = useTheme()

  const smartContract = findItemInCollections(collections, activeTabId as UUID) as EVMContract

  const definedChain = useMemo(() => {
    if (!activeTabId) {
      return mainnet
    }

    const chain = chainList.find((chain) => chain.chainId === smartContract?.chainId)
    if (!chain) {
      return mainnet
    }

    const rpcHTTP = chain.rpc
      .filter((rpc) => rpc.startsWith('http') && !rpc.includes('API_KEY'))
      .sort((a) => (a.includes('cloudflare') ? -1 : 1))

    return defineChain({
      id: chain.chainId,
      name: chain.name,
      network: chain.shortName,
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

  const { chains, publicClient } = configureChains(
    [definedChain],
    [
      jsonRpcProvider({
        rpc: () => ({
          http: definedChain?.rpcUrls.default.http[0],
        }),
      }),
    ],
  )
  const { connectors } = getDefaultWallets({
    appName: 'Laika',
    projectId: import.meta.env.VITE_PROJECT_ID ?? 'YOUR_PROJECT_ID',
    chains,
  })

  const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient,
  })

  const resolvedRainbowKitTheme = useMemo(() => {
    if (resolvedTheme === 'dark') {
      return darkTheme()
    } else {
      return lightTheme()
    }
  }, [resolvedTheme])

  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider theme={resolvedRainbowKitTheme} chains={chains}>
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  )
}
