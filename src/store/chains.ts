import { create } from 'zustand'

export interface EVMChain {
  name: string
  chain: string
  icon?: string
  rpc: { url: string; tracking: string }[]
  features?: EVMFeature[]
  faucets: string[]
  nativeCurrency: EVMNativeCurrency
  infoURL: string
  shortName: string
  chainId: number
  networkId: number
  slip44: number
  ens?: EVMEns
  explorers?: EVMExplorer[]
}

export interface EVMEns {
  registry: string
}

export interface EVMExplorer {
  name: string
  url: string
  standard: string
  icon?: string
}

export interface EVMFeature {
  name: string
}

export interface EVMNativeCurrency {
  name: string
  symbol: string
  decimals: number
}

export const useEVMChainsStore = create<{
  chains: EVMChain[]
  setChains: (chains: EVMChain[]) => void
}>((set) => ({
  chains: [],
  setChains: (chains) => set({ chains }),
}))
