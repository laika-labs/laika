import { useMemo, useState } from 'react'
import Editor from '@monaco-editor/react'
import { CheckIcon, ChevronsUpDownIcon, XIcon } from 'lucide-react'

import { useTheme } from '@/components/ThemeProvider'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { codegens } from '@/lib/codegens/evm'
import { findItemInCollections } from '@/lib/collections'
import { cn } from '@/lib/utils'
import { useEVMCollectionStore, type EVMContract } from '@/store/collections'
import { useEVMTabStore } from '@/store/tabs'

interface CodeSnippetProps {
  handleClose: () => void
}

export function CodeSnippet({ handleClose }: CodeSnippetProps) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(codegens[0].name)

  const { resolvedTheme } = useTheme()

  const { collections } = useEVMCollectionStore()
  const { activeTabId } = useEVMTabStore()

  const smartContract = useMemo(() => {
    return findItemInCollections(collections, activeTabId as string) as EVMContract
  }, [activeTabId, collections])

  const codegen = useMemo(() => {
    return codegens.find((codegen) => codegen.name.toLowerCase() === value.toLowerCase())
  }, [value])

  const code = useMemo(() => {
    if (codegen) {
      return codegen.generate(smartContract)
    }
    return ''
  }, [codegen, smartContract])

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between p-2">
        <small className="text-sm leading-none font-medium">Code Snippet</small>
        <Button variant="secondary" size="icon" onClick={handleClose}>
          <XIcon className="h-4 w-4" />
        </Button>
      </div>
      <div className="p-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
              {value ? codegen?.name : 'Select framework...'}
              <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-[320px] p-0">
            <Command>
              <CommandInput placeholder="Search framework..." className="h-9" />
              <CommandEmpty>No framework found.</CommandEmpty>
              <CommandGroup>
                {codegens.map((codegen) => (
                  <CommandItem
                    key={codegen.name}
                    value={codegen.name}
                    onSelect={(currentValue) => {
                      setValue(currentValue)
                      setOpen(false)
                    }}
                  >
                    {codegen.name}
                    <CheckIcon
                      className={cn(
                        'ml-auto h-4 w-4',
                        value.toLowerCase() === codegen.name.toLowerCase() ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <div className="bg-secondary m-2 flex-auto rounded-lg p-2">
        <Editor
          defaultLanguage={codegen ? codegen.language : 'javascript'}
          value={code}
          options={{
            readOnly: true,
            scrollBeyondLastLine: false,
            minimap: { enabled: false },
            wordWrap: 'on',
            fontSize: 12,
          }}
          theme={resolvedTheme === 'light' ? 'light' : 'vs-dark'}
        />
      </div>
    </div>
  )
}
