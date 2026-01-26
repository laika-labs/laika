import { useMemo } from 'react'
import { isAddress, type Address } from 'viem'

import { substituteVariables, VARIABLE_PATTERN } from '@/lib/environment'
import { useEnvironmentStore } from '@/store/environments'

interface UseSubstitutedAddressResult {
  substitutedAddress: Address | undefined
  substitutedAddressRaw: string
  isValid: boolean
  hasUnresolvedVariables: boolean
}

/**
 * Hook to substitute environment variables in an address and validate it
 * @param address - The address string that may contain {{variableName}} syntax
 * @returns Object with substituted address, validation status, and error flags
 */
export function useSubstitutedAddress(address: string | undefined | null): UseSubstitutedAddressResult {
  const activeEnvironmentId = useEnvironmentStore((state) => state.activeEnvironmentId)
  const environments = useEnvironmentStore((state) => state.environments)
  const globalEnvironment = useEnvironmentStore((state) => state.globalEnvironment)

  const substitutedAddressRaw = useMemo(() => {
    if (!address) return ''

    const getVariableValue = (key: string): string | null => {
      if (activeEnvironmentId) {
        const activeEnvironment = environments.find((env) => env.id === activeEnvironmentId)
        if (activeEnvironment) {
          const variable = activeEnvironment.variables.find((v) => v.key === key)
          if (variable) return variable.value
        }
      }

      const globalVariable = globalEnvironment.variables.find((v) => v.key === key)
      if (globalVariable) return globalVariable.value

      return null
    }

    return substituteVariables(address, getVariableValue)
  }, [address, activeEnvironmentId, environments, globalEnvironment])

  const substitutedAddress = useMemo(() => {
    if (!substitutedAddressRaw || !isAddress(substitutedAddressRaw)) {
      return undefined
    }
    return substitutedAddressRaw as Address
  }, [substitutedAddressRaw])

  const isValid = useMemo(() => substitutedAddress !== undefined, [substitutedAddress])

  const hasUnresolvedVariables = useMemo(() => {
    VARIABLE_PATTERN.lastIndex = 0
    return VARIABLE_PATTERN.test(substitutedAddressRaw)
  }, [substitutedAddressRaw])

  return {
    substitutedAddress,
    substitutedAddressRaw,
    isValid,
    hasUnresolvedVariables,
  }
}
