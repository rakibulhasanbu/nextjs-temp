import type { ComponentProps } from "react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

type TLoadingButton = ComponentProps<typeof Button> & {
  isLoading?: boolean;
};

/**
 * `Button` that shows a `Spinner` and disables itself while `isLoading`.
 * Use for any button that triggers a fetch/mutation. For pure navigation
 * (no async action), use `LinkButton` instead.
 */
export const LoadingButton = ({
  isLoading = false,
  disabled,
  children,
  ...props
}: TLoadingButton) => {
  return (
    <Button disabled={isLoading || disabled} {...props}>
      {isLoading ? <Spinner /> : null}
      {children}
    </Button>
  );
};
