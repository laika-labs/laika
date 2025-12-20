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
      <TabsList className="h-auto w-fit flex-row! gap-2 bg-transparent p-0">
        <TabsTrigger value="state" render={<TabsButton>State</TabsButton>} />
        <TabsTrigger value="read" render={<TabsButton>Read</TabsButton>} />
        <TabsTrigger value="write" render={<TabsButton>Write</TabsButton>} />
        <TabsTrigger value="abi" render={<TabsButton>ABI</TabsButton>} />
      </TabsList>
      <TabsContent value="state" className="flex-1 overflow-y-auto p-px">
        <StateTab smartContract={smartContract} />
      </TabsContent>
      <TabsContent value="read" className="flex-1 overflow-y-auto p-px">
        <ReadTab smartContract={smartContract} />
      </TabsContent>
      <TabsContent value="write" className="flex-1 overflow-y-auto p-px">
        <WriteTab smartContract={smartContract} />
      </TabsContent>
      <TabsContent value="abi" className="flex-1 overflow-y-auto p-px">
        <ABITab smartContract={smartContract} />
      </TabsContent>
    </Tabs>
  )
}
