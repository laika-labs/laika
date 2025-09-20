import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

import { ChainExplorerDialog } from './ChainExplorerDialog'
import { NewRequestDialog } from './NewRequestDialog'

export function NewRequest() {
  const [open, setOpen] = useState(false)

  const onDone = () => {
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm">
          New
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Request</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <NewRequestDialog onDone={onDone} />
          <ChainExplorerDialog onDone={onDone} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
