import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { useCookie } from '@/hooks/useCookie'
import { migrateCollections } from '@/lib/migration'
import { useEVMCollectionStore } from '@/store/collections'

export function useEagerMigrationCollections() {
  const [isMounted, setIsMounted] = useState(false)

  const { collections, addCollection, addFolder, addSmartContract, updateContractAddress, updateContractABI } =
    useEVMCollectionStore()

  const [isMigrated, updateIsMiragrated] = useCookie('migrated-legacy-collections')

  useEffect(() => {
    if (isMounted) return

    setIsMounted(true)
  }, [isMounted])

  useEffect(() => {
    if (isMounted) {
      if (isMigrated === 'true') return

      const appCollections = localStorage.getItem('app_collections')

      if (collections.length === 0 && appCollections !== null) {
        try {
          migrateCollections(JSON.parse(appCollections).data, {
            addCollection,
            addFolder,
            addSmartContract,
            updateContractAddress,
            updateContractABI,
          })
        } catch {
          toast.error('Auto migration legacy collections failed.')
        }
        updateIsMiragrated('true', { expires: new Date(2024, 3, 30) })
      }
    }
  }, [
    addCollection,
    addFolder,
    addSmartContract,
    collections,
    collections.length,
    isMigrated,
    isMounted,
    updateContractABI,
    updateContractAddress,
    updateIsMiragrated,
  ])
}
