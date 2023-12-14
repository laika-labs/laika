import { EVMABIMethod, EVMContract } from '@/store/collections'

import WriteMethod from './WriteMethod'

export default function WriteTab({ smartContract }: { smartContract: EVMContract }) {
  const getWriteableMethods = () => {
    const methods =
      smartContract && smartContract.contract && smartContract.contract.abi && JSON.parse(smartContract.contract.abi)
    if (!methods) {
      return []
    }
    const filteredMethods = methods.filter(
      (method: EVMABIMethod) =>
        method.stateMutability !== 'view' && method.stateMutability !== 'pure' && method.type === 'function',
    )
    const writeableMethods = filteredMethods.map((method: EVMABIMethod) => {
      const address = smartContract.contract.address
      return {
        address,
        abi: filteredMethods,
        functionName: method.name,
      }
    })

    return writeableMethods
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="flex flex-col w-full gap-6">
        {getWriteableMethods().length === 0 && (
          <div className="text-center underline my-2">
            <p>No writable methods found for this contract.</p>
            <p>Please use another tab to interact with the contract.</p>
          </div>
        )}
        {getWriteableMethods().map((method: { functionName: string; abi: EVMABIMethod[] }, idx: number) => {
          return (
            <WriteMethod
              key={method.functionName}
              chainId={smartContract.chainId}
              contractAddress={smartContract.contract.address || ''}
              functionName={method.functionName}
              abi={method.abi[idx]}
            />
          )
        })}
      </div>
    </div>
  )
}
