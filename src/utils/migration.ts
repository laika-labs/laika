import { EVMCollectionStore } from '@/store/collections'

interface LagacySmartContract {
  address: string
  abi: unknown
  name: string
  children: undefined
}

interface LagacyFolder {
  address: undefined
  abi: undefined
  name: string
  children: (LagacySmartContract | LagacyFolder)[]
}

export const migrateCollections = (
  data: LagacyFolder,
  {
    addCollection,
    addFolder,
    addSmartContract,
    updateContractAddress,
    updateContractABI,
  }: Pick<
    EVMCollectionStore,
    'addCollection' | 'addFolder' | 'addSmartContract' | 'updateContractAddress' | 'updateContractABI'
  >,
) => {
  const traverse = (id: string, list: (LagacySmartContract | LagacyFolder)[]) => {
    const addressABIPair: Record<string, unknown[]> = {}
    list.forEach((item) => {
      if (item.address) {
        if (addressABIPair[item.address]) {
          addressABIPair[item.address] = [...addressABIPair[item.address], item.abi]
        } else {
          addressABIPair[item.address] = [item.abi]
        }
      }
      if (item.children) {
        const folderId = addFolder(id, item.name)
        traverse(folderId, item.children)
      }
    })

    Object.keys(addressABIPair).forEach((address) => {
      addSmartContract(id, (contract) => {
        updateContractAddress(contract.id, address)
        updateContractABI(contract.id, JSON.stringify(addressABIPair[address]))
      })
    })
  }

  data.children.forEach((collection) => {
    const collectionId = addCollection(collection.name)
    if (collection.children) {
      traverse(collectionId, collection.children)
    }
  })
}
