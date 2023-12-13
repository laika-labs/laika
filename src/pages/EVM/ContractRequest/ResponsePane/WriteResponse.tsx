import { Response } from '@/store/responses'
import { useTransaction, serialize } from 'wagmi'

export default function ReadResponse({ response }: { response: Response }) {
  const { data } = useTransaction({ hash: response.txHash })

  return (
    <div className="hover:bg-muted/60 p-2 rounded">
      <p className="text-primary">
        TRANSACTED TO {response.functionName} at [ChainID={response.chainId} {response.address}]
      </p>
      <details className="whitespace-pre">
        <summary className="underline">tx: {response.txHash}</summary>
        {data && JSON.stringify(JSON.parse(serialize(data)), null, 2)}
      </details>
    </div>
  )
}
