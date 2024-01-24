import { Allotment, LayoutPriority } from 'allotment'
import { BookText, Folders } from 'lucide-react'
import { useEffect, useMemo } from 'react'

import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useEVMChainsStore } from '@/store/chains'
import { useEVMTabStore } from '@/store/tabs'

import Collections from './Collections'
import ContractRequest from './ContractRequest'
import DocumentContent from './Documentation/DocumentContent'
import DocumentList from './Documentation/DocumentList'
import Welcome from './Welcome'

export default function EVM() {
  const { tabs } = useEVMTabStore()
  const { setChains } = useEVMChainsStore()

  useEffect(() => {
    const fetchChains = async () => {
      const res = await fetch('https://chainid.network/chains.json')
      const chains = await res.json()
      setChains(chains)
    }
    fetchChains()
  }, [setChains])

  const displayContractRequest = useMemo(() => {
    if (tabs.length > 0) return <ContractRequest />
    return <Welcome />
  }, [tabs])

  return (
    <Tabs defaultValue="collections" orientation="vertical" className="w-full h-full">
      <Allotment proportionalLayout={false}>
        <Allotment.Pane minSize={256} maxSize={376} preferredSize={320} priority={LayoutPriority.High} snap>
          <Allotment>
            <Allotment.Pane minSize={48} maxSize={48}>
              <TooltipProvider>
                <TabsList className="gap-2 p-2 bg-inherit">
                  <Tooltip>
                    <TabsTrigger
                      value="collections"
                      className="data-[state=active]:text-primary data-[state=active]:shadow-none"
                      asChild
                    >
                      <TooltipTrigger asChild>
                        <Button variant="ghost" className="h-auto p-2">
                          <Folders className="w-4 h-4" />
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
                      className="data-[state=active]:text-primary data-[state=active]:shadow-none"
                      asChild
                    >
                      <TooltipTrigger asChild>
                        <Button variant="ghost" className="h-auto p-2">
                          <BookText className="w-4 h-4" />
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
              <TabsContent value="collections" className="w-full h-full m-0">
                <Collections />
              </TabsContent>
              <TabsContent value="docs" className="w-full h-full m-0">
                <DocumentList />
              </TabsContent>
            </Allotment.Pane>
          </Allotment>
        </Allotment.Pane>
        <Allotment.Pane priority={LayoutPriority.Low}>
          <TabsContent value="collections" className="w-full h-full m-0">
            {displayContractRequest}
          </TabsContent>
          <TabsContent value="docs" className="w-full h-full m-0">
            <DocumentContent />
          </TabsContent>
        </Allotment.Pane>
      </Allotment>
    </Tabs>
  )
}
