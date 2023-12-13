import { ButtonHTMLAttributes, PropsWithChildren, forwardRef } from 'react'

import { cn } from '@/lib/utils'

export default forwardRef<HTMLButtonElement, PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>>(
  function TabsButton({ children, className, ...props }, ref) {
    return (
      <button
        className={cn(
          className,
          'relative px-0 pt-0',
          'data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:h-0.5 data-[state=active]:after:inset-x-0 data-[state=active]:after:bg-primary',
        )}
        {...props}
        ref={ref}
      >
        {children}
      </button>
    )
  },
)
