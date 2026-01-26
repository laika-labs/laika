import { useCallback, useMemo, useState } from 'react'
import { ChevronsUpDownIcon, EditIcon, GlobeIcon, PlusIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Variable } from '@/hooks/useVariableManager'
import { useEnvironmentStore } from '@/store/environments'

import { DeleteEnvironmentDialog } from './DeleteEnvironmentDialog'
import { EnvironmentDialog } from './EnvironmentDialog'
import { EnvironmentItem } from './EnvironmentItem'
import { GlobalEnvironmentDialog } from './GlobalEnvironmentDialog'

export function EnvironmentDropdown() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isGlobalDialogOpen, setIsGlobalDialogOpen] = useState(false)
  const [editingEnvironmentId, setEditingEnvironmentId] = useState<string | null>(null)
  const [environmentName, setEnvironmentName] = useState('')
  const [deleteEnvironmentId, setDeleteEnvironmentId] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const {
    environments,
    globalEnvironment,
    activeEnvironmentId,
    setActiveEnvironment,
    getActiveEnvironment,
    addEnvironment,
    renameEnvironment,
    removeEnvironment,
    addVariable,
    removeVariable,
    addGlobalVariable,
    removeGlobalVariable,
  } = useEnvironmentStore()

  const activeEnvironment = getActiveEnvironment()
  const editingEnvironment = useMemo(
    () => (editingEnvironmentId ? (environments.find((env) => env.id === editingEnvironmentId) ?? null) : null),
    [editingEnvironmentId, environments],
  )

  const displayName = useMemo(
    () => (activeEnvironment ? activeEnvironment.name : 'No Environment'),
    [activeEnvironment],
  )

  const deleteEnvironmentName = useMemo(
    () => environments.find((env) => env.id === deleteEnvironmentId)?.name,
    [environments, deleteEnvironmentId],
  )

  // Dropdown handlers
  const handleEnvironmentSelect = useCallback(
    (id: string) => {
      setActiveEnvironment(id === 'none' ? null : id)
    },
    [setActiveEnvironment],
  )

  const handleCreateEnvironment = useCallback(() => {
    setEditingEnvironmentId(null)
    setEnvironmentName('')
    setIsDialogOpen(true)
  }, [])

  const handleEditEnvironment = useCallback(
    (id: string) => {
      const environment = environments.find((env) => env.id === id)
      if (environment) {
        setEditingEnvironmentId(id)
        setEnvironmentName(environment.name)
        setIsDialogOpen(true)
      }
    },
    [environments],
  )

  const handleEditGlobal = useCallback(() => {
    setIsGlobalDialogOpen(true)
  }, [])

  // Environment dialog handlers
  const handleDialogClose = useCallback((open: boolean) => {
    if (!open) {
      setIsDialogOpen(false)
      setEditingEnvironmentId(null)
      setEnvironmentName('')
    }
  }, [])

  const handleSaveEnvironment = useCallback(
    (variables: Variable[]) => {
      if (!environmentName.trim()) {
        return
      }

      if (editingEnvironmentId) {
        const environment = environments.find((env) => env.id === editingEnvironmentId)
        renameEnvironment(editingEnvironmentId, environmentName.trim())
        // Remove existing variables and add new ones
        if (environment) {
          environment.variables.forEach((variable) => {
            removeVariable(editingEnvironmentId, variable.id)
          })
        }
        // Add new variables
        variables.forEach((variable) => {
          if (variable.key.trim() && variable.value.trim()) {
            addVariable(editingEnvironmentId, variable.key.trim(), variable.value.trim())
          }
        })
      } else {
        const newId = addEnvironment(environmentName.trim())
        setActiveEnvironment(newId)
        // Add variables to the newly created environment
        variables.forEach((variable) => {
          if (variable.key.trim() && variable.value.trim()) {
            addVariable(newId, variable.key.trim(), variable.value.trim())
          }
        })
      }

      setEditingEnvironmentId(null)
      setEnvironmentName('')
    },
    [
      environmentName,
      editingEnvironmentId,
      environments,
      addEnvironment,
      renameEnvironment,
      setActiveEnvironment,
      addVariable,
      removeVariable,
    ],
  )

  // Global environment dialog handlers
  const handleGlobalDialogClose = useCallback((open: boolean) => {
    if (!open) {
      setIsGlobalDialogOpen(false)
    }
  }, [])

  const handleSaveGlobalEnvironment = useCallback(
    (variables: Variable[]) => {
      // Remove all existing global variables
      globalEnvironment.variables.forEach((variable) => {
        removeGlobalVariable(variable.id)
      })
      // Add new global variables
      variables.forEach((variable) => {
        if (variable.key.trim() && variable.value.trim()) {
          addGlobalVariable(variable.key.trim(), variable.value.trim())
        }
      })
    },
    [globalEnvironment.variables, addGlobalVariable, removeGlobalVariable],
  )

  // Delete dialog handlers
  const handleDeleteClick = useCallback((id: string) => {
    setDeleteEnvironmentId(id)
    setIsDeleteDialogOpen(true)
  }, [])

  const handleDeleteConfirm = useCallback(() => {
    if (deleteEnvironmentId) {
      removeEnvironment(deleteEnvironmentId)
      setIsDeleteDialogOpen(false)
      setDeleteEnvironmentId(null)
    }
  }, [deleteEnvironmentId, removeEnvironment])

  const handleDeleteCancel = useCallback(() => {
    setIsDeleteDialogOpen(false)
    setDeleteEnvironmentId(null)
  }, [])

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="outline" size="sm" className="gap-2">
              <span className="text-xs">{displayName}</span>
              <ChevronsUpDownIcon className="h-3 w-3 opacity-50" />
            </Button>
          }
        />
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Global</DropdownMenuLabel>
            <DropdownMenuItem onClick={handleEditGlobal}>
              <GlobeIcon />
              <div className="flex flex-1 items-center justify-between">
                <span>Global</span>
                <EditIcon className="h-3.5 w-3.5 opacity-50" />
              </div>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuLabel>Environments</DropdownMenuLabel>
            {environments.map((env) => (
              <EnvironmentItem
                key={env.id}
                environment={env}
                onEdit={handleEditEnvironment}
                onDelete={handleDeleteClick}
                onSelect={handleEnvironmentSelect}
                isActive={activeEnvironmentId === env.id}
              />
            ))}
            <DropdownMenuItem onClick={() => handleEnvironmentSelect('none')}>No Environment</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={handleCreateEnvironment}>
              <PlusIcon />
              Create Environment
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <EnvironmentDialog
        open={isDialogOpen}
        onOpenChange={handleDialogClose}
        environment={editingEnvironment}
        environmentName={environmentName}
        onEnvironmentNameChange={setEnvironmentName}
        onSave={handleSaveEnvironment}
      />

      <GlobalEnvironmentDialog
        open={isGlobalDialogOpen}
        onOpenChange={handleGlobalDialogClose}
        globalEnvironment={globalEnvironment}
        onSave={handleSaveGlobalEnvironment}
      />

      <DeleteEnvironmentDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        environmentName={deleteEnvironmentName}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </>
  )
}
