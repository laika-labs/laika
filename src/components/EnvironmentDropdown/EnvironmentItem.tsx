import { useCallback } from 'react'
import { CheckIcon, EditIcon, TrashIcon } from 'lucide-react'

import {
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu'
import type { Environment } from '@/store/environments'

interface EnvironmentItemProps {
  environment: Environment
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onSelect: (id: string) => void
  isActive: boolean
}

export function EnvironmentItem({ environment, onEdit, onDelete, onSelect, isActive }: EnvironmentItemProps) {
  const handleSelect = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      onSelect(environment.id)
    },
    [environment.id, onSelect],
  )

  const handleEditClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      onEdit(environment.id)
    },
    [environment.id, onEdit],
  )

  const handleDeleteClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      onDelete(environment.id)
    },
    [environment.id, onDelete],
  )

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>{environment.name}</DropdownMenuSubTrigger>
      <DropdownMenuSubContent>
        <DropdownMenuItem onClick={handleSelect} disabled={isActive}>
          <CheckIcon />
          Select
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleEditClick}>
          <EditIcon />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDeleteClick} variant="destructive">
          <TrashIcon />
          Delete
        </DropdownMenuItem>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  )
}
