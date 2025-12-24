import { useEffect } from 'react'
import { Allotment } from 'allotment'
import { FileText } from 'lucide-react'

import { findItem } from '@/lib/collections'
import { cn } from '@/lib/utils'
import { useEVMCollectionStore } from '@/store/collections'
import { useEVMDocsStore } from '@/store/docs'

export function DocumentList() {
  const { collections } = useEVMCollectionStore()
  const { activeDocumentId, setActiveDocument } = useEVMDocsStore()

  const handleClick = (id: string) => {
    return () => {
      setActiveDocument(id)
    }
  }

  useEffect(() => {
    if (
      (activeDocumentId === null && collections.length > 0) ||
      (activeDocumentId !== null && collections.length > 0 && findItem(collections, activeDocumentId) === undefined)
    ) {
      setActiveDocument(collections[0].id)
    }
  }, [activeDocumentId, collections, setActiveDocument])

  return (
    <Allotment className="h-full w-full" vertical>
      <Allotment.Pane minSize={40} maxSize={40} className="flex items-center p-2">
        <small className="text-sm leading-none font-medium">Documentation</small>
      </Allotment.Pane>
      <Allotment.Pane className="py-1">
        {collections.length > 0 &&
          collections.map((collection) => {
            return (
              <div
                className={cn(
                  'flex min-w-0 cursor-pointer items-center justify-center gap-2 truncate px-2',
                  activeDocumentId === collection.id ? 'bg-muted' : 'hover:bg-muted/60',
                )}
                onClick={handleClick(collection.id)}
              >
                <FileText className="size-3.5" />
                <div className="flex flex-1 truncate select-none">
                  <small className="truncate py-2 text-sm leading-none font-medium">{collection.name}</small>
                </div>
              </div>
            )
          })}
      </Allotment.Pane>
    </Allotment>
  )
}
