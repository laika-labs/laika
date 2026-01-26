import { useCallback } from 'react'
import { PlusIcon, XIcon } from 'lucide-react'

import { Button, buttonVariants } from '@/components/ui/button'
import { findItemInCollections } from '@/lib/collections'
import { cn } from '@/lib/utils'
import { useEVMCollectionStore } from '@/store/collections'
import { useEVMTabStore } from '@/store/tabs'

interface ContractTabsBarProps {
  onAddTab: () => void
  onRemoveTab: (tabId: string) => void
  onClearAllTabs: () => void
}

export function ContractTabsBar({ onAddTab, onRemoveTab, onClearAllTabs }: ContractTabsBarProps) {
  const { collections, temporaryContracts } = useEVMCollectionStore()
  const { tabs, activeTabId, setActiveTab } = useEVMTabStore()

  const getTabName = useCallback(
    (tabId: string): string | null => {
      const found = findItemInCollections(collections, tabId) || temporaryContracts[tabId]
      return found?.name ?? null
    },
    [collections, temporaryContracts],
  )

  return (
    <div className="flex">
      <div className="flex overflow-x-auto">
        {tabs.map((tab) => {
          const name = getTabName(tab)
          if (name === null) {
            return null
          }

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
              <button
                type="button"
                aria-label={`Close ${name} tab`}
                className={cn(
                  buttonVariants({ size: 'icon' }),
                  'text-secondary-foreground bg-background hover:bg-muted hidden group-hover:flex focus-visible:ring-0',
                  isActive && 'bg-muted hover:bg-background flex',
                )}
                onClick={(e) => {
                  e.stopPropagation()
                  onRemoveTab(tab)
                }}
              >
                <XIcon aria-hidden="true" />
              </button>
            </Button>
          )
        })}
      </div>
      <Button variant="ghost" className="h-auto w-10 rounded-none" onClick={onAddTab} aria-label="Add new tab">
        <PlusIcon aria-hidden="true" />
      </Button>
      {activeTabId !== null && (
        <Button variant="ghost" className="h-auto rounded-none" onClick={onClearAllTabs}>
          <small className="truncate py-2 text-sm leading-none font-medium">Close All Tabs</small>
        </Button>
      )}
    </div>
  )
}
