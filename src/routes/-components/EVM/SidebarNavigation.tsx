import { BookTextIcon, FoldersIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

export function SidebarNavigation() {
  return (
    <TooltipProvider>
      <TabsList className="gap-2 bg-inherit p-1.5">
        <Tooltip>
          <TooltipTrigger
            render={
              <TabsTrigger
                value="collections"
                className="aria-selected:text-primary dark:aria-selected:text-primary flex-none"
                render={<Button variant="ghost" size="icon" aria-label="Collections" />}
              >
                <FoldersIcon />
              </TabsTrigger>
            }
          />
          <TooltipContent side="right">
            <p>Collections</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger
            render={
              <TabsTrigger
                value="docs"
                className="aria-selected:text-primary dark:aria-selected:text-primary flex-none"
                render={<Button variant="ghost" size="icon" aria-label="Documentation" />}
              >
                <BookTextIcon />
              </TabsTrigger>
            }
          />
          <TooltipContent side="right">
            <p>Documentation</p>
          </TooltipContent>
        </Tooltip>
      </TabsList>
    </TooltipProvider>
  )
}
