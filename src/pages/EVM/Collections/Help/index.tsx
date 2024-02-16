import { Download, HelpCircle, PackagePlus } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { toast } from '@/components/ui/use-toast'
import { useEVMCollectionStore } from '@/store/collections'
import { migrateCollections } from '@/utils/migration'

interface HelpProps {
  appCollections: string
}

export default function Help({ appCollections }: HelpProps) {
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
      toast({
        title: 'Export successfully.',
      })
    } catch {
      toast({
        variant: 'destructive',
        title: 'Export failed.',
      })
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
      toast({
        title: 'Migrate successfully.',
      })
    } catch {
      toast({
        variant: 'destructive',
        title: 'Migrate failed',
      })
    }
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <TooltipProvider>
        <Tooltip>
          <DialogTrigger asChild>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="w-8 h-8">
                <HelpCircle className="w-4 h-4" />
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
          <Card className="text-center cursor-pointer" onClick={handleExport}>
            <CardHeader className="items-center">
              <Download className="w-10 h-10" />
            </CardHeader>
            <CardContent>
              <CardTitle>Export</CardTitle>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">Export a legacy collections</p>
            </CardFooter>
          </Card>
          <Card className="text-center cursor-pointer" onClick={handleMigrate}>
            <CardHeader className="items-center">
              <PackagePlus className="w-10 h-10" />
            </CardHeader>
            <CardContent>
              <CardTitle>Migrate</CardTitle>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">Migrate a legacy collections</p>
            </CardFooter>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
