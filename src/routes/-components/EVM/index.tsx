import { useEffect, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Allotment, LayoutPriority, type AllotmentHandle } from 'allotment'

import { EVMProvider } from '@/components/EVMProvider'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { findItemInCollections } from '@/lib/collections'
import { useEVMChainsStore, type EVMChain } from '@/store/chains'
import { useEVMCollectionStore } from '@/store/collections'
import { useEVMTabStore } from '@/store/tabs'

import { Collections } from './Collections'
import { DocumentList } from './Documentation/DocumentList'
import { MainContentArea } from './MainContentArea'
import { SidebarNavigation } from './SidebarNavigation'
import { Toolbar } from './Toolbar'

export function EVM() {
  const toolbarRef = useRef<AllotmentHandle>(null)
  const [sidebarTab, setSidebarTab] = useState<string>('collections')

  const { collections, temporaryContracts, addTemporaryContract, removeTemporaryContract } = useEVMCollectionStore()
  const { tabs, removeTab, clearTabs, addTab } = useEVMTabStore()
  const { setChains } = useEVMChainsStore()

  const isLaptop = useMediaQuery('(min-width: 1024px)')

  const handleAddTemporaryContract = () => {
    const id = addTemporaryContract()
    addTab(id)
  }

  const handleRemoveTab = (tabId: string) => {
    if (temporaryContracts[tabId]) {
      removeTemporaryContract(tabId)
    }
    removeTab(tabId)
  }

  const handleClearAllTabs = () => {
    tabs.forEach((tabId) => {
      if (temporaryContracts[tabId]) {
        removeTemporaryContract(tabId)
      }
    })
    clearTabs()
  }

  const handleToolbarChange = (sizes: number[]) => {
    if (sizes?.[1] > 48 && sizes?.[1] < 384) {
      toolbarRef.current?.resize([sizes?.[0], 384])
    }
  }

  const { data: chains } = useQuery({
    queryKey: ['chains'],
    queryFn: async (): Promise<EVMChain[]> => {
      const res = await fetch('https://chainlist.org/rpcs.json')
      if (!res.ok) {
        throw new Error('Failed to fetch chains')
      }
      return res.json()
    },
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 24,
  })

  useEffect(() => {
    if (chains) {
      setChains(chains)
    }
  }, [chains, setChains])

  useEffect(() => {
    tabs.forEach((tab) => {
      const found = findItemInCollections(collections, tab) || temporaryContracts[tab]
      if (!found) {
        removeTab(tab)
      }
    })
  }, [tabs, collections, temporaryContracts, removeTab])

  return (
    <EVMProvider>
      <Tabs value={sidebarTab} onValueChange={setSidebarTab} orientation="vertical" className="size-full">
        <Allotment defaultSizes={[320]} proportionalLayout={false}>
          <Allotment.Pane
            minSize={256}
            maxSize={376}
            preferredSize={320}
            priority={LayoutPriority.High}
            visible={isLaptop}
            snap
          >
            <Allotment defaultSizes={[40, 99999]}>
              <Allotment.Pane minSize={40} maxSize={40}>
                <SidebarNavigation />
              </Allotment.Pane>
              <Allotment.Pane>
                <TabsContent value="collections" className="m-0 size-full">
                  <Collections />
                </TabsContent>
                <TabsContent value="docs" className="m-0 size-full">
                  <DocumentList />
                </TabsContent>
              </Allotment.Pane>
            </Allotment>
          </Allotment.Pane>
          <Allotment.Pane priority={LayoutPriority.Low}>
            <Allotment
              defaultSizes={[99999, 40]}
              ref={toolbarRef}
              onChange={handleToolbarChange}
              proportionalLayout={false}
            >
              <Allotment.Pane priority={LayoutPriority.High}>
                <MainContentArea
                  sidebarTab={sidebarTab}
                  onAddTab={handleAddTemporaryContract}
                  onRemoveTab={handleRemoveTab}
                  onClearAllTabs={handleClearAllTabs}
                />
              </Allotment.Pane>
              {sidebarTab !== 'docs' && (
                <Allotment.Pane
                  minSize={40}
                  maxSize={448}
                  preferredSize={40}
                  priority={LayoutPriority.Low}
                  visible={isLaptop}
                >
                  <Toolbar toolbarRef={toolbarRef} />
                </Allotment.Pane>
              )}
            </Allotment>
          </Allotment.Pane>
        </Allotment>
      </Tabs>
    </EVMProvider>
  )
}
