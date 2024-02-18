import { EVMABIMethod } from '@/store/collections'
import FunctionContent from './FunctionContent'

interface ABIProps {
  contractId: string
  title: string
  abi: EVMABIMethod[]
}

export default function ContentABI({ title, abi, contractId }: ABIProps) {
  return (
    <>
      <h4 className="mt-6 text-xl font-semibold tracking-tight scroll-m-20 first:mt-0 hover:underline">{title}</h4>
      {abi.map((event) => {
        return <FunctionContent key={`${event}`} abi={abi} method={event} contractId={contractId} />
      })}
    </>
  )
}
