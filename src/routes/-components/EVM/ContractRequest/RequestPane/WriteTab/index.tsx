import { useMemo } from 'react'
import type { Address } from 'viem'

import { Card, CardContent } from '@/components/ui/card'
import type { EVMABIMethod, EVMContract } from '@/store/collections'

import { WriteMethod } from './WriteMethod'

export function WriteTab({ smartContract }: { smartContract: EVMContract }) {
  const writeableMethods = useMemo(() => {
    const address = smartContract.contract?.address as Address
    const methods: EVMABIMethod[] = smartContract.contract?.abi && JSON.parse(smartContract.contract.abi)
    if (!address || !methods) {
      return []
    }
    const filteredMethods = methods.filter(
      (method) => method.stateMutability !== 'view' && method.stateMutability !== 'pure' && method.type === 'function',
    )

    return filteredMethods.map((method) => {
      return {
        address,
        abi: filteredMethods,
        functionName: method.name,
      }
    })
  }, [smartContract.contract.abi, smartContract.contract.address])

  return (
    <div className="flex w-full flex-col gap-2">
      {writeableMethods.length === 0 && (
        <Card size="sm">
          <CardContent className="my-2 text-center">
            <p>No writable methods found for this contract.</p>
            <p>Please use another tab to interact with the contract.</p>
          </CardContent>
        </Card>
      )}
      {writeableMethods.map((method, idx) => {
        return (
          <WriteMethod
            key={method.functionName}
            chainId={smartContract.chainId}
            contractAddress={method.address}
            functionName={method.functionName}
            abi={method.abi[idx]}
          />
        )
      })}
    </div>
  )
}
