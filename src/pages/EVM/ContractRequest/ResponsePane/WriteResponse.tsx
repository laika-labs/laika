import { useWaitForTransaction } from 'wagmi'
import { Inspector } from 'react-inspector'

import { useTheme } from '@/components/ThemeProvider'

import { Response } from '@/store/responses'
import { Loader } from 'lucide-react'

export default function ReadResponse({ response }: { response: Response }) {
  const { data, isLoading } = useWaitForTransaction({ hash: response.txHash })
  const { resolvedTheme } = useTheme()

  return (
    <div className="hover:bg-muted/60 p-2 rounded">
      <span className="text-primary flex items-center">
        {isLoading && <Loader className="h-4 w-4 animate-spin" />}
        TRANSACTED TO {response.functionName} at [ChainID={response.chainId} {response.address}]
      </span>
      <p className="underline">tx: {response.txHash}</p>
      {!isLoading && data && (
        <Inspector
          table={false}
          data={data}
          expandLevel={1}
          theme={resolvedTheme === 'light' ? 'chromeLight' : 'chromeDark'}
        />
      )}
    </div>
  )
}
