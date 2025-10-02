import { useMemo } from 'react'
import { Allotment, LayoutPriority } from 'allotment'
import { X } from 'lucide-react'

import { Button, buttonVariants } from '@/components/ui/button'
import { findItemInCollections } from '@/lib/collections'
import { cn } from '@/lib/utils'
import { useEVMCollectionStore, type EVMContract } from '@/store/collections'
import { useEVMTabStore } from '@/store/tabs'

import { ContractAddress } from './ContractAddress'
import { RequestPane } from './RequestPane'
import { ResponsePane } from './ResponsePane'

export function ContractRequest() {
  const { collections } = useEVMCollectionStore()
  const { tabs, activeTabId, setActiveTab, removeTab, clearTabs } = useEVMTabStore()

  const smartContract = useMemo(() => {
    return findItemInCollections(collections, activeTabId as string) as EVMContract
  }, [activeTabId, collections])

  return (
    <Allotment vertical proportionalLayout={false}>
      <Allotment.Pane
        minSize={48}
        maxSize={48}
        priority={LayoutPriority.Low}
        className="no-scrollbar flex !overflow-x-scroll"
      >
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
                'text-secondary-foreground bg-background hover:bg-background group h-auto w-52 justify-between rounded-none border-r',
                isActive && 'bg-muted hover:bg-muted',
              )}
              onClick={() => setActiveTab(tab)}
            >
              <small className="w-44 truncate py-2 text-left text-sm leading-none font-medium">{name}</small>
              <span
                className={cn(
                  buttonVariants({ size: 'icon' }),
                  'text-secondary-foreground bg-background hover:bg-muted hidden group-hover:block focus-visible:ring-0',
                  isActive && 'bg-muted hover:bg-background block',
                )}
                onClick={(e) => {
                  e.stopPropagation()
                  removeTab(tab)
                }}
              >
                <X />
              </span>
            </Button>
          )
        })}
        <Button variant="ghost" className="h-auto rounded-none" onClick={clearTabs}>
          <small className="truncate py-2 text-sm leading-none font-medium">Close All Tabs</small>
        </Button>
      </Allotment.Pane>
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
    </Allotment>
  )
}
