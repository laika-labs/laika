import { useCallback, useState } from 'react'

export interface Variable {
  key: string
  value: string
}

export interface UseVariableManagerResult {
  variables: Variable[]
  setVariables: React.Dispatch<React.SetStateAction<Variable[]>>
  handleAdd: () => void
  handleRemove: (index: number) => void
  handleChange: (index: number, field: 'key' | 'value', value: string) => void
  reset: (initialVariables?: Variable[]) => void
}

export function useVariableManager(initialVariables: Variable[] = []): UseVariableManagerResult {
  const [variables, setVariables] = useState<Variable[]>(initialVariables)

  const handleAdd = useCallback(() => {
    setVariables((prev) => [...prev, { key: '', value: '' }])
  }, [])

  const handleRemove = useCallback((index: number) => {
    setVariables((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const handleChange = useCallback((index: number, field: 'key' | 'value', value: string) => {
    setVariables((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })
  }, [])

  const reset = useCallback((newVariables: Variable[] = []) => {
    setVariables(newVariables)
  }, [])

  return {
    variables,
    setVariables,
    handleAdd,
    handleRemove,
    handleChange,
    reset,
  }
}
