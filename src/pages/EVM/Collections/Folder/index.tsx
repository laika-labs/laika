import debounce from 'lodash.debounce'
import times from 'lodash.times'
import { FolderIcon, FolderOpen, MoreHorizontal } from 'lucide-react'
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
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { EVMCollection, EVMFolder, EVMItemType, useEVMCollectionStore } from '@/store/collections'
import { useEVMTabStore } from '@/store/tabs'

import Rename from './Rename'
import SmartContract from './SmartContract'

interface CollectionProps {
  folder: EVMCollection | EVMFolder
  level?: number
}

export default function Folder({ folder, level = 0 }: CollectionProps) {
  const [isRenaming, setIsRenaming] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const { toggleOpen, addFolder, addSmartContract, removeCollection, removeItem } = useEVMCollectionStore()
  const { addTab, setActiveTab } = useEVMTabStore()

  const handleToggleOpen = () => {
    if (isRenaming) return
    toggleOpen(folder.id)
  }

  const handleAddSmartContract = () => {
    addSmartContract(folder.id, (smartContract) => {
      addTab(smartContract.id)
      setActiveTab(smartContract.id)
    })
  }

  const handleAddFolder = () => {
    addFolder(folder.id)
  }

  const handleToggleRename = debounce(() => {
    setIsRenaming((isRenaming) => !isRenaming)
  }, 200)

  const handleToggleDelete = () => {
    setIsDeleting((isDeleting) => !isDeleting)
  }

  const handleRemoveItem = () => {
    if (folder.type === 'collection') {
      removeCollection(folder.id)
    } else {
      removeItem(folder.id)
    }
    handleToggleDelete()
  }

  return (
    <div className="flex flex-col">
      <div className="flex hover:bg-muted/60">
        {times(level, (index) => (
          <div key={index} className="ml-4 w-0.5 bg-muted-foreground/30"></div>
        ))}
        <div className="flex flex-1 px-2 truncate">
          <div
            className="flex items-center justify-center flex-1 min-w-0 gap-2 cursor-pointer"
            onClick={handleToggleOpen}
          >
            {folder.isOpen ? <FolderOpen className="w-4 h-4" /> : <FolderIcon className="w-4 h-4" />}
            <div className="flex flex-1 truncate select-none">
              {isRenaming ? (
                <Rename id={folder.id} itemName={folder.name} onSave={handleToggleRename} />
              ) : (
                <small className="py-2 text-sm font-medium leading-none truncate">{folder.name}</small>
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
              <DropdownMenuItem onClick={handleAddSmartContract}>New Request</DropdownMenuItem>
              <DropdownMenuItem onClick={handleAddFolder}>New Folder</DropdownMenuItem>
              <DropdownMenuItem onClick={handleToggleRename}>Rename</DropdownMenuItem>
              <DropdownMenuItem onClick={handleToggleDelete}>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {folder.isOpen && (
        <div className="flex flex-col">
          {folder.items.length === 0 && (
            <div className="flex">
              {times(level + 1, (index) => (
                <div key={index} className="ml-4 w-0.5 bg-muted-foreground/30"></div>
              ))}
              <div className="flex flex-col items-center flex-1 p-4 space-y-4 select-none text-muted-foreground">
                <p className="text-sm text-center">Create a request for your smart contracts.</p>
                <Button variant="secondary" size="sm" onClick={handleAddSmartContract}>
                  Create Request
                </Button>
              </div>
            </div>
          )}
          {folder.items
            .sort((a) => {
              return a.type === EVMItemType.Folder ? -1 : 1
            })
            .map((item) => {
              if (item.type === EVMItemType.Folder) {
                return <Folder key={item.id} folder={item} level={level + 1} />
              } else if (item.type === EVMItemType.SmartContract) {
                return <SmartContract key={item.id} smartContract={item} level={level + 1} />
              }
              return null
            })}
        </div>
      )}
      <AlertDialog open={isDeleting}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete "{folder.name}"?</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to delete {folder.name}?</AlertDialogDescription>
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
