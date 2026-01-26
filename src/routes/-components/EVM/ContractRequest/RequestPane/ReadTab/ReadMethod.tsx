import { useCallback, useEffect } from 'react'
import { RotateCwIcon, ScanSearchIcon } from 'lucide-react'
import type { Address } from 'viem'
import { mainnet } from 'viem/chains'
import { useReadContract } from 'wagmi'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useContractMethod } from '@/hooks/useContractMethod'
import type { EVMABIMethod } from '@/store/collections'
import { useResponseStore } from '@/store/responses'

import { MethodInputs } from '../MethodInputs'

export function ReadMethod({
  chainId,
  functionName,
  abi,
  contractAddress,
}: {
  chainId?: number
  functionName: string
  abi: EVMABIMethod
  contractAddress: string | Address
}) {
  const { pushResponse } = useResponseStore()
  const { args, substitutedArgs, substitutedAddress, handleInputChange, validateAndExecute } = useContractMethod({
    abi,
    contractAddress,
  })

  const defaultAddress = '0x0000000000000000000000000000000000000000' as Address
  const effectiveChainId = chainId ?? mainnet.id

  const { data, error, isRefetching, isFetchedAfterMount, refetch } = useReadContract({
    address: substitutedAddress || defaultAddress,
    abi: [abi],
    functionName,
    args: substitutedArgs,
    chainId: effectiveChainId,
    query: {
      enabled: false,
    },
  })

  const handleReadClick = useCallback(() => {
    validateAndExecute(() => refetch())
  }, [validateAndExecute, refetch])

  useEffect(() => {
    if (isFetchedAfterMount && !isRefetching) {
      const responseAddress: Address = substitutedAddress || defaultAddress

      if (error) {
        pushResponse({
          type: 'READ',
          functionName,
          chainId: effectiveChainId,
          address: responseAddress,
          error,
        })
        return
      }

      pushResponse({
        type: 'READ',
        functionName,
        chainId: effectiveChainId,
        address: responseAddress,
        result: JSON.stringify(data?.toString()),
      })
    }
  }, [data, error, functionName, isFetchedAfterMount, isRefetching, pushResponse, substitutedAddress, effectiveChainId])

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="text-muted-foreground font-mono">{functionName}</CardTitle>
      </CardHeader>
      {abi.inputs.length > 0 && (
        <CardContent>
          <MethodInputs
            functionName={functionName}
            inputs={abi.inputs}
            args={args}
            onInputChange={handleInputChange}
            inputIdPrefix="readInput"
          />
        </CardContent>
      )}
      <CardFooter>
        <Button size="sm" onClick={handleReadClick}>
          {isRefetching ? (
            <RotateCwIcon className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <ScanSearchIcon className="mr-2 h-4 w-4" />
          )}
          Read
        </Button>
      </CardFooter>
    </Card>
  )
}
