"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  toast,
} from "@template/ui/web";
import { classnames } from "@template/utility/shared";
import { api } from "@template/utility/trpc-next-client";
import { AlertCircleIcon, CheckCircle2Icon } from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

type EmailVerifiedIconProps = {
  className?: string;
  emailVerified?: Date | null;
};

const EmailVerifiedIcon = React.forwardRef<HTMLDivElement, EmailVerifiedIconProps>(
  ({ className, emailVerified }, ref) => {
    return (
      <div className={className} ref={ref}>
        {emailVerified ? (
          <CheckCircle2Icon className="h-4 w-4" />
        ) : (
          <AlertCircleIcon className="text-destructive h-4 w-4" />
        )}
        <span className="sr-only">{emailVerified ? "Verified" : "Not verified"}</span>
      </div>
    );
  },
);

const formSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .max(30, {
      message: "Name must not be longer than 30 characters.",
    }),
  email: z
    .string({
      required_error: "An email is required",
    })
    .email(),
});

type FormValues = z.infer<typeof formSchema>;

export type ProfileFormInnerProps = {
  className?: string;
  defaultValues?: Partial<FormValues>;
  emailVerified?: Date | null;
  isDisabled?: boolean;
};

export function ProfileFormInner({ className, defaultValues, emailVerified, isDisabled }: ProfileFormInnerProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const { mutate: updateUser, isLoading: isUpdatingUser } = api.user.update.useMutation({
    onSuccess: () => {
      toast({ title: "Profile updated" });
    },
  });

  const { mutate: sendEmailVerification, isLoading: isSendingEmailVerification } =
    api.user.sendEmailVerification.useMutation({
      onSuccess: async () => {
        toast({ title: "Verification email sent", description: "Please check your inbox" });
      },
      onError: (error) => {
        toast({ title: error.message, variant: "destructive" });
      },
    });

  function onSubmit(data: FormValues) {
    updateUser({
      email: data.email,
      name: data.name,
      // If email changed, then set email to not verified
      emailVerified: defaultValues?.email !== data.email ? null : undefined,
    });
  }

  const disabled = isUpdatingUser || isDisabled;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={classnames("space-y-8", className)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Amos Bastian" disabled={disabled} {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name. It can be your real name or a pseudonym.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email address</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    placeholder="jane@example.com"
                    type="email"
                    disabled={disabled || isSendingEmailVerification}
                    {...field}
                  />
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="absolute right-3 top-3">
                        <EmailVerifiedIcon emailVerified={emailVerified} />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{emailVerified ? "Email verified" : "Email not verified"}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </FormControl>
              <FormDescription>
                We will send relevant emails to this address. Your email must be verified before you can use our
                platform.
                {emailVerified ? null : (
                  <span>
                    {" "}
                    <button
                      type="button"
                      onClick={() => sendEmailVerification()}
                      className="hover:text-brand underline underline-offset-4"
                    >
                      Verify your email.
                    </button>
                  </span>
                )}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" size="sm" isLoading={isUpdatingUser} disabled={disabled}>
          Update profile
        </Button>
      </form>
    </Form>
  );
}
