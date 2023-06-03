"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ADMIN_ROLE, MEMBER_ROLE } from "@template/configuration";
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  toast,
} from "@template/ui/web";
import { inviteMembersSchema } from "@template/utility/schema";
import { classnames } from "@template/utility/shared";
import { api } from "@template/utility/trpc-next-client";
import { PlusCircleIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";

type CardProps = React.ComponentProps<typeof Card>;
type FormValue = z.infer<typeof inviteMembersSchema>;

export function InviteMembersForm({ className, ...rest }: CardProps) {
  const router = useRouter();
  const params = useParams();
  const teamSlug = params.teamSlug;

  const defaultValues: Partial<FormValue> = {
    teamSlug,
    invitations: [{ email: "", role: MEMBER_ROLE }],
  };

  const form = useForm<z.infer<typeof inviteMembersSchema>>({
    resolver: zodResolver(inviteMembersSchema),
    defaultValues,
  });

  const { mutate, isLoading } = api.team.inviteMember.useMutation({
    onSuccess: () => {
      toast({ title: "Invite(s) sent!" });
      form.reset();
      router.refresh();
    },
    onError: () => {
      toast({ title: "Could not send invitation", variant: "destructive" });
    },
  });

  function onSubmit(values: z.infer<typeof inviteMembersSchema>) {
    mutate(values);
  }

  const { fields, append } = useFieldArray({
    name: "invitations",
    control: form.control,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className={className} {...rest}>
          <CardHeader>
            <CardTitle>Invite team members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-x-4 gap-y-2">
              {fields.map((field, index) => {
                return (
                  <div key={field.id} className="flex flex-col gap-4 md:flex-row">
                    <FormField
                      control={form.control}
                      key={field.id}
                      name={`invitations.${index}.email`}
                      render={({ field }) => {
                        return (
                          <FormItem className="flex-1 md:basis-1/2 lg:basis-2/3">
                            <FormLabel className={classnames(index !== 0 && "sr-only")}>Email address</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="jane@example.com" disabled={isLoading} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                    <FormField
                      control={form.control}
                      key={field.id}
                      name={`invitations.${index}.role`}
                      render={({ field }) => {
                        return (
                          <FormItem className="flex-1 md:basis-1/2 lg:basis-1/3">
                            <FormLabel className={classnames(index !== 0 && "sr-only")}>Role</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Member" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value={ADMIN_ROLE}>Admin</SelectItem>
                                <SelectItem value={MEMBER_ROLE}>Member</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                  </div>
                );
              })}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => append({ email: "", role: MEMBER_ROLE })}
              disabled={isLoading}
            >
              <PlusCircleIcon className="mr-2 h-4 w-4" />
              Add more
            </Button>
          </CardContent>
          <CardFooter>
            <Button isLoading={isLoading} size="sm">
              Invite
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
