"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ADMIN_ROLE, MEMBER_ROLE, ROLES } from "@template/configuration";
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
} from "@template/ui/web";
import { classnames } from "@template/utility/shared";
import { PlusCircleIcon } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  invitations: z.array(
    z.object({
      email: z.string().email(),
      role: z.enum(ROLES),
    }),
  ),
});

type CardProps = React.ComponentProps<typeof Card>;
type FormValue = z.infer<typeof formSchema>;

export function InviteMembersForm({ className, ...props }: CardProps) {
  const defaultValues: Partial<FormValue> = {
    invitations: [{ email: "", role: MEMBER_ROLE }],
  };

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  const { fields, append } = useFieldArray({
    name: "invitations",
    control: form.control,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className={className} {...props}>
          <CardHeader>
            <CardTitle>Invite team members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-x-4 gap-y-2">
              {fields.map((field, index) => {
                return (
                  <FormField
                    control={form.control}
                    key={field.id}
                    name={`invitations.${index}`}
                    render={() => {
                      const onRoleChange = (value: typeof ADMIN_ROLE | typeof MEMBER_ROLE) =>
                        form.setValue(`invitations.${index}.role`, value);
                      const roleValue = form.getValues(`invitations.${index}.role`);

                      return (
                        <div className="flex flex-col gap-4 md:flex-row">
                          <FormItem className="flex-1 md:basis-1/2 lg:basis-2/3">
                            <FormLabel className={classnames(index !== 0 && "sr-only")}>Email address</FormLabel>
                            <FormControl>
                              <Input placeholder="jane@example.com" {...form.register(`invitations.${index}.email`)} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                          <FormItem className="flex-1 md:basis-1/2 lg:basis-1/3">
                            <FormLabel className={classnames(index !== 0 && "sr-only")}>Role</FormLabel>
                            <Select onValueChange={onRoleChange} defaultValue={roleValue}>
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
                        </div>
                      );
                    }}
                  />
                );
              })}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => append({ email: "", role: MEMBER_ROLE })}
            >
              <PlusCircleIcon className="mr-2 h-4 w-4" />
              Add more
            </Button>
          </CardContent>
          <CardFooter>
            <Button size="sm">Invite</Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
