import { Allotment, AllotmentHandle } from 'allotment'
import { ArrowRightLeft, Code2 } from 'lucide-react'
import { RefObject, useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

import CodeSnippet from './CodeSnippet'
import { useEVMTabStore } from '@/store/tabs'
import UnitConverter from './UnitConverter'

interface ToolbarProps {
  toolbarRef: RefObject<AllotmentHandle>
}

export default function Toolbar({ toolbarRef }: ToolbarProps) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')
  const [lastValue, setLastValue] = useState('code')

  const { activeTabId } = useEVMTabStore()

  const handleValueChange = (value: string) => {
    setValue(value)
    if (value) {
      setLastValue(value)
    }
  }

  const handleToolbarOpen = () => {
    if (!open) {
      setOpen(true)
      toolbarRef.current?.resize([0, 448])
    }
  }

  const handleToolbarClose = () => {
    setOpen(false)
    toolbarRef.current?.reset()
  }

  const handleToolbarChange = (sizes: number[]) => {
    setOpen(sizes?.[1] > 48)
  }

  useEffect(() => {
    if (open) {
      setValue(lastValue)
    } else {
      setValue('')
    }
  }, [lastValue, open])

  return (
    <Tabs value={value} onValueChange={handleValueChange} orientation="vertical" className="w-full h-full">
      <Allotment onChange={handleToolbarChange}>
        <Allotment.Pane minSize={48} maxSize={48}>
          <TooltipProvider>
            <TabsList className="gap-2 p-2 bg-inherit">
              {activeTabId !== null && (
                <Tooltip>
                  <TabsTrigger
                    value="code"
                    className={cn('data-[state=active]:shadow-none', open && 'data-[state=active]:text-primary')}
                    onClick={handleToolbarOpen}
                    asChild
                  >
                    <TooltipTrigger asChild>
                      <Button variant="ghost" className="h-auto p-2">
                        <Code2 className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                  </TabsTrigger>
                  <TooltipContent side="left">
                    <p>Code Snippet</p>
                  </TooltipContent>
                </Tooltip>
              )}
              <Tooltip>
                <TabsTrigger
                  value="unit-converter"
                  className={cn('data-[state=active]:shadow-none', open && 'data-[state=active]:text-primary')}
                  onClick={handleToolbarOpen}
                  asChild
                >
                  <TooltipTrigger asChild>
                    <Button variant="ghost" className="h-auto p-2">
                      <ArrowRightLeft className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                </TabsTrigger>
                <TooltipContent side="left">
                  <p>Unit Converter</p>
                </TooltipContent>
              </Tooltip>
            </TabsList>
          </TooltipProvider>
        </Allotment.Pane>
        <Allotment.Pane maxSize={448}>
          {activeTabId !== null && (
            <TabsContent value="code" className="w-full h-full m-0">
              <CodeSnippet handleClose={handleToolbarClose} />
            </TabsContent>
          )}
          <TabsContent value="unit-converter" className="w-full h-full m-0">
            <UnitConverter handleClose={handleToolbarClose} />
          </TabsContent>
        </Allotment.Pane>
      </Allotment>
    </Tabs>
  )
}
