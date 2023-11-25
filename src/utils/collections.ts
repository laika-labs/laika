import { UUID } from 'crypto'
import find from 'lodash.find'
import forEach from 'lodash.foreach'

import { EVMCollection, EVMContract, EVMFolder, EVMItemType } from '@/store/collections'

type Item = EVMCollection | EVMFolder | EVMContract

export const flattenItems = <T extends Item>(items: T[]): T[] => {
  const flattenedItems: T[] = []

  const flatten = <U extends Item>(itms: U[], flattened: T[]) => {
    itms.forEach((i) => {
      flattened.push(i as unknown as T)

      if (i.type !== EVMItemType.SmartContract) {
        flatten(i.items, flattened)
      }
    })
  }

  flatten(items, flattenedItems)

  return flattenedItems
}

export const findItem = (items: Item[], itemId: UUID) => {
  return find(items, (i) => i.id === itemId)
}

export const findItemInCollections = <T extends Item>(collections: T[], itemId: UUID) => {
  const flattenedItems = flattenItems(collections)

  return findItem(flattenedItems, itemId)
}

export const removeItemInCollection = <T extends Item>(collections: T[], itemId: UUID) => {
  const flattenedItems = flattenItems(collections)

  forEach(flattenedItems, (i) => {
    if (i.type !== EVMItemType.SmartContract) {
      i.items = i.items.filter((it) => it.id !== itemId)
    }
  })
}
