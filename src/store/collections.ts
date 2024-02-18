import { v4 as uuidv4 } from 'uuid'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { findItemInCollections, removeItemInCollection } from '@/utils/collections'

export enum EVMItemType {
  Collection = 'collection',
  SmartContract = 'smart-contract',
  Folder = 'folder',
}

export interface EVMContract {
  id: string
  name: string
  type: EVMItemType.SmartContract
  chainId?: number
  contract: {
    address?: string
    abi?: string
  }
}

export interface EVMFolder {
  id: string
  name: string
  type: EVMItemType.Folder
  isOpen: boolean
  items: (EVMContract | EVMFolder)[]
}

export interface EVMCollection {
  id: string
  name: string
  type: EVMItemType.Collection
  isOpen: boolean
  items: (EVMContract | EVMFolder)[]
}

export interface EVMABIMethod {
  type: string
  name: string
  inputs: EVMABIMethodInputsOutputs[]
  outputs: EVMABIMethodInputsOutputs[]
  stateMutability?: string
  anonymous?: boolean
  comment?: string
}

export interface EVMABIMethodInputsOutputs {
  name: string
  type: string
  components?: EVMABIMethodInputsOutputs[]
}

export interface EVMCollectionStore {
  collections: EVMCollection[]
  addCollection: (name?: string) => string
  removeCollection: (id: string) => void
  renameItem: (id: string, name: string) => void
  toggleOpen: (id: string) => void
  addFolder: (id: string, name?: string) => string
  addSmartContract: (id: string, cb: (contract: EVMContract) => void) => void
  updateContractChainId: (id: string, chainId: number) => void
  updateContractAddress: (id: string, address: string) => void
  updateContractABI: (id: string, abi: string) => void
  updateContractComment: (id: string, methodName: string, comment: string) => void
  removeItem: (id: string) => void
}

const collections: EVMCollection[] = []

export const useEVMCollectionStore = create<EVMCollectionStore>()(
  persist(
    (set) => ({
      collections: [...collections],
      addCollection: (name) => {
        const id = uuidv4()
        set((state) => {
          const collection: EVMCollection = {
            id,
            name: name ?? 'New Collection',
            type: EVMItemType.Collection,
            isOpen: true,
            items: [],
          }

          return { collections: [...state.collections, collection] }
        })
        return id
      },
      removeCollection: (id: string) =>
        set((state) => ({
          collections: state.collections.filter((c) => c.id !== id),
        })),
      renameItem: (id: string, name: string) =>
        set((state) => {
          const item = findItemInCollections(state.collections, id)

          if (item) {
            item.name = name
          }

          return {
            collections: state.collections,
          }
        }),
      toggleOpen: (id: string) =>
        set((state) => {
          const item = findItemInCollections(state.collections, id)

          if (item && item.type !== EVMItemType.SmartContract) {
            item.isOpen = !item.isOpen
          }

          return {
            collections: state.collections,
          }
        }),
      addFolder: (id, name) => {
        const folderId = uuidv4()
        set((state) => {
          const folder: EVMFolder = {
            id: folderId,
            name: name ?? 'New Folder',
            type: EVMItemType.Folder,
            isOpen: true,
            items: [],
          }

          const item = findItemInCollections(state.collections, id)

          if (item && item.type !== EVMItemType.SmartContract) {
            item.items.push(folder)
          }

          return {
            collections: state.collections,
          }
        })
        return folderId
      },
      addSmartContract: (id: string, cb: (contract: EVMContract) => void) =>
        set((state) => {
          const contract: EVMContract = {
            id: uuidv4(),
            name: 'New Smart Contract',
            type: EVMItemType.SmartContract,
            contract: {},
          }

          const item = findItemInCollections(state.collections, id)

          if (item && item.type !== EVMItemType.SmartContract) {
            item.items.push(contract)
          }

          cb(contract)

          return {
            collections: state.collections,
          }
        }),
      updateContractChainId: (id: string, chainId: number) =>
        set((state) => {
          const item = findItemInCollections(state.collections, id)

          if (item && item.type === EVMItemType.SmartContract) {
            item.chainId = chainId
          }

          return {
            collections: state.collections,
          }
        }),
      updateContractAddress: (id: string, address: string) =>
        set((state) => {
          const item = findItemInCollections(state.collections, id)

          if (item && item.type === EVMItemType.SmartContract) {
            item.contract.address = address
          }

          return {
            collections: state.collections,
          }
        }),
      updateContractABI: (id: string, abi: string) =>
        set((state) => {
          const item = findItemInCollections(state.collections, id)

          if (item && item.type === EVMItemType.SmartContract) {
            item.contract.abi = abi
          }

          return {
            collections: state.collections,
          }
        }),
      updateContractComment: (id: string, methodName: string, comment: string) =>
        set((state) => {
          const item = findItemInCollections(state.collections, id)

          if (item && item.type === EVMItemType.SmartContract && item.contract && item.contract.abi) {
            const abi = JSON.parse(item.contract.abi)
            const newAbi = abi.map((method: EVMABIMethod) => {
              if (method.name === methodName) {
                method.comment = comment
              }
              return method
            })
            item.contract.abi = JSON.stringify(newAbi)
          }

          return {
            collections: state.collections,
          }
        }),

      removeItem: (id: string) =>
        set((state) => {
          removeItemInCollection(state.collections, id)

          return {
            collections: state.collections,
          }
        }),
    }),
    {
      name: 'evmCollections',
    },
  ),
)
