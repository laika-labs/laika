import { useCallback, useEffect } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useVariableManager, type Variable } from '@/hooks/useVariableManager'
import type { Environment } from '@/store/environments'

import { VariableTable } from './VariableTable'

interface GlobalEnvironmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  globalEnvironment: Environment
  onSave: (variables: Variable[]) => void
}

export function GlobalEnvironmentDialog({
  open,
  onOpenChange,
  globalEnvironment,
  onSave,
}: GlobalEnvironmentDialogProps) {
  const { variables, handleAdd, handleRemove, handleChange, reset } = useVariableManager()

  // Sync variables when dialog opens
  useEffect(() => {
    if (open) {
      reset(globalEnvironment.variables.map((v) => ({ key: v.key, value: v.value })))
    }
  }, [open, globalEnvironment.variables, reset])

  const handleClose = useCallback(() => {
    onOpenChange(false)
    reset([])
  }, [onOpenChange, reset])

  const handleSaveClick = useCallback(() => {
    onSave(variables)
    handleClose()
  }, [variables, onSave, handleClose])

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Global Environment</DialogTitle>
          <DialogDescription>
            Global variables are available in all environments and can be overridden by environment-specific variables.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <VariableTable
            label="Global Variables"
            variables={variables}
            onAdd={handleAdd}
            onRemove={handleRemove}
            onChange={handleChange}
            emptyMessage='No global variables. Click "Add" to add a variable.'
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSaveClick}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
