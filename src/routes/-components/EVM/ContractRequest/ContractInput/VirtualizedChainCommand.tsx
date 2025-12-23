import { useCallback, useEffect, useRef, useState } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { cn } from '@/lib/utils'

interface VirtualizedChainCommandProps {
  chains: Array<{ name: string; chainId: number }>
  selectedChain?: { name: string; chainId: number }
  onSelectChain: (chain: { name: string; chainId: number }) => void
}

export function VirtualizedChainCommand({ chains, selectedChain, onSelectChain }: VirtualizedChainCommandProps) {
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

  const scrollToIndex = useCallback(
    (index: number) => {
      virtualizer.scrollToIndex(index, {
        align: 'center',
      })
    },
    [virtualizer],
  )

  const handleSearch = useCallback(
    (search: string) => {
      setIsKeyboardNavActive(false)
      setFilteredChains(chains.filter((chain) => chain.name.toLowerCase().includes(search.toLowerCase())))
    },
    [chains],
  )

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
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
    },
    [filteredChains, focusedIndex, onSelectChain, scrollToIndex],
  )

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
