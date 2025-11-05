import { useState } from 'react'
import { Allotment } from 'allotment'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useEVMCollectionStore } from '@/store/collections'

import { Folder } from './Folder'
import { NewRequest } from './NewRequest'

export function Collections() {
  const [search, setSearch] = useState('')

  const { collections, addCollection } = useEVMCollectionStore()

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  const handleAddCollection = () => {
    addCollection()
  }

  return (
    <Allotment className="h-full w-full" vertical>
      <Allotment.Pane minSize={48} maxSize={48}>
        <div className="flex items-center justify-between p-2">
          <small className="text-sm leading-none font-medium">Collections</small>
          <NewRequest />
        </div>
      </Allotment.Pane>
      <Allotment.Pane minSize={36} maxSize={36} className="px-2">
        <Input
          type="text"
          placeholder="Search"
          className="border-none p-0 focus-visible:ring-0 dark:bg-transparent"
          onChange={handleSearch}
        />
      </Allotment.Pane>
      <Allotment.Pane className="py-1">
        <div className="h-full overflow-y-auto">
          {collections.length > 0 ? (
            collections.map((collection) => {
              return <Folder key={collection.id} folder={collection} search={search} />
            })
          ) : (
            <div className="text-muted-foreground flex flex-col items-center space-y-4 px-2 py-12 select-none">
              <p className="text-center text-sm">Create a collection for your smart contracts.</p>
              <Button variant="secondary" size="sm" onClick={handleAddCollection}>
                Create Collection
              </Button>
            </div>
          )}
        </div>
      </Allotment.Pane>
    </Allotment>
  )
}
