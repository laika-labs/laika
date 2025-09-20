import { useCallback, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { DialogClose } from '@radix-ui/react-dialog'
import { formatAbi } from 'abitype'
import { CheckIcon, ChevronsUpDownIcon, Plus } from 'lucide-react'
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
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { useEVMChainsStore } from '@/store/chains'
import { useEVMCollectionStore } from '@/store/collections'
import { useEVMTabStore } from '@/store/tabs'

const FormSchema = z.object({
  chainId: z.number().optional(),
  address: z
    .string()
    .optional()
    .refine((address) => (address ? isAddress(address) : true), {
      message: 'Invalid address',
    }),
  abi: z
    .string()
    .optional()
    .refine(
      (abi) => {
        if (!abi) {
          return true
        }
        try {
          formatAbi(JSON.parse(abi))
        } catch {
          return false
        }
        return true
      },
      {
        message: 'Invalid ABI',
      },
    ),
})

interface NewRequestDialogProps {
  onDone: () => void
}

export function NewRequestDialog({ onDone }: NewRequestDialogProps) {
  const [open, setOpen] = useState(false)

  const { chains } = useEVMChainsStore()
  const { addCollection, addSmartContract } = useEVMCollectionStore()
  const { addTab, setActiveTab } = useEVMTabStore()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  const onSubmit = useCallback(
    (data: z.infer<typeof FormSchema>) => {
      addSmartContract(addCollection(), (smartContract) => {
        if (data.chainId) {
          smartContract.chainId = data.chainId
        }
        if (data.address) {
          smartContract.contract.address = data.address
        }
        if (data.abi) {
          smartContract.contract.abi = data.abi
        }
        addTab(smartContract.id)
        setActiveTab(smartContract.id)
      })
      toast('Added request successfully.')
      onDone()
    },
    [addCollection, addSmartContract, addTab, onDone, setActiveTab],
  )

  return (
    <Dialog>
      <DialogTrigger>
        <Card className="text-center">
          <CardHeader className="items-center">
            <Plus className="h-10 w-10" />
          </CardHeader>
          <CardContent>
            <CardTitle>New Request</CardTitle>
          </CardContent>
          <CardFooter>
            <p className="text-muted-foreground text-sm">Create a request with a new collection</p>
          </CardFooter>
        </Card>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>New Request</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="chainId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Chain (Optional)</FormLabel>
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
                          {chains.map((item) => (
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
                  <FormLabel>Address (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Paste your smart contract address here." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="abi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ABI (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Paste your ABI here." rows={10} {...field} />
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
              <Button type="submit">Create</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
