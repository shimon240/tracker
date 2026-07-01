import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold ds-transition ds-focus-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:translate-y-0',
  {
    variants: {
      variant: {
        default:
          'ds-bg-gradient text-white rounded-lg ds-shadow-button hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgb(79_70_229/0.35)]',
        destructive:
          'bg-red-500 text-white rounded-lg hover:bg-red-600 hover:-translate-y-0.5',
        outline:
          'border border-border bg-surface text-foreground rounded-lg hover:bg-surface-hover hover:border-border-hover hover:-translate-y-0.5',
        secondary:
          'bg-surface-muted text-foreground rounded-lg border border-border hover:bg-surface-hover hover:-translate-y-0.5',
        ghost:
          'text-foreground-muted rounded-lg hover:bg-surface-muted hover:text-foreground',
        link:
          'text-accent underline-offset-4 hover:text-accent-bright hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 px-3 text-xs rounded-lg',
        lg: 'h-10 px-8 rounded-lg',
        icon: 'h-9 w-9 rounded-lg',
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
