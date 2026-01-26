import { useMemo } from 'react'
import { Allotment, LayoutPriority } from 'allotment'

import { EnvironmentDropdown } from '@/components/EnvironmentDropdown'
import { useEVMTabStore } from '@/store/tabs'

import { ContractRequest } from './ContractRequest'
import { ContractTabsBar } from './ContractTabsBar'
import { DocumentContent } from './Documentation/DocumentContent'
import { Welcome } from './Welcome'

interface MainContentAreaProps {
  sidebarTab: string
  onAddTab: () => void
  onRemoveTab: (tabId: string) => void
  onClearAllTabs: () => void
}

export function MainContentArea({ sidebarTab, onAddTab, onRemoveTab, onClearAllTabs }: MainContentAreaProps) {
  const { tabs } = useEVMTabStore()

  const displayContent = useMemo(() => {
    if (tabs.length > 0) return <ContractRequest />
    return <Welcome />
  }, [tabs.length])

  const mainContent = useMemo(() => {
    if (sidebarTab === 'docs') {
      return <DocumentContent />
    }
    return (
      <Allotment defaultSizes={[40, 99999]} proportionalLayout={false} vertical>
        <Allotment.Pane minSize={40} maxSize={40} priority={LayoutPriority.Low} className="flex">
          <ContractTabsBar onAddTab={onAddTab} onRemoveTab={onRemoveTab} onClearAllTabs={onClearAllTabs} />
          <div className="ml-auto flex h-full items-center border-l px-2">
            <EnvironmentDropdown />
          </div>
        </Allotment.Pane>
        <Allotment.Pane priority={LayoutPriority.High}>{displayContent}</Allotment.Pane>
      </Allotment>
    )
  }, [sidebarTab, displayContent, onAddTab, onRemoveTab, onClearAllTabs])

  return mainContent
}
