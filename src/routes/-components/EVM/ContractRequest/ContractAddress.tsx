import { useCallback, useEffect, useMemo, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckIcon, ChevronsUpDownIcon, DownloadIcon, RotateCwIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { isAddress, type Address } from 'viem'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { getabi } from '@/constants/api'
import { cn } from '@/lib/utils'
import { useEVMChainsStore } from '@/store/chains'
import { useEVMCollectionStore } from '@/store/collections'

const formSchema = z.object({
  address: z.string().refine(isAddress, {
    message: '(Invalid address)',
  }),
})

interface ContractAddressProps {
  id: string
  chainId?: number
  address: string
}

export function ContractAddress({ id, chainId, address }: ContractAddressProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const { updateContractChainId, updateContractAddress, updateContractABI } = useEVMCollectionStore()
  const { chains } = useEVMChainsStore()

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
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" role="combobox" aria-expanded={open} className="w-[256px] justify-between">
                <span className="truncate">{chain?.name ? chain?.name : 'Select Networks...'}</span>
                <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[256px] p-0">
              <Command>
                <CommandInput placeholder="Search Networks..." className="h-9" />
                <CommandEmpty>No chain found.</CommandEmpty>
                <CommandGroup className="max-h-[256px] overflow-y-scroll">
                  {chains.map((item) => (
                    <CommandItem
                      key={item.name}
                      value={item.name}
                      onSelect={(currentValue) => {
                        const chain = chains.find((chain) => chain.name.toLowerCase() === currentValue.toLowerCase())
                        if (chain) {
                          updateContractChainId(id, chain.chainId)
                        }
                        setOpen(false)
                      }}
                    >
                      {item.name}
                      <CheckIcon
                        className={cn('ml-auto h-4 w-4', chain?.name === item.name ? 'opacity-100' : 'opacity-0')}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
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
            {loading ? (
              <RotateCwIcon className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <DownloadIcon className="mr-2 h-4 w-4" />
            )}
            Load Contract
          </Button>
        )}
      </form>
    </Form>
  )
}
