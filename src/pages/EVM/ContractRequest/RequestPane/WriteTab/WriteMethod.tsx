import { CardTitle, CardHeader, CardContent, CardFooter, Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { useState } from 'react'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

import { mainnet, useContractWrite } from 'wagmi'
import { EVMABIMethod, EVMABIMethodInputsOutputs } from '@/store/collections'

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

  const { data, write } = useContractWrite({
    address: contractAddress as `0x${string}`,
    abi: [abi],
    functionName: functionName,
    args,
    chainId: chainId ? chainId : mainnet.id,
  })

  const handleWriteClick = () => {
    write()
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
        {`${data}`}
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleWriteClick}>✍️ Write</Button>
      </CardFooter>
    </Card>
  )
}
