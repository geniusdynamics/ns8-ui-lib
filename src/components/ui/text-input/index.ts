import type { VariantProps } from "class-variance-authority"
import { cva } from "class-variance-authority"

export { default as NsTextInput } from "./NsTextInput.vue"

export const textInputVariants = cva(
  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-input",
        destructive: "border-destructive text-destructive",
        warning: "border-orange-500 text-orange-600",
        success: "border-green-500 text-green-600",
      },
      size: {
        default: "h-9 px-3 py-1 text-sm",
        sm: "h-8 px-2.5 py-0.5 text-xs",
        lg: "h-10 px-3.5 py-1.5 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
  {
    variants: {
      variant: {
        default: "text-foreground",
        destructive: "text-destructive",
        warning: "text-orange-600",
        success: "text-green-600",
        muted: "text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

export const helperTextVariants = cva(
  "text-sm",
  {
    variants: {
      variant: {
        default: "text-muted-foreground",
        destructive: "text-destructive",
        warning: "text-orange-600",
        success: "text-green-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

export type TextInputVariants = VariantProps<typeof textInputVariants>
export type LabelVariants = VariantProps<typeof labelVariants>
export type HelperTextVariants = VariantProps<typeof helperTextVariants>