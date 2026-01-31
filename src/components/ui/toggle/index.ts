import type { VariantProps } from "class-variance-authority"
import { cva } from "class-variance-authority"

export { default as NsToggle } from "./NsToggle.vue"

export const toggleVariants = cva(
  "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
  {
    variants: {
      variant: {
        default: "data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
        destructive: "data-[state=checked]:bg-destructive data-[state=unchecked]:bg-input",
        success: "data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-input",
        warning: "data-[state=checked]:bg-orange-500 data-[state=unchecked]:bg-input",
      },
      size: {
        default: "h-6 w-11",
        sm: "h-5 w-9",
        lg: "h-7 w-13",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export const toggleThumbVariants = cva(
  "pointer-events-none block rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
  {
    variants: {
      size: {
        default: "h-5 w-5 data-[state=checked]:translate-x-5",
        sm: "h-4 w-4 data-[state=checked]:translate-x-4",
        lg: "h-6 w-6 data-[state=checked]:translate-x-6",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
)

export const labelVariants = cva(
  "text-sm font-medium",
  {
    variants: {
      variant: {
        default: "text-foreground",
        destructive: "text-destructive",
        success: "text-green-600",
        warning: "text-orange-600",
        muted: "text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

export type ToggleVariants = VariantProps<typeof toggleVariants>
export type ToggleThumbVariants = VariantProps<typeof toggleThumbVariants>
export type LabelVariants = VariantProps<typeof labelVariants>