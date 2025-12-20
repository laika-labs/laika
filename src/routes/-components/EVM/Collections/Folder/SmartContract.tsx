import { useState } from 'react'
import debounce from 'lodash.debounce'
import times from 'lodash.times'
import { FileCodeIcon, MoreHorizontal } from 'lucide-react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { isItemMatchSearchText } from '@/lib/collections'
import { cn } from '@/lib/utils'
import { useEVMCollectionStore, type EVMContract } from '@/store/collections'
import { useEVMTabStore } from '@/store/tabs'

import { Rename } from './Rename'

interface SmartContractProps {
  smartContract: EVMContract
  level: number
  search: string
}

export function SmartContract({ smartContract, level, search }: SmartContractProps) {
  const [isRenaming, setIsRenaming] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const { removeItem } = useEVMCollectionStore()
  const { activeTabId, addTab, removeTab, setActiveTab } = useEVMTabStore()

  const handleOpen = () => {
    addTab(smartContract.id)
    setActiveTab(smartContract.id)
  }

  const handleToggleRename = debounce(() => {
    setIsRenaming((isRenaming) => !isRenaming)
  }, 200)

  const handleToggleDelete = () => {
    setIsDeleting((isDeleting) => !isDeleting)
  }

  const handleRemoveItem = () => {
    removeTab(smartContract.id)
    removeItem(smartContract.id)
    handleToggleDelete()
  }

  if (search !== '' && !isItemMatchSearchText(smartContract, search)) {
    return null
  }

  return (
    <div className={cn('flex', activeTabId === smartContract.id ? 'bg-muted' : 'hover:bg-muted/60')}>
      {times(level, (index) => (
        <div key={index} className="bg-muted-foreground/30 ml-4 w-0.5"></div>
      ))}
      <div className="flex flex-1 truncate px-2">
        <div className="flex min-w-0 flex-1 cursor-pointer items-center justify-center gap-2" onClick={handleOpen}>
          <FileCodeIcon className="size-3.5" />
          <div className="flex flex-1 truncate select-none">
            {isRenaming ? (
              <Rename id={smartContract.id} itemName={smartContract.name} onSave={handleToggleRename} />
            ) : (
              <small className="truncate py-2 text-sm leading-none font-medium">{smartContract.name}</small>
            )}
          </div>
        </div>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" className="h-auto p-2 focus-visible:ring-0" aria-label="More options">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            }
          />
          <DropdownMenuContent>
            <DropdownMenuItem onClick={handleToggleRename}>Rename</DropdownMenuItem>
            <DropdownMenuItem onClick={handleToggleDelete}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <AlertDialog open={isDeleting}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete "{smartContract.name}"?</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to delete {smartContract.name}?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleToggleDelete}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRemoveItem}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
