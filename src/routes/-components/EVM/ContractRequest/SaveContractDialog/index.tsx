import { useCallback, useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useEVMCollectionStore } from '@/store/collections'
import { useEVMTabStore } from '@/store/tabs'

import { CollectionTreePicker } from './CollectionTreePicker'

const FormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  locationId: z.string().min(1, 'Location is required'),
})

interface SaveContractDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  contractId: string
}

export function SaveContractDialog({ open, onOpenChange, contractId }: SaveContractDialogProps) {
  const { collections, temporaryContracts, convertTemporaryToPermanent, addCollection, addFolder, renameItem } =
    useEVMCollectionStore()
  const { replaceTab } = useEVMTabStore()

  const temporaryContract = temporaryContracts[contractId]

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: temporaryContract?.name || 'New Smart Contract',
      locationId: '',
    },
  })

  const handleCreateCollection = useCallback(() => {
    const id = addCollection()
    form.setValue('locationId', id)
  }, [addCollection, form])

  const handleCreateFolder = useCallback(
    (parentId: string) => {
      const folderId = addFolder(parentId)
      form.setValue('locationId', folderId)
    },
    [addFolder, form],
  )

  useEffect(() => {
    if (temporaryContract) {
      form.reset({
        name: temporaryContract.name,
        locationId: '',
      })
    }
  }, [temporaryContract, form])

  const onSubmit = useCallback(
    (data: z.infer<typeof FormSchema>) => {
      if (!temporaryContract) {
        return
      }

      const newId = convertTemporaryToPermanent(contractId, data.locationId)
      if (newId) {
        renameItem(newId, data.name)
        replaceTab(contractId, newId)
        toast('Contract saved successfully.')
        onOpenChange(false)
      }
    },
    [temporaryContract, convertTemporaryToPermanent, contractId, renameItem, replaceTab, onOpenChange],
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Save Contract</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contract Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter contract name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="locationId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Location</FormLabel>
                  <CollectionTreePicker
                    collections={collections}
                    selectedLocationId={field.value}
                    onSelectLocation={field.onChange}
                    onCreateCollection={handleCreateCollection}
                    onCreateFolder={handleCreateFolder}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose
                render={
                  <Button type="button" variant="secondary">
                    Cancel
                  </Button>
                }
              />
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
