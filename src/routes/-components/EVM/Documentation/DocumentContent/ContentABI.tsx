import type { EVMABIMethod } from '@/store/collections'

import { FunctionContent } from './FunctionContent'

interface ABIProps {
  contractId: string
  title: string
  abi: EVMABIMethod[]
}

export function ContentABI({ title, abi, contractId }: ABIProps) {
  return (
    <>
      <h4 className="mt-6 scroll-m-20 text-xl font-semibold tracking-tight first:mt-0 hover:underline">{title}</h4>
      {abi.map((event) => {
        return <FunctionContent key={`${event}`} abi={abi} method={event} contractId={contractId} />
      })}
    </>
  )
}
