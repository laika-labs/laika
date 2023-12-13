import { Response } from '@/store/responses'

export default function ReadResponse({ response }: { response: Response }) {
  return (
    <div className="hover:bg-muted/60 p-2 rounded">
      <p className="text-primary">
        CALLED TO {response.functionName} at [ChainID={response.chainId} {response.address}]
      </p>
      <pre className="whitespace-pre">{response.result}</pre>
    </div>
  )
}
