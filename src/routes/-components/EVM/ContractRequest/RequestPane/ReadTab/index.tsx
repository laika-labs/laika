import { useMemo } from 'react'
import type { Address } from 'viem'

import { Card, CardContent } from '@/components/ui/card'
import type { EVMABIMethod, EVMContract } from '@/store/collections'

import { ReadMethod } from './ReadMethod'

export function ReadTab({ smartContract }: { smartContract: EVMContract }) {
  const readableMethods = useMemo(() => {
    const address = smartContract.contract?.address as Address
    const methods: EVMABIMethod[] = smartContract.contract?.abi && JSON.parse(smartContract.contract.abi)
    if (!address || !methods) {
      return []
    }
    const infoMethods = methods.filter(
      (method) => method.inputs?.length > 0 && (method.stateMutability === 'view' || method.stateMutability === 'pure'),
    )

    return infoMethods.map((method) => {
      return {
        address,
        abi: infoMethods,
        functionName: method.name,
      }
    })
  }, [smartContract.contract.abi, smartContract.contract.address])

  return (
    <div className="flex w-full flex-col gap-2">
      {readableMethods.length === 0 && (
        <Card size="sm">
          <CardContent className="my-2 text-center">
            <p>No readable methods found for this contract.</p>
            <p>Please use another tab to interact with the contract.</p>
          </CardContent>
        </Card>
      )}
      {readableMethods.map((method, idx) => {
        return (
          <ReadMethod
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
