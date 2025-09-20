import { LoaderIcon } from 'lucide-react'
import { Inspector } from 'react-inspector'
import { useWaitForTransactionReceipt } from 'wagmi'

import { useTheme } from '@/components/ThemeProvider'
import type { Response } from '@/store/responses'

export function WriteResponse({ response }: { response: Response }) {
  const { data, isLoading } = useWaitForTransactionReceipt({ hash: response.txHash })
  const { resolvedTheme } = useTheme()

  return (
    <div className="hover:bg-muted/60 rounded p-2">
      <span className="text-primary flex items-center">
        {isLoading && <LoaderIcon className="h-4 w-4 animate-spin" />}
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
