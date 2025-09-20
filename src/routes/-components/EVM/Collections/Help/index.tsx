import { useState } from 'react'
import { Download, HelpCircle, PackagePlus } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { migrateCollections } from '@/lib/migration'
import { useEVMCollectionStore } from '@/store/collections'

interface HelpProps {
  appCollections: string
}

export function Help({ appCollections }: HelpProps) {
  const [open, setOpen] = useState(false)

  const { addCollection, addFolder, addSmartContract, updateContractAddress, updateContractABI } =
    useEVMCollectionStore()

  const handleExport = () => {
    try {
      const data = JSON.parse(appCollections).data
      const blob = new Blob([JSON.stringify(data)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'legacy-collections.json'
      a.click()
      URL.revokeObjectURL(url)
      toast('Export successfully.')
    } catch {
      toast.error('Export failed.')
    }
    setOpen(false)
  }

  const handleMigrate = () => {
    try {
      migrateCollections(JSON.parse(appCollections).data, {
        addCollection,
        addFolder,
        addSmartContract,
        updateContractAddress,
        updateContractABI,
      })
      toast('Migrate successfully.')
    } catch {
      toast.error('Migrate failed')
    }
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <TooltipProvider>
        <Tooltip>
          <DialogTrigger asChild>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <HelpCircle className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
          </DialogTrigger>
          <TooltipContent>
            <p>Help</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Help</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <Card className="cursor-pointer text-center" onClick={handleExport}>
            <CardHeader className="items-center">
              <Download className="size-10" />
            </CardHeader>
            <CardContent>
              <CardTitle>Export</CardTitle>
            </CardContent>
            <CardFooter>
              <p className="text-muted-foreground text-sm">Export a legacy collections</p>
            </CardFooter>
          </Card>
          <Card className="cursor-pointer text-center" onClick={handleMigrate}>
            <CardHeader className="items-center">
              <PackagePlus className="size-10" />
            </CardHeader>
            <CardContent>
              <CardTitle>Migrate</CardTitle>
            </CardContent>
            <CardFooter>
              <p className="text-muted-foreground text-sm">Migrate a legacy collections</p>
            </CardFooter>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
