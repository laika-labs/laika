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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useVariableManager, type Variable } from '@/hooks/useVariableManager'
import type { Environment } from '@/store/environments'

import { VariableTable } from './VariableTable'

interface EnvironmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  environment: Environment | null
  environmentName: string
  onEnvironmentNameChange: (name: string) => void
  onSave: (variables: Variable[]) => void
}

export function EnvironmentDialog({
  open,
  onOpenChange,
  environment,
  environmentName,
  onEnvironmentNameChange,
  onSave,
}: EnvironmentDialogProps) {
  const { variables, handleAdd, handleRemove, handleChange, reset } = useVariableManager()

  // Sync variables when dialog opens or environment changes
  useEffect(() => {
    if (open && environment) {
      reset(environment.variables.map((v) => ({ key: v.key, value: v.value })))
    } else if (open && !environment) {
      reset([])
    }
  }, [open, environment, reset])

  const handleClose = useCallback(() => {
    onOpenChange(false)
    reset([])
  }, [onOpenChange, reset])

  const handleSaveClick = useCallback(() => {
    if (!environmentName.trim()) {
      return
    }
    onSave(variables)
    handleClose()
  }, [environmentName, variables, onSave, handleClose])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && environmentName.trim()) {
        handleSaveClick()
      }
    },
    [environmentName, handleSaveClick],
  )

  const isEditing = environment !== null

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Environment' : 'Create Environment'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update the name of this environment.'
              : 'Create a new environment to organize your variables.'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="environment-name">Name</Label>
            <Input
              id="environment-name"
              value={environmentName}
              onChange={(e) => onEnvironmentNameChange(e.target.value)}
              placeholder="Environment name"
              onKeyDown={handleKeyDown}
              autoFocus
            />
          </div>
          <VariableTable
            label="Variables"
            variables={variables}
            onAdd={handleAdd}
            onRemove={handleRemove}
            onChange={handleChange}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSaveClick} disabled={!environmentName.trim()}>
            {isEditing ? 'Save' : 'Create'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
