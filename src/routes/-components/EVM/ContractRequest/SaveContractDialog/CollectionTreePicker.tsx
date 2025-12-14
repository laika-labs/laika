import { useCallback, useState } from 'react'
import times from 'lodash.times'
import { CheckCircleIcon, FolderIcon, FolderOpenIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { EVMItemType, type EVMCollection, type EVMFolder } from '@/store/collections'

interface EmptyFolderPromptProps {
  level: number
  folderType: typeof EVMItemType.Collection | typeof EVMItemType.Folder
  onCreateFolder: () => void
}

function EmptyFolderPrompt({ level, folderType, onCreateFolder }: EmptyFolderPromptProps) {
  return (
    <div className="flex">
      {times(level + 1, (index) => (
        <div key={index} className="bg-muted-foreground/30 ml-4 w-0.5" />
      ))}
      <div className="text-muted-foreground flex flex-1 flex-col items-center space-y-4 p-4 select-none">
        <p className="text-center text-sm">
          Create a folder in this {folderType === EVMItemType.Collection ? 'collection' : 'folder'}.
        </p>
        <Button variant="secondary" size="sm" type="button" onClick={onCreateFolder}>
          Create Folder
        </Button>
      </div>
    </div>
  )
}

interface CollectionTreeItemProps {
  folder: EVMCollection | EVMFolder
  level?: number
  selectedLocationId?: string
  onSelectLocation: (id: string, name: string) => void
  openFolders: Set<string>
  onToggleOpen: (id: string) => void
  onCreateFolder: (parentId: string) => void
}

function CollectionTreeItem({
  folder,
  level = 0,
  selectedLocationId,
  onSelectLocation,
  openFolders,
  onToggleOpen,
  onCreateFolder,
}: CollectionTreeItemProps) {
  const handleClickFolder = () => {
    onToggleOpen(folder.id)
    onSelectLocation(folder.id, folder.name)
  }

  const isSelected = selectedLocationId === folder.id
  const isOpen = openFolders.has(folder.id)

  const filteredItems = folder.items.filter((item) => item.type !== EVMItemType.SmartContract)

  return (
    <div className="flex flex-col">
      <div className={cn('flex', isSelected ? 'bg-muted' : 'hover:bg-muted/60')}>
        {times(level, (index) => (
          <div key={index} className="bg-muted-foreground/30 ml-4 w-0.5" />
        ))}
        <div className="flex flex-1 truncate px-2">
          <div
            className="flex min-w-0 flex-1 cursor-pointer items-center justify-center gap-2"
            onClick={handleClickFolder}
          >
            {isSelected ? (
              <CheckCircleIcon className="text-primary size-4" />
            ) : isOpen ? (
              <FolderOpenIcon className="size-4" />
            ) : (
              <FolderIcon className="size-4" />
            )}
            <div className="flex flex-1 truncate select-none">
              <small className="truncate py-2 text-sm leading-none font-medium">{folder.name}</small>
            </div>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="flex flex-col">
          {filteredItems.length === 0 ? (
            <EmptyFolderPrompt
              level={level}
              folderType={folder.type}
              onCreateFolder={() => onCreateFolder(folder.id)}
            />
          ) : (
            filteredItems.map((item) => {
              if (item.type === EVMItemType.Folder || item.type === EVMItemType.Collection) {
                return (
                  <CollectionTreeItem
                    key={item.id}
                    folder={item as EVMCollection | EVMFolder}
                    level={level + 1}
                    selectedLocationId={selectedLocationId}
                    onSelectLocation={onSelectLocation}
                    openFolders={openFolders}
                    onToggleOpen={onToggleOpen}
                    onCreateFolder={onCreateFolder}
                  />
                )
              }
              return null
            })
          )}
        </div>
      )}
    </div>
  )
}

interface CollectionTreePickerProps {
  collections: EVMCollection[]
  selectedLocationId?: string
  onSelectLocation: (id: string) => void
  onCreateCollection: () => void
  onCreateFolder: (parentId: string) => void
}

export function CollectionTreePicker({
  collections,
  selectedLocationId,
  onSelectLocation,
  onCreateCollection,
  onCreateFolder,
}: CollectionTreePickerProps) {
  const [openFolders, setOpenFolders] = useState<Set<string>>(new Set())

  const handleToggleOpen = useCallback((id: string) => {
    setOpenFolders((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  const handleCreateFolder = useCallback(
    (parentId: string) => {
      onCreateFolder(parentId)
      setOpenFolders((prev) => new Set(prev).add(parentId))
    },
    [onCreateFolder],
  )

  return (
    <div className="h-96 overflow-y-auto rounded-md border">
      {collections.length === 0 ? (
        <div className="text-muted-foreground flex flex-1 flex-col items-center space-y-4 p-4 select-none">
          <p className="text-center text-sm">Create a collection for your smart contracts.</p>
          <Button variant="secondary" size="sm" type="button" onClick={onCreateCollection}>
            Create Collection
          </Button>
        </div>
      ) : (
        collections.map((collection) => (
          <CollectionTreeItem
            key={collection.id}
            folder={collection}
            selectedLocationId={selectedLocationId}
            onSelectLocation={(id) => onSelectLocation(id)}
            openFolders={openFolders}
            onToggleOpen={handleToggleOpen}
            onCreateFolder={handleCreateFolder}
          />
        ))
      )}
    </div>
  )
}
