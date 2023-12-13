import { CardTitle, CardHeader, CardContent, CardFooter, Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { useState } from 'react'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

import { mainnet, useContractRead } from 'wagmi'
import { EVMABIMethod, EVMABIMethodInputsOutputs } from '@/store/collections'
import { useResponseStore } from '@/store/responses'

export default function ReadMethod({
  chainId,
  functionName,
  abi,
  contractAddress,
}: {
  chainId?: number
  functionName: string
  abi: EVMABIMethod
  contractAddress: string
}) {
  const [args, setArgs] = useState<Array<string>>(new Array(abi.inputs.length).fill(''))
  const { pushResponse } = useResponseStore()

  const { data, error, refetch } = useContractRead({
    address: contractAddress as `0x${string}`,
    abi: [abi],
    functionName,
    enabled: false,
    args,
    chainId: chainId ? chainId : mainnet.id,
  })

  const handleReadClick = () => {
    refetch()
    if (error) {
      return pushResponse({
        type: 'READ',
        functionName,
        chainId: chainId ? chainId : mainnet.id,
        address: contractAddress as `0x${string}`,
        error,
      })
    }

    return pushResponse({
      type: 'READ',
      functionName,
      chainId: chainId ? chainId : mainnet.id,
      address: contractAddress as `0x${string}`,
      result: JSON.stringify(data?.toString()),
    })
  }

  return (
    <Card className="w-full rounded-none">
      <CardHeader>
        <CardTitle>{functionName}</CardTitle>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
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
      <CardFooter className="flex justify-end">
        <Button onClick={handleReadClick}>🔍 Read</Button>
      </CardFooter>
    </Card>
  )
}
