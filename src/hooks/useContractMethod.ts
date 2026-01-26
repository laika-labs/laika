import { useCallback, useMemo, useState } from 'react'
import { toast } from 'sonner'

import { useSubstitutedAddress } from '@/hooks/useSubstitutedAddress'
import { substituteVariables } from '@/lib/environment'
import type { EVMABIMethod } from '@/store/collections'
import { useEnvironmentStore } from '@/store/environments'

export interface UseContractMethodProps {
  abi: EVMABIMethod
  contractAddress: string
}

export interface UseContractMethodResult {
  args: string[]
  substitutedArgs: string[]
  substitutedAddress: `0x${string}` | undefined
  isValid: boolean
  handleInputChange: (idx: number) => (event: React.ChangeEvent<HTMLInputElement>) => void
  validateAndExecute: (onExecute: () => void) => void
}

export function useContractMethod({ abi, contractAddress }: UseContractMethodProps): UseContractMethodResult {
  const [args, setArgs] = useState<string[]>(new Array(abi.inputs.length).fill(''))
  const { getVariableValue } = useEnvironmentStore()

  const { substitutedAddress, substitutedAddressRaw, isValid, hasUnresolvedVariables } =
    useSubstitutedAddress(contractAddress)

  const substitutedArgs = useMemo(
    () => args.map((arg) => substituteVariables(arg, getVariableValue)),
    [args, getVariableValue],
  )

  const handleInputChange = useCallback(
    (idx: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setArgs((prev) => {
        const newArgs = [...prev]
        newArgs[idx] = event.target.value
        return newArgs
      })
    },
    [],
  )

  const validateAndExecute = useCallback(
    (onExecute: () => void) => {
      if (!isValid) {
        if (hasUnresolvedVariables) {
          toast.error(`Environment variable not resolved in address: ${substitutedAddressRaw}`)
        } else {
          toast.error(`Invalid contract address: ${substitutedAddressRaw}`)
        }
        return
      }
      onExecute()
    },
    [isValid, hasUnresolvedVariables, substitutedAddressRaw],
  )

  return {
    args,
    substitutedArgs,
    substitutedAddress,
    isValid,
    handleInputChange,
    validateAndExecute,
  }
}
