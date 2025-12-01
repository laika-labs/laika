import { useMemo, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Allotment, LayoutPriority, type AllotmentHandle } from 'allotment'
import { BookTextIcon, FoldersIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useEVMChainsStore, type EVMChain } from '@/store/chains'
import { useEVMTabStore } from '@/store/tabs'

import { Collections } from './Collections'
import { ContractRequest } from './ContractRequest'
import { DocumentContent } from './Documentation/DocumentContent'
import { DocumentList } from './Documentation/DocumentList'
import { Toolbar } from './Toolbar'
import { Welcome } from './Welcome'

export function EVM() {
  const toolbarRef = useRef<AllotmentHandle>(null)

  const { tabs } = useEVMTabStore()
  const { setChains } = useEVMChainsStore()

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

  useMemo(() => {
    if (chains) {
      setChains(chains)
    }
  }, [chains, setChains])

  const displayContractRequest = useMemo(() => {
    if (tabs.length > 0) return <ContractRequest />
    return <Welcome />
  }, [tabs])

  return (
    <Tabs defaultValue="collections" orientation="vertical" className="size-full">
      <Allotment defaultSizes={[320]} proportionalLayout={false}>
        <Allotment.Pane minSize={256} maxSize={376} preferredSize={320} priority={LayoutPriority.High} snap>
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
              <Allotment.Pane priority={LayoutPriority.High}>{displayContractRequest}</Allotment.Pane>
              <Allotment.Pane minSize={48} maxSize={448} preferredSize={48} priority={LayoutPriority.Low}>
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
  )
}
