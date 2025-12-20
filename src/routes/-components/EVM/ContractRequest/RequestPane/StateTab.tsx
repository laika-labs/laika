import { useEffect, useMemo } from 'react'
import { CornerDownRightIcon } from 'lucide-react'
import { toast } from 'sonner'
import type { Abi, Address } from 'viem'
import { useReadContracts } from 'wagmi'

import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { EVMABIMethod, EVMContract } from '@/store/collections'

export function StateTab({ smartContract }: { smartContract: EVMContract }) {
  const prefetchableMethods = useMemo(() => {
    const address = smartContract.contract?.address as Address
    const methods: EVMABIMethod[] = smartContract.contract?.abi && JSON.parse(smartContract.contract.abi)
    if (!address || !methods) {
      return []
    }
    const filteredMethods = methods.filter(
      (method) =>
        method.inputs?.length === 0 && (method.stateMutability === 'view' || method.stateMutability === 'pure'),
    )

    return filteredMethods.map((method) => {
      return {
        address,
        abi: filteredMethods as Abi,
        functionName: method.name,
        chainId: smartContract.chainId,
      }
    })
  }, [smartContract.chainId, smartContract.contract.abi, smartContract.contract?.address])

  const { data, isError, isLoading } = useReadContracts({
    contracts: prefetchableMethods,
  })

  useEffect(() => {
    if (isError) {
      toast.error('Error: Cannot fetch data.')
    }
  }, [isError])

  return (
    <div className="flex flex-col gap-2">
      {prefetchableMethods.map((method, idx) => {
        return (
          <Card key={method.functionName} size="sm">
            <CardHeader>
              <CardTitle className="text-muted-foreground font-mono">{method.functionName}</CardTitle>
            </CardHeader>
            <CardFooter className="border-foreground/10 gap-1 border-t">
              <CornerDownRightIcon className="text-muted-foreground size-3" />
              {isLoading ? <Skeleton className="h-4.75 w-full" /> : `${data?.[idx]?.result}`}
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
