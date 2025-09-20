import type { Response } from '@/store/responses'

export function ReadResponse({ response }: { response: Response }) {
  return (
    <div className="hover:bg-muted/60 rounded p-2">
      <p className="text-primary">
        CALLED TO {response.functionName} at [ChainID={response.chainId} {response.address}]
      </p>
      <pre className="whitespace-pre">{response.result}</pre>
    </div>
  )
}
