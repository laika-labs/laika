import { NavLink } from 'react-router-dom'

import { buttonVariants } from '@/components/ui/button'
import Ethereum from '@/icons/ethereum.svg?react'
import { cn } from '@/lib/utils'

export default function Sidenav() {
  return (
    <div className="flex flex-col">
      <NavLink
        to="/"
        className={({ isActive }) =>
          cn(
            buttonVariants({ variant: 'ghost' }),
            'relative flex flex-col w-full h-auto p-2 space-y-1 text-xs',
            isActive
              ? 'before:left-0 before:w-0.5 before:bg-primary before:absolute before:inset-y-0 text-foreground fill-foreground'
              : 'text-muted-foreground fill-muted-foreground',
          )
        }
      >
        <Ethereum className="w-6 h-6" />
        <span>EVM</span>
      </NavLink>
    </div>
  )
}
