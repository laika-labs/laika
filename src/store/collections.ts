import { v4 as uuidv4 } from 'uuid'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { findItemInCollections, removeItemInCollection } from '@/lib/collections'

export const EVMItemType = {
  Collection: 'collection',
  SmartContract: 'smart-contract',
  Folder: 'folder',
} as const

export interface EVMContract {
  id: string
  name: string
  type: typeof EVMItemType.SmartContract
  chainId?: number
  rpcUrl?: string
  contract: {
    address?: string
    abi?: string
  }
}

export interface EVMFolder {
  id: string
  name: string
  type: typeof EVMItemType.Folder
  isOpen: boolean
  items: (EVMContract | EVMFolder)[]
}

export interface EVMCollection {
  id: string
  name: string
  type: typeof EVMItemType.Collection
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
  temporaryContracts: Record<string, EVMContract>
  addCollection: (name?: string) => string
  removeCollection: (id: string) => void
  renameItem: (id: string, name: string) => void
  toggleOpen: (id: string) => void
  addFolder: (id: string, name?: string) => string
  addSmartContract: (id: string, cb: (contract: EVMContract) => void) => void
  updateContractChainId: (id: string, chainId: number) => void
  updateContractRpcUrl: (id: string, rpcUrl: string) => void
  updateContractAddress: (id: string, address: string) => void
  updateContractABI: (id: string, abi: string) => void
  updateContractComment: (id: string, methodName: string, comment: string) => void
  removeItem: (id: string) => void
  addTemporaryContract: () => string
  convertTemporaryToPermanent: (temporaryId: string, parentId: string) => string
  removeTemporaryContract: (id: string) => void
}

const collections: EVMCollection[] = [
  {
    id: uuidv4(),
    name: 'Example Contracts (Sepolia)',
    type: EVMItemType.Collection,
    isOpen: true,
    items: [
      {
        id: uuidv4(),
        name: 'LaikaTestingContract',
        type: EVMItemType.SmartContract,
        chainId: 11155111,
        contract: {
          address: '0xbB39Cb0a1B8B95cbB1Ae7681507e420CF7307396',
          abi: '[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[],"name":"Increment","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"","type":"uint256"}],"name":"Reset","type":"event"},{"inputs":[],"name":"count","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getCountDetail","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"increment","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"lastUpdate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"_name","type":"string"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"_count","type":"uint256"}],"name":"reset","outputs":[],"stateMutability":"payable","type":"function"}]',
        },
      },
    ],
  },
]

export const useEVMCollectionStore = create<EVMCollectionStore>()(
  persist(
    (set) => ({
      collections: [...collections],
      temporaryContracts: {},
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
            return {
              collections: state.collections,
            }
          }

          const tempContract = state.temporaryContracts[id]
          if (tempContract) {
            return {
              temporaryContracts: {
                ...state.temporaryContracts,
                [id]: { ...tempContract, chainId },
              },
            }
          }

          return state
        }),
      updateContractRpcUrl: (id: string, rpcUrl: string) =>
        set((state) => {
          const item = findItemInCollections(state.collections, id)

          if (item && item.type === EVMItemType.SmartContract) {
            item.rpcUrl = rpcUrl
            return {
              collections: state.collections,
            }
          }

          const tempContract = state.temporaryContracts[id]
          if (tempContract) {
            return {
              temporaryContracts: {
                ...state.temporaryContracts,
                [id]: { ...tempContract, rpcUrl },
              },
            }
          }

          return state
        }),
      updateContractAddress: (id: string, address: string) =>
        set((state) => {
          const item = findItemInCollections(state.collections, id)

          if (item && item.type === EVMItemType.SmartContract) {
            item.contract.address = address
            return {
              collections: state.collections,
            }
          }

          const tempContract = state.temporaryContracts[id]
          if (tempContract) {
            return {
              temporaryContracts: {
                ...state.temporaryContracts,
                [id]: {
                  ...tempContract,
                  contract: { ...tempContract.contract, address },
                },
              },
            }
          }

          return state
        }),
      updateContractABI: (id: string, abi: string) =>
        set((state) => {
          const item = findItemInCollections(state.collections, id)

          if (item && item.type === EVMItemType.SmartContract) {
            item.contract.abi = abi
            return { collections: state.collections }
          }

          const tempContract = state.temporaryContracts[id]
          if (tempContract) {
            return {
              temporaryContracts: {
                ...state.temporaryContracts,
                [id]: {
                  ...tempContract,
                  contract: { ...tempContract.contract, abi },
                },
              },
            }
          }

          return state
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
      addTemporaryContract: () => {
        const id = uuidv4()
        const contract: EVMContract = {
          id,
          name: 'New Smart Contract',
          type: EVMItemType.SmartContract,
          contract: {},
        }
        set((state) => ({
          temporaryContracts: { ...state.temporaryContracts, [id]: contract },
        }))
        return id
      },
      convertTemporaryToPermanent: (temporaryId: string, parentId: string) => {
        let newId = ''
        set((state) => {
          const tempContract = state.temporaryContracts[temporaryId]
          if (!tempContract) {
            return state
          }

          const parent = findItemInCollections(state.collections, parentId)
          if (!parent || parent.type === EVMItemType.SmartContract) {
            return state
          }

          const contract: EVMContract = {
            id: uuidv4(),
            name: tempContract.name,
            type: EVMItemType.SmartContract,
            chainId: tempContract.chainId,
            contract: {
              address: tempContract.contract.address,
              abi: tempContract.contract.abi,
            },
          }

          newId = contract.id
          parent.items.push(contract)

          const temporaryContracts = { ...state.temporaryContracts }
          delete temporaryContracts[temporaryId]

          return {
            collections: state.collections,
            temporaryContracts,
          }
        })
        return newId
      },
      removeTemporaryContract: (id: string) =>
        set((state) => {
          const temporaryContracts = { ...state.temporaryContracts }
          delete temporaryContracts[id]
          return { temporaryContracts }
        }),
    }),
    {
      name: 'evmCollections',
    },
  ),
)
