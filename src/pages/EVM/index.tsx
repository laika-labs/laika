import { Allotment, LayoutPriority } from 'allotment'
import { Folders } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import Collections from './Collections'

export default function EVM() {
  return (
    <Allotment proportionalLayout={false}>
      <Allotment.Pane minSize={256} maxSize={376} preferredSize={320} priority={LayoutPriority.Low} snap>
        <Tabs defaultValue="collections" orientation="vertical" className="w-full h-full">
          <Allotment>
            <Allotment.Pane minSize={48} maxSize={48}>
              <TabsList className="p-2 bg-inherit">
                <TabsTrigger
                  value="collections"
                  className="data-[state=active]:text-primary data-[state=active]:shadow-none"
                  asChild
                >
                  <Button variant="ghost" className="h-auto p-2">
                    <Folders className="w-4 h-4" />
                  </Button>
                </TabsTrigger>
              </TabsList>
            </Allotment.Pane>
            <Allotment.Pane>
              <TabsContent value="collections" className="w-full h-full m-0">
                <Collections />
              </TabsContent>
            </Allotment.Pane>
          </Allotment>
        </Tabs>
      </Allotment.Pane>
      <Allotment.Pane priority={LayoutPriority.High}> </Allotment.Pane>
    </Allotment>
  )
}
