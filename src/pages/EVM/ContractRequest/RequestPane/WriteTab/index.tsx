import { EVMContract } from '@/store/collections'

import WriteMethod from './WriteMethod'

export default function WriteTab({ smartContract }: { smartContract: EVMContract }) {
  const getWriteableMethods = () => {
    const methods =
      smartContract && smartContract.contract && smartContract.contract.abi && JSON.parse(smartContract.contract.abi)
    if (!methods) {
      return []
    }
    const filteredMethods = methods.filter(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (method: any) =>
        method.stateMutability !== 'view' && method.stateMutability !== 'pure' && method.type === 'function',
    )
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const writeableMethods = filteredMethods.map((field: any) => {
      const address = smartContract.contract.address
      return {
        address,
        abi: filteredMethods,
        functionName: field.name,
      }
    })

    return writeableMethods
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="flex flex-col w-full gap-6">
        {getWriteableMethods().map(
          (field: { functionName: string; abi: { [x: string]: unknown } }, idx: string | number) => {
            return (
              <WriteMethod
                chainId={smartContract.chainId}
                contractAddress={smartContract.contract.address || ''}
                functionName={field.functionName}
                abi={field.abi[idx]}
              />
            )
          },
        )}
      </div>
    </div>
  )
}
