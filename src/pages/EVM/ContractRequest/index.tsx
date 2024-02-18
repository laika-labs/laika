import { Allotment, AllotmentHandle, LayoutPriority } from 'allotment'
import { X } from 'lucide-react'
import { useMemo, useRef } from 'react'

import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { EVMContract, useEVMCollectionStore } from '@/store/collections'
import { useEVMTabStore } from '@/store/tabs'
import { findItemInCollections } from '@/utils/collections'

import ContractAddress from './ContractAddress'
import RequestPane from './RequestPane'
import ResponsePane from './ResponsePane'
import Toolbar from './Toolbar'

export default function ContractRequest() {
  const toolbarRef = useRef<AllotmentHandle>(null)

  const { collections } = useEVMCollectionStore()
  const { tabs, activeTabId, setActiveTab, removeTab, clearTabs } = useEVMTabStore()

  const smartContract = useMemo(() => {
    return findItemInCollections(collections, activeTabId as string) as EVMContract
  }, [activeTabId, collections])

  const handleToolbarChange = (sizes: number[]) => {
    if (sizes?.[1] > 48 && sizes?.[1] < 384) {
      toolbarRef.current?.resize([sizes?.[0], 384])
    }
  }

  return (
    <Allotment vertical proportionalLayout={false}>
      <Allotment.Pane minSize={48} maxSize={48} priority={LayoutPriority.Low} className="flex">
        {tabs.map((tab) => {
          const found = findItemInCollections(collections, tab)
          if (found === undefined) {
            removeTab(tab)
          }

          const name = found?.name
          const isActive = activeTabId === tab

          return (
            <Button
              key={tab}
              className={cn(
                'h-auto text-secondary-foreground bg-background hover:bg-background rounded-none w-52 justify-between group border-r',
                isActive && 'bg-muted hover:bg-muted',
              )}
              onClick={() => setActiveTab(tab)}
            >
              <small className="py-2 text-sm font-medium leading-none truncate">{name}</small>
              <span
                className={cn(
                  buttonVariants(),
                  'hidden text-secondary-foreground w-8 h-8 p-2 focus-visible:ring-0 group-hover:block bg-background hover:bg-muted',
                  isActive && 'block bg-muted hover:bg-background',
                )}
                onClick={(e) => {
                  e.stopPropagation()
                  removeTab(tab)
                }}
              >
                <X className="w-4 h-4" />
              </span>
            </Button>
          )
        })}
        <Button variant="ghost" className="h-auto rounded-none" onClick={clearTabs}>
          <small className="py-2 text-sm font-medium leading-none truncate">Close All Tabs</small>
        </Button>
      </Allotment.Pane>
      <Allotment.Pane priority={LayoutPriority.High}>
        <Allotment ref={toolbarRef} onChange={handleToolbarChange} proportionalLayout={false}>
          <Allotment.Pane priority={LayoutPriority.High}>
            <Allotment vertical proportionalLayout={false}>
              <Allotment.Pane minSize={100} maxSize={100} priority={LayoutPriority.High} className="p-4">
                <ContractAddress
                  id={smartContract.id}
                  chainId={smartContract?.chainId}
                  address={smartContract.contract?.address || ''}
                />
              </Allotment.Pane>
              <Allotment.Pane minSize={0} priority={LayoutPriority.High} className="p-4">
                <div className="h-full overflow-y-auto">
                  <RequestPane />
                </div>
              </Allotment.Pane>
              <Allotment.Pane minSize={256} preferredSize={256} priority={LayoutPriority.Low} snap>
                <ResponsePane />
              </Allotment.Pane>
            </Allotment>
          </Allotment.Pane>
          <Allotment.Pane minSize={48} maxSize={448} preferredSize={48} priority={LayoutPriority.Low}>
            <Toolbar toolbarRef={toolbarRef} />
          </Allotment.Pane>
        </Allotment>
      </Allotment.Pane>
    </Allotment>
  )
}
