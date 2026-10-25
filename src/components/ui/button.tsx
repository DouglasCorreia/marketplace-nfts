import type { ButtonHTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

const buttonStyles = cva('inline-flex min-h-10 items-center justify-center gap-2 rounded-[5px] px-4 font-kurio text-[14px] font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60', {
  variants: {
    variant: {
      primary: 'bg-kurio-accent text-kurio-canvas hover:bg-kurio-amber',
      secondary: 'border border-kurio-line-soft bg-transparent text-kurio-ink hover:border-kurio-amber',
      quiet: 'bg-transparent text-kurio-amber hover:bg-kurio-panel',
    },
    size: { default: 'h-10', small: 'h-8 px-3 text-[12px]' },
  },
  defaultVariants: { variant: 'primary', size: 'default' },
})

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonStyles>

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={[buttonStyles({ variant, size }), className].filter(Boolean).join(' ')} {...props} />
}
