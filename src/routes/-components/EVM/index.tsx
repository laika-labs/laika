import { useEffect, useMemo, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Allotment, LayoutPriority, type AllotmentHandle } from 'allotment'
import { BookTextIcon, FoldersIcon, PlusIcon, XIcon } from 'lucide-react'

import { EVMProvider } from '@/components/EVMProvider'
import { Button, buttonVariants } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { findItemInCollections } from '@/lib/collections'
import { cn } from '@/lib/utils'
import { useEVMChainsStore, type EVMChain } from '@/store/chains'
import { useEVMCollectionStore } from '@/store/collections'
import { useEVMTabStore } from '@/store/tabs'

import { Collections } from './Collections'
import { ContractRequest } from './ContractRequest'
import { DocumentContent } from './Documentation/DocumentContent'
import { DocumentList } from './Documentation/DocumentList'
import { Toolbar } from './Toolbar'
import { Welcome } from './Welcome'

export function EVM() {
  const toolbarRef = useRef<AllotmentHandle>(null)

  const { collections, temporaryContracts, addTemporaryContract, removeTemporaryContract } = useEVMCollectionStore()
  const { tabs, activeTabId, setActiveTab, removeTab, clearTabs, addTab } = useEVMTabStore()
  const { setChains } = useEVMChainsStore()

  const isLaptop = useMediaQuery('(min-width: 1024px)')

  const handleAddTemporaryContract = () => {
    const id = addTemporaryContract()
    addTab(id)
  }

  const handleRemoveTab = (tabId: string) => {
    // Clean up temporary contract if it exists
    if (temporaryContracts[tabId]) {
      removeTemporaryContract(tabId)
    }
    removeTab(tabId)
  }

  const handleClearAllTabs = () => {
    // Clean up all temporary contracts before clearing tabs
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

  const displayContractRequest = useMemo(() => {
    if (tabs.length > 0) return <ContractRequest />
    return <Welcome />
  }, [tabs])

  return (
    <EVMProvider>
      <Tabs defaultValue="collections" orientation="vertical" className="size-full">
        <Allotment defaultSizes={[320]} proportionalLayout={false}>
          <Allotment.Pane
            minSize={256}
            maxSize={376}
            preferredSize={320}
            priority={LayoutPriority.High}
            visible={isLaptop}
            snap
          >
            <Allotment defaultSizes={[48, 99999]}>
              <Allotment.Pane minSize={48} maxSize={48}>
                <TooltipProvider>
                  <TabsList className="gap-2 bg-inherit p-1.5">
                    <Tooltip>
                      <TabsTrigger
                        value="collections"
                        className="data-[state=active]:text-primary dark:data-[state=active]:text-primary h-9 flex-none px-0 py-0"
                        asChild
                      >
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" aria-label="Collections">
                            <FoldersIcon />
                          </Button>
                        </TooltipTrigger>
                      </TabsTrigger>
                      <TooltipContent side="right">
                        <p>Collections</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TabsTrigger
                        value="docs"
                        className="data-[state=active]:text-primary dark:data-[state=active]:text-primary h-9 flex-none px-0 py-0"
                        asChild
                      >
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" aria-label="Documentation">
                            <BookTextIcon />
                          </Button>
                        </TooltipTrigger>
                      </TabsTrigger>
                      <TooltipContent side="right">
                        <p>Documentation</p>
                      </TooltipContent>
                    </Tooltip>
                  </TabsList>
                </TooltipProvider>
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
            <TabsContent value="collections" className="m-0 size-full">
              <Allotment
                defaultSizes={[99999, 48]}
                ref={toolbarRef}
                onChange={handleToolbarChange}
                proportionalLayout={false}
              >
                <Allotment.Pane priority={LayoutPriority.High}>
                  <Allotment defaultSizes={[48, 99999]} proportionalLayout={false} vertical>
                    <Allotment.Pane
                      minSize={48}
                      maxSize={48}
                      priority={LayoutPriority.Low}
                      className="flex overflow-x-auto!"
                    >
                      {tabs.map((tab) => {
                        const found = findItemInCollections(collections, tab) || temporaryContracts[tab]
                        if (found === undefined) {
                          removeTab(tab)
                          return null
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
                            <small className="w-44 truncate py-2 text-left text-sm leading-none font-medium">
                              {name}
                            </small>
                            <span
                              className={cn(
                                buttonVariants({ size: 'icon' }),
                                'text-secondary-foreground bg-background hover:bg-muted hidden group-hover:flex focus-visible:ring-0',
                                isActive && 'bg-muted hover:bg-background flex',
                              )}
                              onClick={(e) => {
                                e.stopPropagation()
                                handleRemoveTab(tab)
                              }}
                            >
                              <XIcon />
                            </span>
                          </Button>
                        )
                      })}
                      <Button variant="ghost" className="h-auto w-12 rounded-none" onClick={handleAddTemporaryContract}>
                        <PlusIcon />
                      </Button>
                      {activeTabId !== null && (
                        <Button variant="ghost" className="h-auto rounded-none" onClick={handleClearAllTabs}>
                          <small className="truncate py-2 text-sm leading-none font-medium">Close All Tabs</small>
                        </Button>
                      )}
                    </Allotment.Pane>
                    <Allotment.Pane priority={LayoutPriority.High}>{displayContractRequest}</Allotment.Pane>
                  </Allotment>
                </Allotment.Pane>
                <Allotment.Pane
                  minSize={48}
                  maxSize={448}
                  preferredSize={48}
                  priority={LayoutPriority.Low}
                  visible={isLaptop}
                >
                  <Toolbar toolbarRef={toolbarRef} />
                </Allotment.Pane>
              </Allotment>
            </TabsContent>
            <TabsContent value="docs" className="m-0 size-full">
              <DocumentContent />
            </TabsContent>
          </Allotment.Pane>
        </Allotment>
      </Tabs>
    </EVMProvider>
  )
}
