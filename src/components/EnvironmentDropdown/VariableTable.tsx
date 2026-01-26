import { PlusIcon, TrashIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { Variable } from '@/hooks/useVariableManager'

interface VariableTableProps {
  label: string
  variables: Variable[]
  onAdd: () => void
  onRemove: (index: number) => void
  onChange: (index: number, field: 'key' | 'value', value: string) => void
  emptyMessage?: string
}

export function VariableTable({
  label,
  variables,
  onAdd,
  onRemove,
  onChange,
  emptyMessage = 'No variables. Click "Add" to add a variable.',
}: VariableTableProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <Button type="button" variant="outline" size="sm" onClick={onAdd}>
          <PlusIcon className="h-3.5 w-3.5" />
          Add
        </Button>
      </div>
      {variables.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">Key</TableHead>
                <TableHead className="w-[50%]">Value</TableHead>
                <TableHead className="w-[10%]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {variables.map((variable, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Input
                      value={variable.key}
                      onChange={(e) => onChange(index, 'key', e.target.value)}
                      placeholder="Variable key"
                      className="h-7"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={variable.value}
                      onChange={(e) => onChange(index, 'value', e.target.value)}
                      placeholder="Variable value"
                      className="h-7"
                    />
                  </TableCell>
                  <TableCell>
                    <Button type="button" variant="ghost" size="icon-sm" onClick={() => onRemove(index)}>
                      <TrashIcon className="h-3.5 w-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-muted-foreground rounded-md border py-4 text-center text-xs">{emptyMessage}</div>
      )}
    </div>
  )
}
