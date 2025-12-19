import { cn } from '@/lib/utils'

export function TabsButton({ children, className, ...props }: React.ComponentProps<'button'>) {
  return (
    <button
      className={cn(
        className,
        'relative border-none px-0 pt-0',
        'after:transition-none',
        'aria-selected:after:bg-primary aria-selected:bg-transparent aria-selected:after:absolute aria-selected:after:inset-auto aria-selected:after:bottom-0 aria-selected:after:h-0.5 aria-selected:after:w-full aria-selected:after:opacity-100 dark:aria-selected:bg-transparent',
      )}
      {...props}
    >
      {children}
    </button>
  )
}
