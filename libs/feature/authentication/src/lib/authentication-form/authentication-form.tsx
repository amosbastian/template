"use client";

import { Button, CardContent, Input, Label } from "@template/ui/web";
import { classnames } from "@template/utility/shared";
import { api } from "@template/utility/trpc-next-client";
import { useRouter } from "next/navigation";
import * as React from "react";
import { GithubButton } from "./github-button";
import { authenticationSchema } from "./schema";

export const AuthenticationForm = ({ action, className }: { action: string; className?: string }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<string>();

  const trpcContext = api.useContext();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData(event.currentTarget);
    const input = authenticationSchema.parse(formData);
    const { email, password } = input;

    const response = await fetch(event.currentTarget.action, {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
    });

    setIsLoading(false);
    trpcContext.invalidate();

    if (response.redirected) {
      return router.push(response.url);
    }

    const result = (await response.json()) as {
      error: string;
    };

    setErrorMessage(result.error);
  };

  return (
    <CardContent className={classnames("pt-6", className)}>
      <form className="space-y-6" method="post" onSubmit={handleSubmit} action={action}>
        <div>
          <Label htmlFor="email">Email address</Label>
          <Input className="mt-2" id="email" name="email" type="email" autoComplete="email" required />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            className="mt-2"
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
        </div>

        <Button className="w-full" type="submit" isLoading={isLoading}>
          {action.includes("sign-in") ? "Sign in" : "Sign up"}
        </Button>
      </form>

      <div>
        <div className="relative mt-10">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="border-border w-full border-t" />
          </div>
          <div className="relative flex justify-center text-sm font-medium leading-6">
            <span className="bg-background text-muted-foreground px-6">Or continue with</span>
          </div>
        </div>

        <div className="mt-6 grid gap-4">
          <GithubButton />
        </div>
      </div>
    </CardContent>
  );
};

export default AuthenticationForm;
