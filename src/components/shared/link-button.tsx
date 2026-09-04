import type { ComponentProps } from "react";

import Link from "next/link";

import type { VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

type TLinkButton = ComponentProps<typeof Link> & VariantProps<typeof buttonVariants>;

/**
 * A `Link` styled as a button via `buttonVariants`. Server-renderable — no
 * interactivity, so no client boundary is needed. For an in-page action that
 * needs `onClick`/`isLoading`, use `Button` or `LoadingButton` instead.
 */
export const LinkButton = ({ className, variant, size, target, ...props }: TLinkButton) => {
  return (
    <Link
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      target={target}
      rel={target === "_blank" ? "noopener noreferrer" : undefined}
      {...props}
    />
  );
};
