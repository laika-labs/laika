import { useEffect, useState } from 'react'
import { Allotment, type AllotmentHandle } from 'allotment'
import { ArrowRightLeft, Code2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { useEVMTabStore } from '@/store/tabs'

import { CodeSnippet } from './CodeSnippet'
import { UnitConverter } from './UnitConverter'

interface ToolbarProps {
  toolbarRef: React.RefObject<AllotmentHandle | null>
}

export function Toolbar({ toolbarRef }: ToolbarProps) {
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
    <Tabs value={value} onValueChange={handleValueChange} orientation="vertical" className="size-full">
      <Allotment onChange={handleToolbarChange}>
        <Allotment.Pane minSize={48} maxSize={48}>
          <TooltipProvider>
            <TabsList className="gap-2 bg-inherit p-1.5">
              {activeTabId !== null && (
                <Tooltip>
                  <TabsTrigger
                    value="code"
                    className={cn(
                      'h-9 flex-none px-0 py-0 data-[state=active]:shadow-none',
                      open && 'data-[state=active]:text-primary',
                    )}
                    onClick={handleToolbarOpen}
                    asChild
                  >
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Code2 />
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
                  className={cn(
                    'h-9 flex-none px-0 py-0 data-[state=active]:shadow-none',
                    open && 'data-[state=active]:text-primary',
                  )}
                  onClick={handleToolbarOpen}
                  asChild
                >
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <ArrowRightLeft />
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
            <TabsContent value="code" className="m-0 size-full">
              <CodeSnippet handleClose={handleToolbarClose} />
            </TabsContent>
          )}
          <TabsContent value="unit-converter" className="m-0 size-full">
            <UnitConverter handleClose={handleToolbarClose} />
          </TabsContent>
        </Allotment.Pane>
      </Allotment>
    </Tabs>
  )
}
