import { Link } from '@tanstack/react-router'

import { buttonVariants } from '@/components/ui/button'
import Ethereum from '@/icons/ethereum.svg?react'
import { cn } from '@/lib/utils'

export function Sidenav() {
  return (
    <div className="flex flex-col">
      <Link
        to="/"
        activeProps={{
          className:
            'before:bg-primary text-foreground fill-foreground before:absolute before:inset-y-0 before:left-0 before:w-0.5',
        }}
        inactiveProps={{
          className: 'text-muted-foreground fill-muted-foreground',
        }}
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'relative flex h-auto w-full flex-col space-y-1 p-2 text-xs',
        )}
      >
        <Ethereum className="h-6 w-6" />
        <span>EVM</span>
      </Link>
    </div>
  )
}
