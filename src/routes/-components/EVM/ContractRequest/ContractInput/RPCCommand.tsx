import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { cn } from '@/lib/utils'
import type { EVMChain } from '@/store/chains'

interface RPCCommandProps {
  chain: EVMChain | undefined
  selectedRpcUrl?: string
  onSelectRpc: (rpcUrl: string) => void
}

export function RPCCommand({ chain, selectedRpcUrl, onSelectRpc }: RPCCommandProps) {
  const [filteredRpcs, setFilteredRpcs] = useState<Array<{ url: string; tracking: string }>>([])
  const [focusedIndex, setFocusedIndex] = useState(0)
  const [isKeyboardNavActive, setIsKeyboardNavActive] = useState(false)

  const itemRefs = useRef<Array<HTMLDivElement | null>>([])

  const availableRpcs = useMemo(() => {
    if (!chain) return []

    return chain.rpc.filter(
      (rpc) =>
        rpc.url.startsWith('http') &&
        !rpc.url.includes('API_KEY') &&
        (rpc.tracking === 'none' || rpc.tracking === undefined),
    )
  }, [chain])

  const handleSearch = useCallback(
    (search: string) => {
      setIsKeyboardNavActive(false)
      setFilteredRpcs(availableRpcs.filter((rpc) => rpc.url.toLowerCase().includes(search.toLowerCase())))
    },
    [availableRpcs],
  )

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowDown': {
          event.preventDefault()
          setIsKeyboardNavActive(true)
          setFocusedIndex((prev) => {
            const newIndex = prev === -1 ? 0 : Math.min(prev + 1, filteredRpcs.length - 1)
            itemRefs.current[newIndex]?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
            return newIndex
          })
          break
        }
        case 'ArrowUp': {
          event.preventDefault()
          setIsKeyboardNavActive(true)
          setFocusedIndex((prev) => {
            const newIndex = prev === -1 ? filteredRpcs.length - 1 : Math.max(prev - 1, 0)
            itemRefs.current[newIndex]?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
            return newIndex
          })
          break
        }
        case 'Enter': {
          event.preventDefault()
          if (filteredRpcs[focusedIndex]) {
            onSelectRpc(filteredRpcs[focusedIndex].url)
          }
          break
        }
        default:
          break
      }
    },
    [filteredRpcs, focusedIndex, onSelectRpc],
  )

  useEffect(() => {
    setFilteredRpcs(availableRpcs)
  }, [availableRpcs])

  useEffect(() => {
    if (selectedRpcUrl) {
      const index = filteredRpcs.findIndex((rpc) => rpc.url === selectedRpcUrl)
      if (index !== -1) {
        setFocusedIndex(index)
        itemRefs.current[index]?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
      }
    }
  }, [selectedRpcUrl, filteredRpcs])

  if (!chain || availableRpcs.length === 0) {
    return null
  }

  return (
    <Command shouldFilter={false} onKeyDown={handleKeyDown}>
      <CommandInput onValueChange={handleSearch} placeholder="Search RPC..." className="h-9" />
      <CommandList onMouseDown={() => setIsKeyboardNavActive(false)} onMouseMove={() => setIsKeyboardNavActive(false)}>
        <CommandEmpty>No RPC found.</CommandEmpty>
        <CommandGroup>
          {filteredRpcs.map((rpc, index) => (
            <CommandItem
              key={rpc.url}
              ref={(el) => {
                itemRefs.current[index] = el
              }}
              disabled={isKeyboardNavActive}
              data-checked={rpc.url === selectedRpcUrl}
              className={cn(
                focusedIndex === index && 'bg-accent text-accent-foreground',
                isKeyboardNavActive &&
                  focusedIndex !== index &&
                  'aria-selected:text-primary aria-selected:bg-transparent',
              )}
              value={rpc.url}
              onMouseEnter={() => !isKeyboardNavActive && setFocusedIndex(index)}
              onMouseLeave={() => !isKeyboardNavActive && setFocusedIndex(-1)}
              onSelect={() => onSelectRpc(rpc.url)}
            >
              <span title={rpc.url} className="truncate">
                {rpc.url}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
