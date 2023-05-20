"use client";

import { Button, CardContent, Input, Label } from "@template/ui/web";
import { classnames } from "@template/utility/shared";
import { api } from "@template/utility/trpc-next-client";
import { useRouter } from "next/navigation";
import * as React from "react";
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
          Sign in
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
          <a
            href="/api/oauth?provider=github"
            className="flex w-full items-center justify-center gap-3 rounded-md bg-[#24292F] px-3 py-1.5 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24292F]"
          >
            <svg className="h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm font-semibold leading-6">GitHub</span>
          </a>
        </div>
      </div>
    </CardContent>
  );
};

export default AuthenticationForm;
