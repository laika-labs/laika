import { useCallback, useEffect, useMemo, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronsUpDownIcon, DownloadIcon, RotateCwIcon, SaveIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { isAddress, type Address } from 'viem'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { getabi } from '@/constants/api'
import { findItemInCollections } from '@/lib/collections'
import { useEVMChainsStore } from '@/store/chains'
import { EVMItemType, useEVMCollectionStore, type EVMContract } from '@/store/collections'

import { SaveContractDialog } from '../SaveContractDialog'
import { RPCCommand } from './RPCCommand'
import { VirtualizedChainCommand } from './VirtualizedChainCommand'

const formSchema = z.object({
  address: z.string().refine(isAddress, {
    message: '(Invalid address)',
  }),
})

interface ContractInputProps {
  id: string
  chainId?: number
  address: string
}

export function ContractInput({ id, chainId, address }: ContractInputProps) {
  const [open, setOpen] = useState(false)
  const [rpcOpen, setRpcOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)

  const {
    updateContractChainId,
    updateContractRpcUrl,
    updateContractAddress,
    updateContractABI,
    temporaryContracts,
    collections,
  } = useEVMCollectionStore()
  const { chains } = useEVMChainsStore()

  const isTemporary = temporaryContracts[id] !== undefined

  const contract = useMemo(() => {
    if (temporaryContracts[id]) {
      return temporaryContracts[id]
    }
    const item = findItemInCollections(collections, id)
    return item?.type === EVMItemType.SmartContract ? (item as EVMContract) : null
  }, [id, temporaryContracts, collections])

  const chain = useMemo(() => {
    return chains.find((chain) => chain.chainId === chainId)
  }, [chainId, chains])

  const availableRpcs = useMemo(() => {
    if (!chain) return []
    return chain.rpc.filter(
      (rpc) =>
        rpc.url.startsWith('http') &&
        !rpc.url.includes('API_KEY') &&
        (rpc.tracking === 'none' || rpc.tracking === undefined),
    )
  }, [chain])

  const selectedRpcDisplay = useMemo(() => {
    if (!contract?.rpcUrl) return 'Select RPC...'
    const rpc = availableRpcs.find((rpc) => rpc.url === contract.rpcUrl)
    if (!rpc) return 'Select RPC...'
    // Show shortened URL
    try {
      const url = new URL(rpc.url)
      return `${url.hostname}${url.pathname !== '/' ? url.pathname : ''}`
    } catch {
      return rpc.url.length > 40 ? `${rpc.url.slice(0, 40)}...` : rpc.url
    }
  }, [contract?.rpcUrl, availableRpcs])

  // Clear RPC URL if it's not valid for the current chain
  useEffect(() => {
    if (chain && contract?.rpcUrl) {
      const availableRpcs = chain.rpc.filter(
        (rpc) =>
          rpc.url.startsWith('http') &&
          !rpc.url.includes('API_KEY') &&
          (rpc.tracking === 'none' || rpc.tracking === undefined),
      )
      const isValidRpc = availableRpcs.some((rpc) => rpc.url === contract.rpcUrl)
      if (!isValidRpc && availableRpcs.length > 0) {
        // Clear invalid RPC URL when chain changes
        updateContractRpcUrl(id, '')
      }
    }
  }, [chain, contract?.rpcUrl, id, updateContractRpcUrl])

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
                  }}
                />
                {chain && availableRpcs.length > 0 && (
                  <div className="border-t p-2">
                    <Popover open={rpcOpen} onOpenChange={setRpcOpen}>
                      <PopoverTrigger
                        render={
                          <Button variant="outline" size="sm" className="w-full justify-between text-xs">
                            <span className="truncate">{selectedRpcDisplay}</span>
                            <ChevronsUpDownIcon className="ml-2 h-3 w-3 shrink-0 opacity-50" />
                          </Button>
                        }
                      />
                      <PopoverContent className="w-64 p-0" align="start" side="right">
                        <RPCCommand
                          chain={chain}
                          selectedRpcUrl={contract?.rpcUrl}
                          onSelectRpc={(rpcUrl) => {
                            updateContractRpcUrl(id, rpcUrl)
                            setRpcOpen(false)
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                )}
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
