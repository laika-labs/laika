import { Allotment } from 'allotment'
import { ChangeEvent, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useEVMCollectionStore } from '@/store/collections'

import Folder from './Folder'
import Help from './Help'
import NewRequest from './NewRequest'

export default function Collections() {
  const [search, setSearch] = useState('')

  const { collections, addCollection } = useEVMCollectionStore()

  const appCollections = localStorage.getItem('app_collections')

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  const handleAddCollection = () => {
    addCollection()
  }

  return (
    <Allotment className="w-full h-full" vertical>
      <Allotment.Pane minSize={48} maxSize={48}>
        <div className="flex items-center justify-between p-2">
          <small className="text-sm font-medium leading-none">Collections</small>
          <div className="flex gap-2">
            {appCollections !== null && <Help appCollections={appCollections} />}
            <NewRequest />
          </div>
        </div>
      </Allotment.Pane>
      <Allotment.Pane minSize={36} maxSize={36} className="px-2">
        <Input
          type="text"
          placeholder="Search"
          className="p-0 border-none focus-visible:ring-0"
          onChange={handleSearch}
        />
      </Allotment.Pane>
      <Allotment.Pane className="py-1 !overflow-y-scroll">
        {collections.length > 0 ? (
          collections.map((collection) => {
            return <Folder key={collection.id} folder={collection} search={search} />
          })
        ) : (
          <div className="flex flex-col items-center px-2 py-12 space-y-4 select-none text-muted-foreground">
            <p className="text-sm text-center">Create a collection for your smart contracts.</p>
            <Button variant="secondary" size="sm" onClick={handleAddCollection}>
              Create Collection
            </Button>
          </div>
        )}
      </Allotment.Pane>
    </Allotment>
  )
}
