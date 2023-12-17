import { formatAbi } from 'abitype'
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Inspector } from 'react-inspector'
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/components/ui/use-toast'
import { EVMContract, useEVMCollectionStore } from '@/store/collections'
import { zodResolver } from '@hookform/resolvers/zod'

import TabsButton from '../TabsButton'

const FormSchema = z.object({
  abi: z.string(),
})

export default function ABITab({ smartContract }: { smartContract: EVMContract }) {
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
        toast({
          title: 'Updated ABI successfully.',
        })
        setOpen(false)
      } catch {
        toast({
          title: 'Error',
          description: 'Invalid ABI.',
        })
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
    <Tabs defaultValue="object" className="flex flex-col h-full">
      <Card className="w-full h-full rounded-none">
        <CardHeader className="flex-row justify-between px-4 pt-4 pb-0">
          <CardTitle>ABI</CardTitle>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="secondary" size="sm">
                Edit
              </Button>
            </DialogTrigger>
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
                    <Button type="submit">Save changes</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="p-4">
          <TabsList className="flex h-auto gap-4 p-0 w-fit bg-background">
            <TabsTrigger value="object" asChild>
              <TabsButton>Object</TabsButton>
            </TabsTrigger>
            <TabsTrigger value="table" asChild>
              <TabsButton>Table</TabsButton>
            </TabsTrigger>
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
