import { cn } from '@/lib/utils'

export function TabsButton({ children, className, ...props }: React.ComponentProps<'button'>) {
  return (
    <button
      className={cn(
        className,
        'relative px-0 pt-0',
        'data-[state=active]:bg-transparent data-[state=active]:shadow-none',
        'data-[state=active]:after:bg-primary data-[state=active]:after:absolute data-[state=active]:after:inset-x-0 data-[state=active]:after:bottom-0 data-[state=active]:after:h-0.5',
      )}
      {...props}
    >
      {children}
    </button>
  )
}
