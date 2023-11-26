import { UUID } from 'crypto'
import { useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { isAddress } from 'viem'
import * as z from 'zod'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useEVMCollectionStore } from '@/store/collections'
import { zodResolver } from '@hookform/resolvers/zod'

const formSchema = z.object({
  address: z.string().refine(isAddress, {
    message: '(Invalid address)',
  }),
})

interface ContractAddressProps {
  id: UUID
  address: string
}

export default function ContractAddress({ id, address }: ContractAddressProps) {
  const { updateContractAddress } = useEVMCollectionStore()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: address as `0x${string}`,
    },
  })

  const onSubmit = useCallback(
    (values: z.infer<typeof formSchema>) => {
      updateContractAddress(id, values.address)
    },
    [id, updateContractAddress],
  )

  useEffect(() => {
    const subscription = form.watch(() => {
      form.handleSubmit(onSubmit)()
    })

    return () => subscription.unsubscribe()
  }, [form, onSubmit])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center h-5 gap-2">
                <FormLabel>Contract Address</FormLabel>
                <FormMessage />
              </div>
              <FormControl>
                <Input placeholder="Contract Address" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
