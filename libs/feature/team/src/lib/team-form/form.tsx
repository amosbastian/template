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
import { updateTeamSchema } from "@template/utility/schema";
import { classnames } from "@template/utility/shared";
import { api } from "@template/utility/trpc-next-client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";

type FormValues = z.infer<typeof updateTeamSchema>;

export type TeamFormInnerProps = {
  className?: string;
  defaultValues?: Partial<FormValues>;
  isDisabled?: boolean;
};

export function TeamFormInner({ className, defaultValues, isDisabled }: TeamFormInnerProps) {
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(updateTeamSchema),
    defaultValues,
  });

  const { mutate: updateTeam, isLoading: isUpdatingTeam } = api.team.update.useMutation({
    onSuccess: () => {
      toast({ title: "Team updated" });
      router.refresh();
    },
  });

  function onSubmit(data: FormValues) {
    updateTeam(data);
  }

  const disabled = isUpdatingTeam || isDisabled;

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
                <Input placeholder="My team" disabled={disabled} {...field} />
              </FormControl>
              <FormDescription>This is your team's name</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" size="sm" isLoading={isUpdatingTeam} disabled={disabled}>
          Update team
        </Button>
      </form>
    </Form>
  );
}
