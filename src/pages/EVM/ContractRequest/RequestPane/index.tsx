import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import ReadTab from './ReadTab'
import WriteTab from './WriteTab'
import StateTab from './StateTab'
import { useEVMCollectionStore, EVMContract } from '@/store/collections'
import { useEVMTabStore } from '@/store/tabs'
import { findItemInCollections } from '@/utils/collections'
import { UUID } from 'crypto'
import { useMemo } from 'react'

export default function RequestPane() {
  const { collections } = useEVMCollectionStore()
  const { activeTabId } = useEVMTabStore()

  const smartContract = useMemo(() => {
    return findItemInCollections(collections, activeTabId as UUID) as EVMContract
  }, [activeTabId, collections])

  return (
    <>
      <Tabs defaultValue="state" className="w-full">
        <TabsList className="grid grid-cols-4 rounded-none w-[600px]">
          <TabsTrigger value="state">State</TabsTrigger>
          <TabsTrigger value="read">Read</TabsTrigger>
          <TabsTrigger value="write">Write</TabsTrigger>
          <TabsTrigger value="abi">ABI</TabsTrigger>
        </TabsList>
        <TabsContent value="state">
          <StateTab smartContract={smartContract} />
        </TabsContent>
        <TabsContent value="read">
          <ReadTab />
        </TabsContent>
        <TabsContent value="write">
          <WriteTab />
        </TabsContent>
        <TabsContent value="abi">ABI</TabsContent>
      </Tabs>
    </>
  )
}
