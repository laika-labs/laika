import { ChangeEvent, KeyboardEvent, useCallback, useState } from 'react'

import { Input } from '@/components/ui/input'
import { useEVMCollectionStore } from '@/store/collections'

interface RenameProps {
  id: string
  itemName: string
  onSave: () => void
}

export default function Rename({ id, itemName, onSave }: RenameProps) {
  const [name, setName] = useState(itemName)

  const { renameItem } = useEVMCollectionStore()

  const callbackRef = useCallback((inputElement: HTMLInputElement) => {
    if (inputElement) {
      inputElement.focus()
    }
  }, [])

  const handleSave = () => {
    if (name) {
      renameItem(id, name)
    } else {
      setName(itemName)
    }
    onSave()
  }

  const handlePressEnterOrEscape = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === 'Escape') {
      handleSave()
    }
  }

  const handleChangeName = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
  }

  return (
    <Input
      ref={callbackRef}
      type="text"
      placeholder="Collection name"
      value={name}
      className="h-auto px-2 py-1 text-sm font-medium leading-none focus-visible:ring-0"
      onChange={handleChangeName}
      onKeyDown={handlePressEnterOrEscape}
      onBlur={handleSave}
    />
  )
}
