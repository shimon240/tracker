import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-9 w-full rounded-lg border border-white/10 bg-input-bg px-3 py-1 text-sm text-foreground ds-transition file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-foreground-subtle ds-focus-ring focus-visible:border-accent focus-visible:shadow-[0_0_0_3px_rgb(94_106_210/0.2)] disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }
