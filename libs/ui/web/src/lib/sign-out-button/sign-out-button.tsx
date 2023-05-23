"use client";

import { api } from "@template/utility/trpc-next-client";
import { useRouter } from "next/navigation";
import * as React from "react";
import { Button, ButtonProps } from "../button/button";

export const SignOutButton = React.forwardRef<HTMLButtonElement, Omit<ButtonProps, "asChild" | "isLoading">>(
  (props, ref) => {
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const router = useRouter();

    const trpcContext = api.useContext();

    const signOut = async () => {
      setIsLoading(true);
      const response = await fetch("/api/sign-out", {
        method: "POST",
      });

      trpcContext.invalidate();

      setIsLoading(false);

      if (response.redirected) {
        return router.push(response.url);
      }
    };

    return <Button {...props} onClick={signOut} isLoading={isLoading} ref={ref} />;
  },
);
