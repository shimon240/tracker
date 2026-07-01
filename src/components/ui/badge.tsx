import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ds-transition',
  {
    variants: {
      variant: {
        default: 'border-accent/30 bg-accent/20 text-accent-bright',
        secondary: 'border-border bg-surface text-foreground-muted',
        destructive: 'border-red-500/30 bg-red-500/15 text-red-300',
        outline: 'border-border text-foreground-muted',
        success: 'border-emerald-500/30 bg-emerald-500/15 text-emerald-300',
        warning: 'border-amber-500/30 bg-amber-500/15 text-amber-300',
        info: 'border-sky-500/30 bg-sky-500/15 text-sky-300',
        purple: 'border-purple-500/30 bg-purple-500/15 text-purple-300',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
