import { ScanSearch } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Address } from 'viem'
import { mainnet, useContractRead } from 'wagmi'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { EVMABIMethod, EVMABIMethodInputsOutputs } from '@/store/collections'
import { useResponseStore } from '@/store/responses'
import { ReloadIcon } from '@radix-ui/react-icons'

export default function ReadMethod({
  chainId,
  functionName,
  abi,
  contractAddress,
}: {
  chainId?: number
  functionName: string
  abi: EVMABIMethod
  contractAddress: Address
}) {
  const [args, setArgs] = useState<Array<string>>(new Array(abi.inputs.length).fill(''))
  const { pushResponse } = useResponseStore()

  const { data, error, isRefetching, isFetchedAfterMount, refetch } = useContractRead({
    address: contractAddress,
    abi: [abi],
    functionName,
    enabled: false,
    args,
    chainId: chainId ? chainId : mainnet.id,
  })

  const handleReadClick = () => {
    refetch()
  }

  useEffect(() => {
    if (isFetchedAfterMount && !isRefetching) {
      if (error) {
        return pushResponse({
          type: 'READ',
          functionName,
          chainId: chainId ? chainId : mainnet.id,
          address: contractAddress,
          error,
        })
      }

      return pushResponse({
        type: 'READ',
        functionName,
        chainId: chainId ? chainId : mainnet.id,
        address: contractAddress,
        result: JSON.stringify(data?.toString()),
      })
    }
  }, [chainId, contractAddress, data, error, functionName, isFetchedAfterMount, isRefetching, pushResponse])

  return (
    <Card className="w-full rounded-none">
      <CardHeader className="px-4 pt-4 pb-0">
        <CardTitle>{functionName}</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <form>
          <div className="grid items-center w-full gap-4">
            {abi &&
              abi.inputs &&
              abi.inputs.map((field: EVMABIMethodInputsOutputs, idx: number) => {
                const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
                  const newArgs = [...args]
                  newArgs[idx] = event.target.value
                  setArgs(newArgs)
                }
                return (
                  <div key={`${field.type}-${field.name}-${idx}`} className="flex flex-col space-y-1.5">
                    <Label htmlFor={`readInput-${idx}`}>{`${field.type} ${field.name}`}</Label>
                    <Input
                      id={`readInput-${idx}`}
                      placeholder={field.type}
                      value={args[idx] || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                )
              })}
          </div>
        </form>
      </CardContent>
      <CardFooter className="px-4 pb-4">
        <Button size="sm" onClick={handleReadClick}>
          {isRefetching ? (
            <ReloadIcon className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <ScanSearch className="w-4 h-4 mr-2" />
          )}
          Read
        </Button>
      </CardFooter>
    </Card>
  )
}
