import { Fragment, useMemo } from 'react'
import groupBy from 'lodash.groupby'

import { findItem, flattenItems } from '@/lib/collections'
import { EVMItemType, useEVMCollectionStore, type EVMABIMethod } from '@/store/collections'
import { useEVMDocsStore } from '@/store/docs'

import { ContentABI } from './ContentABI'

export function DocumentContent() {
  const { collections } = useEVMCollectionStore()
  const { activeDocumentId } = useEVMDocsStore()

  const flattenedItems = useMemo(() => {
    if (!activeDocumentId) return null
    const collection = findItem(collections, activeDocumentId)
    if (!collection) return null
    return flattenItems([collection])
  }, [activeDocumentId, collections])

  return (
    <div className="container mx-auto h-full overflow-scroll p-4">
      {flattenedItems?.map((item) => {
        if (item.type === EVMItemType.Collection) {
          return (
            <h1
              key={item.id}
              className="scroll-m-20 text-4xl font-extrabold tracking-tight hover:underline lg:text-5xl"
            >
              {item.name}
            </h1>
          )
        } else if (item.type === EVMItemType.Folder) {
          return (
            <h2
              key={item.id}
              className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0 hover:underline"
            >
              {item.name}
            </h2>
          )
        }

        const abi = item.contract?.abi ? (JSON.parse(item.contract?.abi) as EVMABIMethod[]) : []
        const groupByType = groupBy(abi, 'type') as Record<'event' | 'function', EVMABIMethod[]>

        const eventList = groupByType.event
        const readFunctionList = groupByType.function?.filter(
          (item) => item.stateMutability === 'view' || item.stateMutability === 'pure',
        )
        const writeFunctionList = groupByType.function?.filter(
          (item) => item.stateMutability !== 'view' && item.stateMutability !== 'pure',
        )

        return (
          <Fragment key={item.id}>
            <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0 hover:underline">
              {item.name}
            </h3>
            {eventList?.length > 0 && <ContentABI title="Events" abi={eventList} contractId={item.id} />}
            {readFunctionList?.length > 0 && (
              <ContentABI title="Read-Only Functions" abi={readFunctionList} contractId={item.id} />
            )}
            {writeFunctionList?.length > 0 && (
              <ContentABI title="State-Changing Functions" abi={writeFunctionList} contractId={item.id} />
            )}
          </Fragment>
        )
      })}
    </div>
  )
}
