import { Allotment } from 'allotment'
import { UUID } from 'crypto'
import { FileText } from 'lucide-react'
import { useEffect } from 'react'

import { cn } from '@/lib/utils'
import { useEVMCollectionStore } from '@/store/collections'
import { useEVMDocsStore } from '@/store/docs'
import { findItem } from '@/utils/collections'

export default function DocumentList() {
  const { collections } = useEVMCollectionStore()
  const { activeDocumentId, setActiveDocument } = useEVMDocsStore()

  const handleClick = (id: UUID) => {
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
    <Allotment className="w-full h-full" vertical>
      <Allotment.Pane minSize={48} maxSize={48} className="flex items-center p-2">
        <small className="text-sm font-medium leading-none">Documentation</small>
      </Allotment.Pane>
      <Allotment.Pane className="py-1">
        {collections.length > 0 &&
          collections.map((collection) => {
            return (
              <div
                className={cn(
                  'flex items-center justify-center min-w-0 gap-2 px-2 truncate cursor-pointer',
                  activeDocumentId === collection.id ? 'bg-muted' : 'hover:bg-muted/60',
                )}
                onClick={handleClick(collection.id)}
              >
                <FileText className="w-4 h-4" />
                <div className="flex flex-1 truncate select-none">
                  <small className="py-2 text-sm font-medium leading-none truncate">{collection.name}</small>
                </div>
              </div>
            )
          })}
      </Allotment.Pane>
    </Allotment>
  )
}
