import { useEffect, useMemo } from 'react'
import { toast } from 'sonner'
import type { Abi, Address } from 'viem'
import { useReadContracts } from 'wagmi'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCaption, TableCell, TableRow } from '@/components/ui/table'
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
    <Card className="w-full rounded-none">
      <CardHeader>
        <CardTitle>INFO</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>Result has been pre-fetched.</TableCaption>
          <TableBody>
            {data &&
              !isLoading &&
              data.map((row, idx) => {
                return (
                  <TableRow key={prefetchableMethods[idx].functionName}>
                    <TableCell>{`${prefetchableMethods[idx].functionName}`}</TableCell>
                    <TableCell>{`${row.result}`}</TableCell>
                  </TableRow>
                )
              })}
            {isLoading &&
              prefetchableMethods.map((method) => {
                return (
                  <TableRow key={method.functionName}>
                    <TableCell>
                      <Skeleton className="h-4 w-[250px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[250px]" />
                    </TableCell>
                  </TableRow>
                )
              })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
