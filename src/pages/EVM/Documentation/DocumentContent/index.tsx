import groupBy from 'lodash/groupBy'
import { Fragment, useMemo } from 'react'

import { EVMABIMethod, EVMItemType, useEVMCollectionStore } from '@/store/collections'
import { useEVMDocsStore } from '@/store/docs'
import { findItem, flattenItems } from '@/utils/collections'

import ContentABI from './ContentABI'

export default function DocumentContent() {
  const { collections } = useEVMCollectionStore()
  const { activeDocumentId } = useEVMDocsStore()

  const flattenedItems = useMemo(() => {
    if (!activeDocumentId) return null
    const collection = findItem(collections, activeDocumentId)
    if (!collection) return null
    return flattenItems([collection])
  }, [activeDocumentId, collections])

  return (
    <div className="container h-full p-4 mx-auto overflow-scroll">
      {flattenedItems?.map((item) => {
        if (item.type === EVMItemType.Collection) {
          return (
            <h1 key={item.id} className="text-4xl font-extrabold tracking-tight scroll-m-20 lg:text-5xl">
              {item.name}
            </h1>
          )
        } else if (item.type === EVMItemType.Folder) {
          return (
            <h2
              key={item.id}
              className="pb-2 mt-10 text-3xl font-semibold tracking-tight transition-colors border-b scroll-m-20 first:mt-0"
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
            <h3 className="mt-8 text-2xl font-semibold tracking-tight scroll-m-20 first:mt-0">{item.name}</h3>
            {eventList?.length > 0 && <ContentABI title="Events" abi={eventList} />}
            {readFunctionList?.length > 0 && <ContentABI title="Read-Only Functions" abi={readFunctionList} />}
            {writeFunctionList?.length > 0 && <ContentABI title="State-Changing Functions" abi={writeFunctionList} />}
          </Fragment>
        )
      })}
    </div>
  )
}
