import { useMemo } from 'react'

import { Input } from '@/components/ui/input'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { parseVariableParts } from '@/lib/environment'
import { useEnvironmentStore } from '@/store/environments'

interface EnvironmentVariableInputProps extends React.ComponentProps<'input'> {
  value: string
}

export function EnvironmentVariableInput({ value, className, ...props }: EnvironmentVariableInputProps) {
  const { getActiveEnvironment, getVariableValue } = useEnvironmentStore()
  const activeEnvironment = getActiveEnvironment()

  const variableParts = useMemo(() => parseVariableParts(value), [value])

  const hasVariablesInValue = useMemo(() => {
    return variableParts.some((part) => part.type === 'variable')
  }, [variableParts])

  return (
    <div className="relative w-full">
      <Input value={value} className={className} {...props} />
      {hasVariablesInValue && (
        <div className="pointer-events-none absolute inset-0 flex items-center overflow-hidden" aria-hidden="true">
          <span className="ml-px px-2 py-0.5 text-sm whitespace-pre md:text-xs/relaxed">
            {variableParts.map((part, index) => {
              if (part.type === 'variable' && part.variableName && part.brackets) {
                const variableValue = getVariableValue(part.variableName)

                return (
                  <Tooltip key={index}>
                    <TooltipTrigger
                      render={
                        <span className="pointer-events-auto inline cursor-help">
                          <span className="bg-muted/50 text-muted-foreground">{part.brackets.open}</span>
                          <span className="bg-primary/20 text-primary hover:bg-primary/30 underline decoration-dotted underline-offset-2 transition-colors">
                            {part.variableName}
                          </span>
                          <span className="bg-muted/50 text-muted-foreground">{part.brackets.close}</span>
                        </span>
                      }
                    />
                    <TooltipContent className="w-auto max-w-none">
                      <div className="space-y-1">
                        <div className="font-mono text-xs font-semibold">{part.variableName}</div>
                        {variableValue !== null ? (
                          <div className="text-xs break-all whitespace-normal opacity-90">{variableValue}</div>
                        ) : (
                          <div className="text-xs opacity-70">Variable not found</div>
                        )}
                        {activeEnvironment && (
                          <div className="text-xs opacity-60">Environment: {activeEnvironment.name}</div>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                )
              }
              return (
                <span key={index} className="inline">
                  {part.content}
                </span>
              )
            })}
          </span>
        </div>
      )}
    </div>
  )
}
