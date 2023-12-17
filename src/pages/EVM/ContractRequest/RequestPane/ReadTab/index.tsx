import { useMemo } from 'react'
import { Address } from 'viem'

import { EVMABIMethod, EVMContract } from '@/store/collections'

import ReadMethod from './ReadMethod'

export default function ReadTab({ smartContract }: { smartContract: EVMContract }) {
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
    <div className="flex flex-col w-full gap-2">
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
