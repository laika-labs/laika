import { EVMContract } from '@/store/collections'

import ReadMethod from './ReadMethod'

export default function ReadTab({ smartContract }: { smartContract: EVMContract }) {
  const getReadableMethods = () => {
    const methods =
      smartContract && smartContract.contract && smartContract.contract.abi && JSON.parse(smartContract.contract.abi)
    if (!methods) {
      return []
    }
    const infoMethods = methods.filter(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (method: any) =>
        method.inputs.length > 0 && (method.stateMutability === 'view' || method.stateMutability === 'pure'),
    )
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const readableMethods = infoMethods.map((method: any) => {
      const address = smartContract.contract.address
      return {
        address,
        abi: infoMethods,
        functionName: method.name,
      }
    })

    return readableMethods
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="flex flex-col w-full gap-6">
        {getReadableMethods().map(
          (method: { functionName: string; abi: { [x: string]: unknown } }, idx: string | number) => {
            return (
              <ReadMethod
                chainId={smartContract.chainId}
                contractAddress={smartContract.contract.address || ''}
                functionName={method.functionName}
                abi={method.abi[idx]}
              />
            )
          },
        )}
      </div>
    </div>
  )
}
