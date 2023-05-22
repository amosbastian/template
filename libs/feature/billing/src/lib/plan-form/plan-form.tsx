"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  RadioGroup,
  RadioGroupItem,
} from "@template/ui/web";
import { getPlans } from "@template/utility/payment";
import { api } from "@template/utility/trpc-next-client";
import * as React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  plan: z.string({
    required_error: "You need to select a plan",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface PlanFormProps {
  defaultValues?: Partial<FormValues>;
  plans: Awaited<ReturnType<typeof getPlans>>;
}

export function PlanForm({ defaultValues = {}, plans }: PlanFormProps) {
  console.log({ defaultValues });
  const interval = "month";

  const { mutate, isLoading } = api.billing.checkout.useMutation({
    onSuccess: (data) => {
      const url = new URL(data.data.attributes.url);

      window.open(url);
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const plan = plans.find((plan) => plan.interval === interval && plan.productSlug === data.plan);

    if (plan) {
      mutate({ variant: plan.variantSlug });
    }
    // toast({
    //   title: "You submitted the following values:",
    //   description: (
    //     <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
    //       <code className="text-white">{JSON.stringify(data, null, 2)}</code>
    //     </pre>
    //   ),
    // });
  }

  const filteredPlans = plans.filter((plan) => plan.interval === interval);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="plan"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="sr-only">Pick a plan</FormLabel>
              <FormControl>
                <RadioGroup
                  disabled={isLoading}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  {filteredPlans.map((plan) => {
                    return (
                      <FormItem key={plan.productId} className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value={plan.productSlug} />
                        </FormControl>
                        <FormLabel className="font-normal capitalize">{plan.productSlug}</FormLabel>
                      </FormItem>
                    );
                  })}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button isLoading={isLoading} type="submit" size="sm">
          Update
        </Button>
      </form>
    </Form>
  );
}
