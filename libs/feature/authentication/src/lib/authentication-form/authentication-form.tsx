"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  CardContent,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@template/ui/web";
import { classnames } from "@template/utility/shared";
import { api } from "@template/utility/trpc-next-client";
import { AlertCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { GithubButton } from "./github-button";
import { authenticationSchema } from "./schema";

type FormValues = z.infer<typeof authenticationSchema>;

export const AuthenticationForm = ({ action, className }: { action: string; className?: string }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<string>();

  const trpcContext = api.useContext();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const token = searchParams.get("token");

  const form = useForm<z.infer<typeof authenticationSchema>>({
    resolver: zodResolver(authenticationSchema),
    defaultValues: {
      email: email ?? "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    const { email, password } = data;

    if (!email || !password) {
      setIsLoading(false);
      return;
    }

    const response = await fetch(action, {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
        token,
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
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email address</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="jane@example.com" disabled={Boolean(email)} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {errorMessage ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          ) : null}

          {email ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Accept invitation</AlertTitle>
              <AlertDescription>
                You've been invited to a team. Once you sign up you'll be added as a member.
              </AlertDescription>
            </Alert>
          ) : null}

          <Button className="w-full" type="submit" isLoading={isLoading}>
            {action.includes("sign-in") ? "Sign in" : "Sign up"}
          </Button>
        </form>
      </Form>

      {!email ? (
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
      ) : null}
    </CardContent>
  );
};
