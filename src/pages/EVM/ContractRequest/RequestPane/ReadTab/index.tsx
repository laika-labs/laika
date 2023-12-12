import { EVMContract } from '@/store/collections'

import ReadMethod from './ReadMethod'

export default function ReadTab({ smartContract }: { smartContract: EVMContract }) {
  const getReadableFields = () => {
    const fields =
      smartContract && smartContract.contract && smartContract.contract.abi && JSON.parse(smartContract.contract.abi)
    if (!fields) {
      return []
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const infoFields = fields.filter((field: any) => field.inputs.length > 0 && field.stateMutability === 'view')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const readableFields = infoFields.map((field: any) => {
      const address = smartContract.contract.address
      return {
        address,
        abi: infoFields,
        functionName: field.name,
      }
    })

    return readableFields
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="flex flex-col w-full gap-6">
        {getReadableFields().map(
          (field: { functionName: string; abi: { [x: string]: unknown } }, idx: string | number) => {
            return (
              <ReadMethod
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
