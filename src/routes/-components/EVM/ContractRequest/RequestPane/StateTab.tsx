import { useEffect, useMemo, useRef } from 'react'
import { CornerDownRightIcon } from 'lucide-react'
import { toast } from 'sonner'
import type { Abi } from 'viem'
import { useReadContracts } from 'wagmi'

import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useSubstitutedAddress } from '@/hooks/useSubstitutedAddress'
import type { EVMABIMethod, EVMContract } from '@/store/collections'

export function StateTab({ smartContract }: { smartContract: EVMContract }) {
  const addressRaw = smartContract.contract?.address
  const { substitutedAddress, isValid } = useSubstitutedAddress(addressRaw)

  const prefetchableMethods = useMemo(() => {
    if (!smartContract.contract?.abi) {
      return []
    }

    let methods: EVMABIMethod[]
    try {
      methods = JSON.parse(smartContract.contract.abi)
    } catch {
      return []
    }

    if (!isValid || !substitutedAddress || !methods) {
      return []
    }

    const filteredMethods = methods.filter(
      (method) =>
        method.inputs?.length === 0 && (method.stateMutability === 'view' || method.stateMutability === 'pure'),
    )

    return filteredMethods.map((method) => ({
      address: substitutedAddress,
      abi: [method] as Abi,
      functionName: method.name,
      chainId: smartContract.chainId,
    }))
  }, [smartContract.chainId, smartContract.contract?.abi, isValid, substitutedAddress])

  const { data, isError, isLoading, refetch } = useReadContracts({
    contracts: prefetchableMethods,
  })

  const prevRpcUrlRef = useRef<string | undefined>(smartContract.rpcUrl)
  const prevChainIdRef = useRef<number | undefined>(smartContract.chainId)
  const prevAddressRef = useRef<string | undefined>(substitutedAddress)

  useEffect(() => {
    if (isError) {
      toast.error('Error: Cannot fetch data.')
    }
  }, [isError])

  useEffect(() => {
    const rpcUrlChanged = prevRpcUrlRef.current !== smartContract.rpcUrl
    const chainIdChanged = prevChainIdRef.current !== smartContract.chainId
    const addressChanged = prevAddressRef.current !== substitutedAddress

    if ((rpcUrlChanged || chainIdChanged || addressChanged) && prefetchableMethods.length > 0) {
      refetch()
    }

    prevRpcUrlRef.current = smartContract.rpcUrl
    prevChainIdRef.current = smartContract.chainId
    prevAddressRef.current = substitutedAddress
  }, [smartContract.rpcUrl, smartContract.chainId, substitutedAddress, prefetchableMethods.length, refetch])

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
