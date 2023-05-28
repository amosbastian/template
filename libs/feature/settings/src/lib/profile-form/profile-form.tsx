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
  toast,
} from "@template/ui/web";
import { classnames } from "@template/utility/shared";
import { api } from "@template/utility/trpc-next-client";
import { useForm } from "react-hook-form";
import * as z from "zod";

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

type ProfileFormProps = {
  className?: string;
  defaultValues?: Partial<FormValues>;
};

export function ProfileForm({ className, defaultValues }: ProfileFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const { mutate: updateUser, isLoading: isUpdatingUser } = api.user.update.useMutation({
    onSuccess: () => {
      toast({ title: "Profile updated" });
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
                <Input placeholder="Amos Bastian" {...field} />
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
                <Input placeholder="jane@example.com" type="email" {...field} />
              </FormControl>
              <FormDescription>
                We will send relevant emails to this address. Your email must be verified before you can use our
                platform.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" size="sm" isLoading={isUpdatingUser}>
          Update profile
        </Button>
      </form>
    </Form>
  );
}
