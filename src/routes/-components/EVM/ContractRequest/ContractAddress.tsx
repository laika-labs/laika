import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useVirtualizer } from '@tanstack/react-virtual'
import { ChevronsUpDownIcon, DownloadIcon, RotateCwIcon, SaveIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { isAddress, type Address } from 'viem'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { getabi } from '@/constants/api'
import { cn } from '@/lib/utils'
import { useEVMChainsStore } from '@/store/chains'
import { useEVMCollectionStore } from '@/store/collections'

import { SaveContractDialog } from './SaveContractDialog'

const formSchema = z.object({
  address: z.string().refine(isAddress, {
    message: '(Invalid address)',
  }),
})

interface VirtualizedChainCommandProps {
  chains: Array<{ name: string; chainId: number }>
  selectedChain?: { name: string; chainId: number }
  onSelectChain: (chain: { name: string; chainId: number }) => void
}

const VirtualizedChainCommand = ({ chains, selectedChain, onSelectChain }: VirtualizedChainCommandProps) => {
  const [filteredChains, setFilteredChains] = useState(chains)
  const [focusedIndex, setFocusedIndex] = useState(0)
  const [isKeyboardNavActive, setIsKeyboardNavActive] = useState(false)

  const parentRef = useRef(null)

  const virtualizer = useVirtualizer({
    count: filteredChains.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
  })

  const virtualItems = virtualizer.getVirtualItems()

  const scrollToIndex = (index: number) => {
    virtualizer.scrollToIndex(index, {
      align: 'center',
    })
  }

  const handleSearch = (search: string) => {
    setIsKeyboardNavActive(false)
    setFilteredChains(chains.filter((chain) => chain.name.toLowerCase().includes(search.toLowerCase())))
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowDown': {
        event.preventDefault()
        setIsKeyboardNavActive(true)
        setFocusedIndex((prev) => {
          const newIndex = prev === -1 ? 0 : Math.min(prev + 1, filteredChains.length - 1)
          scrollToIndex(newIndex)
          return newIndex
        })
        break
      }
      case 'ArrowUp': {
        event.preventDefault()
        setIsKeyboardNavActive(true)
        setFocusedIndex((prev) => {
          const newIndex = prev === -1 ? filteredChains.length - 1 : Math.max(prev - 1, 0)
          scrollToIndex(newIndex)
          return newIndex
        })
        break
      }
      case 'Enter': {
        event.preventDefault()
        if (filteredChains[focusedIndex]) {
          onSelectChain(filteredChains[focusedIndex])
        }
        break
      }
      default:
        break
    }
  }

  useEffect(() => {
    if (selectedChain) {
      const index = filteredChains.findIndex((chain) => chain.chainId === selectedChain.chainId)
      if (index !== -1) {
        setFocusedIndex(index)
        virtualizer.scrollToIndex(index, {
          align: 'center',
        })
      }
    }
  }, [selectedChain, filteredChains, virtualizer])

  useEffect(() => {
    setFilteredChains(chains)
  }, [chains])

  return (
    <Command shouldFilter={false} onKeyDown={handleKeyDown}>
      <CommandInput onValueChange={handleSearch} placeholder="Search Networks..." className="h-9" />
      <CommandList
        ref={parentRef}
        style={{
          height: '256px',
          width: '100%',
          overflow: 'auto',
        }}
        onMouseDown={() => setIsKeyboardNavActive(false)}
        onMouseMove={() => setIsKeyboardNavActive(false)}
      >
        <CommandEmpty>No chain found.</CommandEmpty>
        <CommandGroup>
          <div
            style={{
              height: `${virtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            {virtualItems.map((virtualItem) => {
              const chain = filteredChains[virtualItem.index]
              return (
                <CommandItem
                  key={chain.chainId}
                  disabled={isKeyboardNavActive}
                  data-checked={chain.chainId === selectedChain?.chainId}
                  className={cn(
                    'absolute top-0 left-0 w-full bg-transparent',
                    focusedIndex === virtualItem.index && 'bg-accent text-accent-foreground',
                    isKeyboardNavActive &&
                      focusedIndex !== virtualItem.index &&
                      'aria-selected:text-primary aria-selected:bg-transparent',
                  )}
                  style={{
                    height: `${virtualItem.size}px`,
                    transform: `translateY(${virtualItem.start}px)`,
                  }}
                  value={chain.name}
                  onMouseEnter={() => !isKeyboardNavActive && setFocusedIndex(virtualItem.index)}
                  onMouseLeave={() => !isKeyboardNavActive && setFocusedIndex(-1)}
                  onSelect={() => onSelectChain(chain)}
                >
                  {chain.name}
                </CommandItem>
              )
            })}
          </div>
        </CommandGroup>
      </CommandList>
    </Command>
  )
}

interface ContractAddressProps {
  id: string
  chainId?: number
  address: string
}

export function ContractAddress({ id, chainId, address }: ContractAddressProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)

  const { updateContractChainId, updateContractAddress, updateContractABI, temporaryContracts } =
    useEVMCollectionStore()
  const { chains } = useEVMChainsStore()

  const isTemporary = temporaryContracts[id] !== undefined

  const chain = useMemo(() => {
    return chains.find((chain) => chain.chainId === chainId)
  }, [chainId, chains])

  const showLoadContract = useMemo(() => {
    return chain?.explorers?.find((explorer) => getabi?.[explorer.url]) !== undefined
  }, [chain?.explorers])

  const handleLoadContract = useCallback(async () => {
    if (!chain) {
      return
    }

    const explorer = chain.explorers?.find((explorer) => getabi?.[explorer.url])

    if (!explorer) {
      return
    }

    try {
      setLoading(true)
      const response = await fetch(`${getabi[explorer.url].replace('${address}', address)}`)
      const data = await response.json()

      if (data.status !== '1') {
        throw new Error(data.result)
      }

      updateContractABI(id, data.result)
      toast('Loaded contract successfully.')
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      }
    }
    setLoading(false)
  }, [address, chain, id, updateContractABI])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: address as Address,
    },
  })

  const onSubmit = useCallback(
    (values: z.infer<typeof formSchema>) => {
      updateContractAddress(id, values.address)
    },
    [id, updateContractAddress],
  )

  useEffect(() => {
    form.reset({
      address: address as Address,
    })

    const subscription = form.watch(() => {
      form.handleSubmit(onSubmit)()
    })

    return () => subscription.unsubscribe()
  }, [address, form, onSubmit])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-end gap-2">
        <FormItem>
          <div className="flex h-5 items-center gap-2">
            <FormLabel>Chain</FormLabel>
            <FormMessage />
          </div>
          <div>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger
                render={
                  <Button variant="outline" role="combobox" aria-expanded={open} className="w-48 justify-between">
                    <span className="truncate">{chain?.name ? chain?.name : 'Select Networks...'}</span>
                    <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                }
              />
              <PopoverContent className="w-64 p-0" align="start">
                <VirtualizedChainCommand
                  chains={chains}
                  selectedChain={chain}
                  onSelectChain={(selectedChain) => {
                    updateContractChainId(id, selectedChain.chainId)
                    setOpen(false)
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
        </FormItem>
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem className="w-full">
              <div className="flex h-5 items-center gap-2">
                <FormLabel>Contract Address</FormLabel>
                <FormMessage />
              </div>
              <FormControl>
                <Input placeholder="Contract Address" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        {showLoadContract && (
          <Button
            variant="secondary"
            className="whitespace-nowrap"
            type="button"
            onClick={handleLoadContract}
            disabled={loading}
          >
            {loading ? <RotateCwIcon className="animate-spin" /> : <DownloadIcon />}
            Load Contract
          </Button>
        )}
        {isTemporary && (
          <Button
            variant="secondary"
            className="whitespace-nowrap"
            type="button"
            onClick={() => setSaveDialogOpen(true)}
          >
            <SaveIcon />
            Save
          </Button>
        )}
      </form>
      <SaveContractDialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen} contractId={id} />
    </Form>
  )
}
