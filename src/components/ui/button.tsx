import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ds-transition ds-focus-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98]',
  {
    variants: {
      variant: {
        default:
          'bg-accent text-white ds-shadow-accent hover:bg-accent-bright hover:shadow-[0_0_0_1px_rgb(94_106_210/0.6),0_6px_20px_rgb(94_106_210/0.35),inset_0_1px_0_0_rgb(255_255_255/0.2)]',
        destructive:
          'bg-destructive/90 text-white hover:bg-destructive ds-shadow-inset',
        outline:
          'border border-border bg-surface text-foreground hover:bg-surface-hover hover:border-border-hover ds-shadow-inset',
        secondary:
          'bg-surface text-foreground hover:bg-surface-hover ds-shadow-inset',
        ghost:
          'text-foreground-muted hover:bg-surface hover:text-foreground',
        link:
          'text-accent underline-offset-4 hover:text-accent-bright hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-10 px-8',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
