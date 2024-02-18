import { useMemo } from 'react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { EVMContract, useEVMCollectionStore } from '@/store/collections'
import { useEVMTabStore } from '@/store/tabs'
import { findItemInCollections } from '@/utils/collections'

import ABITab from './ABITab'
import ReadTab from './ReadTab'
import StateTab from './StateTab'
import TabsButton from './TabsButton'
import WriteTab from './WriteTab'

export default function RequestPane() {
  const { collections } = useEVMCollectionStore()
  const { activeTabId } = useEVMTabStore()

  const smartContract = useMemo(() => {
    return findItemInCollections(collections, activeTabId as string) as EVMContract
  }, [activeTabId, collections])

  return (
    <Tabs defaultValue="state" className="flex flex-col h-full">
      <TabsList className="flex h-auto gap-4 p-0 w-fit bg-background">
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
