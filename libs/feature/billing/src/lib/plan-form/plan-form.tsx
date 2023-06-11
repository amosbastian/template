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
  Skeleton,
} from "@template/ui/web";
import { getPlans } from "@template/utility/payment";
import { api } from "@template/utility/trpc-next-client";
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
  isDisabled?: boolean;
}

export function PlanForm({ defaultValues = {}, plans, isDisabled }: PlanFormProps) {
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
  }

  const filteredPlans = plans.filter((plan) => plan.interval === interval);

  const disabled = isLoading || isDisabled;

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
                  disabled={disabled}
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
        <Button isLoading={isLoading} disabled={disabled} type="submit" size="sm">
          Update
        </Button>
      </form>
    </Form>
  );
}

export function PlanFormLoading() {
  const form = useForm();

  return (
    <Form {...form}>
      <form className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="plan"
          render={() => (
            <FormItem className="space-y-3">
              <FormLabel className="sr-only">Pick a plan</FormLabel>
              <FormControl>
                <RadioGroup disabled className="flex flex-col space-y-1">
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="1" />
                    </FormControl>
                    <FormLabel className="font-normal capitalize">
                      <Skeleton className="h-4 w-[128px]" />
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="2" />
                    </FormControl>
                    <FormLabel className="font-normal capitalize">
                      <Skeleton className="h-4 w-[128px]" />
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="3" />
                    </FormControl>
                    <FormLabel className="font-normal capitalize">
                      <Skeleton className="h-4 w-[128px]" />
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled type="submit" size="sm">
          Update
        </Button>
      </form>
    </Form>
  );
}
