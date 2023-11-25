import { UUID } from 'crypto'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { findItemInCollections, removeItemInCollection } from '@/utils/collections'

export enum EVMItemType {
  Collection = 'collection',
  SmartContract = 'smart-contract',
  Folder = 'folder',
}

export interface EVMContract {
  id: UUID
  name: string
  type: EVMItemType.SmartContract
  contract: {
    address?: string
    abi?: string
  }
}

export interface EVMFolder {
  id: UUID
  name: string
  type: EVMItemType.Folder
  isOpen: boolean
  items: (EVMContract | EVMFolder)[]
}

export interface EVMCollection {
  id: UUID
  name: string
  type: EVMItemType.Collection
  isOpen: boolean
  items: (EVMContract | EVMFolder)[]
}

const collections: EVMCollection[] = []

export const useEVMCollectionStore = create<{
  collections: EVMCollection[]
  addCollection: () => void
  removeCollection: (id: UUID) => void
  renameItem: (id: UUID, name: string) => void
  toggleOpen: (id: UUID) => void
  addFolder: (id: UUID) => void
  addSmartContract: (id: UUID) => void
  removeItem: (id: UUID) => void
}>()(
  persist(
    (set) => ({
      collections: [...collections],
      addCollection: () =>
        set((state) => {
          const collection: EVMCollection = {
            id: crypto.randomUUID(),
            name: 'New Collection',
            type: EVMItemType.Collection,
            isOpen: true,
            items: [],
          }

          return { collections: [...state.collections, collection] }
        }),
      removeCollection: (id: UUID) =>
        set((state) => ({
          collections: state.collections.filter((c) => c.id !== id),
        })),
      renameItem: (id: UUID, name: string) =>
        set((state) => {
          const item = findItemInCollections(state.collections, id)

          if (item) {
            item.name = name
          }

          return {
            collections: state.collections,
          }
        }),
      toggleOpen: (id: UUID) =>
        set((state) => {
          const item = findItemInCollections(state.collections, id)

          if (item && item.type !== EVMItemType.SmartContract) {
            item.isOpen = !item.isOpen
          }

          return {
            collections: state.collections,
          }
        }),
      addFolder: (id: UUID) =>
        set((state) => {
          const folder: EVMFolder = {
            id: crypto.randomUUID(),
            name: 'New Folder',
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
        }),
      addSmartContract: (id: UUID) =>
        set((state) => {
          const contract: EVMContract = {
            id: crypto.randomUUID(),
            name: 'New Smart Contract',
            type: EVMItemType.SmartContract,
            contract: {},
          }

          const item = findItemInCollections(state.collections, id)

          if (item && item.type !== EVMItemType.SmartContract) {
            item.items.push(contract)
          }

          return {
            collections: state.collections,
          }
        }),
      removeItem: (id: UUID) =>
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
