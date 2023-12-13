import { CardTitle, CardHeader, CardContent, Card, CardFooter } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { useState } from 'react'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

import { mainnet, useContractWrite } from 'wagmi'
import { EVMABIMethod, EVMABIMethodInputsOutputs } from '@/store/collections'

import { useResponseStore } from '@/store/responses'

export default function WriteMethod({
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

  const { write } = useContractWrite({
    address: contractAddress as `0x${string}`,
    abi: [abi],
    functionName: functionName,
    args,
    chainId: chainId ? chainId : mainnet.id,
    onSettled(data, error) {
      if (error) {
        return pushResponse({
          type: 'WRITE',
          functionName,
          chainId: chainId ? chainId : mainnet.id,
          address: contractAddress as `0x${string}`,
          error,
        })
      }

      return pushResponse({
        type: 'WRITE',
        functionName,
        chainId: chainId ? chainId : mainnet.id,
        address: contractAddress as `0x${string}`,
        txHash: data && data.hash,
      })
    },
  })

  const handleWriteClick = () => {
    write()
  }

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
        <Button size="sm" onClick={handleWriteClick}>
          Write
        </Button>
      </CardFooter>
    </Card>
  )
}
