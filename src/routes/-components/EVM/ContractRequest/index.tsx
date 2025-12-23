import { useMemo } from 'react'
import { Allotment, LayoutPriority } from 'allotment'

import { findItemInCollections } from '@/lib/collections'
import { useEVMCollectionStore } from '@/store/collections'
import { useEVMTabStore } from '@/store/tabs'

import { ContractInput } from './ContractInput'
import { RequestPane } from './RequestPane'
import { ResponsePane } from './ResponsePane'

export function ContractRequest() {
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
    <Allotment defaultSizes={[88, 99999, 256]} proportionalLayout={false} vertical>
      <Allotment.Pane minSize={88} maxSize={88} priority={LayoutPriority.High} className="p-4">
        <ContractInput
          id={smartContract.id}
          chainId={smartContract?.chainId}
          address={smartContract.contract?.address || ''}
        />
      </Allotment.Pane>
      <Allotment.Pane minSize={0} priority={LayoutPriority.High} className="p-4">
        <RequestPane />
      </Allotment.Pane>
      <Allotment.Pane minSize={256} preferredSize={256} priority={LayoutPriority.Low} snap>
        <ResponsePane />
      </Allotment.Pane>
    </Allotment>
  )
}
