import type { VariantProps } from "class-variance-authority"
import { cva } from "class-variance-authority"

export { default as NsInlineNotification } from "./NsInlineNotification.vue"

export const inlineNotificationVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
        warning:
          "border-orange-500/50 text-orange-800 dark:border-orange-500 [&>svg]:text-orange-500 dark:text-orange-400",
        success:
          "border-green-500/50 text-green-800 dark:border-green-500 [&>svg]:text-green-500 dark:text-green-400",
        info:
          "border-blue-500/50 text-blue-800 dark:border-blue-500 [&>svg]:text-blue-500 dark:text-blue-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

export type InlineNotificationVariants = VariantProps<typeof inlineNotificationVariants>