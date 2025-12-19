import { useCallback, useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { formatAbi } from 'abitype'
import { useForm } from 'react-hook-form'
import { Inspector } from 'react-inspector'
import { toast } from 'sonner'
import * as z from 'zod'

import { useTheme } from '@/components/ThemeProvider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/field'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { useEVMCollectionStore, type EVMContract } from '@/store/collections'

import { TabsButton } from './TabsButton'

const FormSchema = z.object({
  abi: z.string(),
})

export function ABITab({ smartContract }: { smartContract: EVMContract }) {
  const abi = smartContract.contract?.abi && JSON.parse(smartContract.contract.abi)

  const [open, setOpen] = useState(false)

  const { resolvedTheme } = useTheme()

  const { updateContractABI } = useEVMCollectionStore()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      abi: smartContract.contract?.abi,
    },
  })

  const onSubmit = useCallback(
    (data: z.infer<typeof FormSchema>) => {
      try {
        formatAbi(JSON.parse(data.abi))
        updateContractABI(smartContract.id, data.abi)
        toast('Updated ABI successfully.')
        setOpen(false)
      } catch {
        toast('Invalid ABI.')
      }
    },
    [smartContract.id, updateContractABI],
  )

  useEffect(() => {
    form.reset({
      abi: smartContract.contract?.abi,
    })
  }, [form, smartContract.contract?.abi])

  return (
    <Tabs defaultValue="object" className="flex h-full flex-col">
      <Card className="h-full w-full rounded-none">
        <CardHeader className="flex flex-row justify-between">
          <CardTitle>ABI</CardTitle>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger
              render={
                <Button variant="secondary" size="sm">
                  Edit
                </Button>
              }
            />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit ABI</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="abi"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ABI</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Paste your ABI here." className="h-60 overflow-y-auto" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <DialogClose
                      render={
                        <Button type="button" variant="secondary">
                          Close
                        </Button>
                      }
                    />
                    <Button type="submit">Save changes</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <TabsList className="flex h-auto w-fit gap-4 bg-transparent p-0">
            <TabsTrigger value="object" render={<TabsButton>Object</TabsButton>} />
            <TabsTrigger value="table" render={<TabsButton>Table</TabsButton>} />
          </TabsList>
          <TabsContent value="object">
            <Inspector
              table={false}
              data={abi}
              expandLevel={2}
              theme={resolvedTheme === 'light' ? 'chromeLight' : 'chromeDark'}
            />
          </TabsContent>
          <TabsContent value="table">
            <Inspector
              table={true}
              data={abi}
              columns={['name', 'stateMutability', 'type', 'payable', 'inputs', 'outputs']}
              theme={resolvedTheme === 'light' ? 'chromeLight' : 'chromeDark'}
            />
          </TabsContent>
        </CardContent>
      </Card>
    </Tabs>
  )
}
