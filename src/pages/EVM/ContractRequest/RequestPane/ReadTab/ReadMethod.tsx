import { CardTitle, CardHeader, CardContent, CardFooter, Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ReadMethod({ functionName, abi }: { functionName: string; abi: any }) {
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
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              abi.inputs.map((field: any, idx: number) => {
                return (
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor={`readInput-${idx}`}>{`${field.type} ${field.name}`}</Label>
                    <Input id={`readInput-${idx}`} placeholder={field.type} />
                  </div>
                )
              })}
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button>🔍 Read</Button>
      </CardFooter>
    </Card>
  )
}
