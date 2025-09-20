import { useCallback, useMemo, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { DialogClose } from '@radix-ui/react-dialog'
import { CheckIcon, ChevronsUpDownIcon, DownloadIcon, Globe, RotateCwIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { isAddress } from 'viem'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { getabi } from '@/constants/api'
import { cn } from '@/lib/utils'
import { useEVMChainsStore } from '@/store/chains'
import { useEVMCollectionStore } from '@/store/collections'
import { useEVMTabStore } from '@/store/tabs'

const FormSchema = z.object({
  chainId: z.number(),
  address: z.string().refine((address) => (address ? isAddress(address) : true), {
    message: 'Invalid address',
  }),
})

interface ChainExplorerDialogProps {
  onDone: () => void
}

export function ChainExplorerDialog({ onDone }: ChainExplorerDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const { chains } = useEVMChainsStore()
  const { addCollection, addSmartContract } = useEVMCollectionStore()
  const { addTab, setActiveTab } = useEVMTabStore()

  const filteredChains = useMemo(() => {
    return chains.filter((chain) => chain.explorers?.some((explorer) => getabi?.[explorer.url]))
  }, [chains])

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  const onSubmit = useCallback(
    async (data: z.infer<typeof FormSchema>) => {
      try {
        const chain = filteredChains.find((chain) => chain.chainId === data.chainId)
        if (!chain) {
          throw new Error('Chain not found.')
        }

        const explorer = chain.explorers?.find((explorer) => getabi?.[explorer.url])
        if (!explorer) {
          throw new Error('Chain explorer not found.')
        }

        setLoading(true)

        const response = await fetch(`${getabi[explorer.url].replace('${address}', data.address)}`)
        const responseData = await response.json()
        if (responseData.status !== '1') {
          throw new Error(responseData.result)
        }

        addSmartContract(addCollection(), (smartContract) => {
          smartContract.chainId = data.chainId
          smartContract.contract.address = data.address
          smartContract.contract.abi = responseData.result
          addTab(smartContract.id)
          setActiveTab(smartContract.id)
        })
        toast('Added request successfully.')
        onDone()
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message)
        }
      }
      setLoading(false)
    },
    [addCollection, addSmartContract, addTab, filteredChains, onDone, setActiveTab],
  )

  return (
    <Dialog>
      <DialogTrigger>
        <Card className="text-center">
          <CardHeader className="justify-center">
            <Globe className="size-10" />
          </CardHeader>
          <CardContent>
            <CardTitle>Chain Explorer</CardTitle>
          </CardContent>
          <CardFooter>
            <p className="text-muted-foreground text-sm">Create a request from chain explorer</p>
          </CardFooter>
        </Card>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>New Request from Chain Explorer</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="chainId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Chain</FormLabel>
                  <Popover open={open} onOpenChange={setOpen} modal>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn('justify-between', !field.value && 'text-muted-foreground')}
                        >
                          {field.value
                            ? chains.find((chain) => chain.chainId === field.value)?.name
                            : 'Select Networks...'}
                          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="p-0">
                      <Command>
                        <CommandInput placeholder="Search Networks..." className="h-9" />
                        <CommandEmpty>No chain found.</CommandEmpty>
                        <CommandGroup className="max-h-[256px] overflow-y-scroll">
                          {filteredChains.map((item) => (
                            <CommandItem
                              key={item.name}
                              value={item.name}
                              onSelect={(currentValue) => {
                                const chain = chains.find((chain) => chain.name.toLowerCase() === currentValue)
                                if (chain) {
                                  form.setValue('chainId', chain.chainId)
                                  setOpen(false)
                                }
                              }}
                            >
                              {item.name}
                              <CheckIcon
                                className={cn(
                                  'ml-auto h-4 w-4',
                                  chains.find((chain) => chain.chainId === field.value)?.name === item.name
                                    ? 'opacity-100'
                                    : 'opacity-0',
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Paste your smart contract address here." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Close
                </Button>
              </DialogClose>
              <Button type="submit">
                {loading ? (
                  <RotateCwIcon className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <DownloadIcon className="mr-2 h-4 w-4" />
                )}
                Load Contract
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
