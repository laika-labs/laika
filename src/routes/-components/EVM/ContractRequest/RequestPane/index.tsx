import { useMemo } from 'react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { findItemInCollections } from '@/lib/collections'
import { useEVMCollectionStore } from '@/store/collections'
import { useEVMTabStore } from '@/store/tabs'

import { ABITab } from './ABITab'
import { ReadTab } from './ReadTab'
import { StateTab } from './StateTab'
import { TabsButton } from './TabsButton'
import { WriteTab } from './WriteTab'

export function RequestPane() {
  const { collections, temporaryContracts } = useEVMCollectionStore()
  const { activeTabId } = useEVMTabStore()

  const smartContract = useMemo(() => {
    if (!activeTabId) return null
    const temp = temporaryContracts[activeTabId]
    if (temp) return temp
    const permanent = findItemInCollections(collections, activeTabId)
    return permanent?.type === 'smart-contract' ? permanent : null
  }, [activeTabId, collections, temporaryContracts])

  if (!smartContract) {
    return null
  }

  return (
    <Tabs defaultValue="state" className="flex h-full flex-col">
      <TabsList className="bg-background flex h-auto w-fit gap-4 p-0">
        <TabsTrigger value="state" asChild>
          <TabsButton>State</TabsButton>
        </TabsTrigger>
        <TabsTrigger value="read" asChild>
          <TabsButton>Read</TabsButton>
        </TabsTrigger>
        <TabsTrigger value="write" asChild>
          <TabsButton>Write</TabsButton>
        </TabsTrigger>
        <TabsTrigger value="abi" asChild>
          <TabsButton>ABI</TabsButton>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="state">
        <StateTab smartContract={smartContract} />
      </TabsContent>
      <TabsContent value="read">
        <ReadTab smartContract={smartContract} />
      </TabsContent>
      <TabsContent value="write">
        <WriteTab smartContract={smartContract} />
      </TabsContent>
      <TabsContent className="flex-auto" value="abi">
        <ABITab smartContract={smartContract} />
      </TabsContent>
    </Tabs>
  )
}
