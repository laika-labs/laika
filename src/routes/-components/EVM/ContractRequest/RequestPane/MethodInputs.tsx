import { EnvironmentVariableInput } from '@/components/EnvironmentVariableInput'
import { Label } from '@/components/ui/label'
import type { EVMABIMethodInputsOutputs } from '@/store/collections'

interface MethodInputsProps {
  functionName: string
  inputs: EVMABIMethodInputsOutputs[]
  args: string[]
  onInputChange: (idx: number) => (event: React.ChangeEvent<HTMLInputElement>) => void
  inputIdPrefix: string
}

export function MethodInputs({ functionName, inputs, args, onInputChange, inputIdPrefix }: MethodInputsProps) {
  if (!inputs || inputs.length === 0) {
    return null
  }

  return (
    <form>
      <div className="grid w-full items-center gap-4">
        {inputs.map((field, idx) => (
          <div key={`${field.type}-${field.name}-${idx}`} className="flex flex-col space-y-1.5">
            <Label htmlFor={`${inputIdPrefix}-${functionName}-${idx}`}>{`${field.type} ${field.name}`}</Label>
            <EnvironmentVariableInput
              id={`${inputIdPrefix}-${functionName}-${idx}`}
              placeholder={field.type}
              value={args[idx] || ''}
              onChange={onInputChange(idx)}
            />
          </div>
        ))}
      </div>
    </form>
  )
}
