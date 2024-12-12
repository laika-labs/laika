import { Response } from '@/store/responses'

export default function ReadResponse({ response }: { response: Response }) {
  return (
    <div className="p-2 rounded hover:bg-muted/60">
      <p className="text-primary">
        CALLED TO {response.functionName} at [ChainID={response.chainId} {response.address}]
      </p>
      <pre className="whitespace-pre">{response.result}</pre>
      {
        response.error && (
          <pre className="whitespace-pre">{response.error.message}</pre>
        )
      }
    </div>
  )
}
