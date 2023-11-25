import debounce from 'lodash.debounce'
import times from 'lodash.times'
import { MoreHorizontal } from 'lucide-react'
import { useState } from 'react'

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
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { EVMContract, useEVMCollectionStore } from '@/store/collections'

import Rename from './Rename'

interface SmartContractProps {
  smartContract: EVMContract
  level: number
}

export default function SmartContract({ smartContract, level }: SmartContractProps) {
  const [isRenaming, setIsRenaming] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const { removeItem } = useEVMCollectionStore()

  const handleToggleRename = debounce(() => {
    setIsRenaming((isRenaming) => !isRenaming)
  }, 200)

  const handleToggleDelete = () => {
    setIsDeleting((isDeleting) => !isDeleting)
  }

  const handleRemoveItem = () => {
    removeItem(smartContract.id)
    handleToggleDelete()
  }

  return (
    <div className="flex hover:bg-muted/60">
      {times(level, (index) => (
        <div key={index} className="ml-4 w-0.5 bg-muted-foreground/30"></div>
      ))}
      <div className="flex flex-1 px-2 truncate">
        <div className="flex items-center justify-center flex-1 min-w-0 gap-2 cursor-pointer">
          <Badge className="p-0.5">Contract</Badge>
          <div className="flex flex-1 truncate select-none">
            {isRenaming ? (
              <Rename id={smartContract.id} itemName={smartContract.name} onSave={handleToggleRename} />
            ) : (
              <small className="py-2 text-sm font-medium leading-none truncate">{smartContract.name}</small>
            )}
          </div>
        </div>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-auto p-2 focus-visible:ring-0">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
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
