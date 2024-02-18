import { X } from 'lucide-react'
import { useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { EVMContract, useEVMCollectionStore } from '@/store/collections'
import { useEVMTabStore } from '@/store/tabs'
import { codegens } from '@/utils/codegens/evm'
import { findItemInCollections } from '@/utils/collections'
import Editor from '@monaco-editor/react'
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'
import { useTheme } from '@/components/ThemeProvider'

interface CodeSnippetProps {
  handleClose: () => void
}

export default function CodeSnippet({ handleClose }: CodeSnippetProps) {
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
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-2">
        <small className="text-sm font-medium leading-none">Code Snippet</small>
        <Button variant="secondary" size="icon" onClick={handleClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>
      <div className="p-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" role="combobox" aria-expanded={open} className="justify-between w-full">
              {value ? codegen?.name : 'Select framework...'}
              <CaretSortIcon className="w-4 h-4 ml-2 opacity-50 shrink-0" />
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
      <div className="flex-auto p-2 m-2 rounded-lg bg-secondary">
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
