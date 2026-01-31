import type { VariantProps } from "class-variance-authority"
import { cva } from "class-variance-authority"

export { default as NsEmptyState } from "./NsEmptyState.vue"

export const emptyStateVariants = cva(
  "flex flex-col items-center justify-center text-center",
  {
    variants: {
      size: {
        default: "p-8",
        sm: "p-4",
        lg: "p-12",
      },
      variant: {
        default: "",
        muted: "text-muted-foreground",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  },
)

export const iconVariants = cva(
  "text-muted-foreground",
  {
    variants: {
      size: {
        default: "h-16 w-16",
        sm: "h-12 w-12",
        lg: "h-20 w-20",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
)

export type EmptyStateVariants = VariantProps<typeof emptyStateVariants>
export type IconVariants = VariantProps<typeof iconVariants>