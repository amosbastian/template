"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Team } from "@template/db";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@template/ui/web";
import { classnames } from "@template/utility/shared";
import { api } from "@template/utility/trpc-next-client";
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>;
type TeamSwitcherTeam = Pick<Team, "id" | "name">;

const formSchema = z.object({
  name: z.string().min(2).max(50),
});

type TeamSwitcherProps = {
  activeTeam: TeamSwitcherTeam;
  teams?: TeamSwitcherTeam[];
} & PopoverTriggerProps;

export function TeamSwitcher({ activeTeam, className, teams = [] }: TeamSwitcherProps) {
  const [open, setOpen] = React.useState(false);
  const [showNewTeamDialog, setShowNewTeamDialog] = React.useState(false);
  const router = useRouter();

  const { mutate: updateUser, isLoading: isUpdatingUser } = api.user.changeTeam.useMutation({
    onSuccess: (team) => {
      setShowNewTeamDialog(false);
      router.push(`/${team?.slug}/dashboard`);
    },
  });

  const { mutate: createTeam, isLoading: isCreatingTeam } = api.team.create.useMutation({
    onSuccess: (data) => {
      updateUser({ activeTeamId: data.insertId });
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    createTeam({
      name: values.name,
    });
  }

  const isLoading = isCreatingTeam || isUpdatingUser;

  return (
    <Dialog open={showNewTeamDialog} onOpenChange={setShowNewTeamDialog}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a team"
            className={classnames("w-[200px] justify-between truncate", className)}
          >
            <Avatar className="mr-2 h-5 w-5">
              <AvatarImage src={`https://avatar.vercel.sh/random.png`} alt={activeTeam.name} />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
            <p className="truncate">{activeTeam.name}</p>
            <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandList>
              <CommandInput placeholder="Search team..." />
              <CommandEmpty>No team found.</CommandEmpty>
              <CommandGroup heading="Teams">
                {teams.map((team) => (
                  <CommandItem
                    key={team.id}
                    onSelect={() => {
                      updateUser({ activeTeamId: team.id });
                    }}
                    className="text-sm"
                  >
                    <Avatar className="mr-2 h-5 w-5">
                      <AvatarImage src={`https://avatar.vercel.sh/random.png`} alt={team.name} />
                      <AvatarFallback>SC</AvatarFallback>
                    </Avatar>
                    {team.name}
                    <Check
                      className={classnames("ml-auto h-4 w-4", activeTeam.id === team.id ? "opacity-100" : "opacity-0")}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <DialogTrigger asChild>
                  <CommandItem
                    onSelect={() => {
                      setOpen(false);
                      setShowNewTeamDialog(true);
                    }}
                  >
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Create Team
                  </CommandItem>
                </DialogTrigger>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Form {...form}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create team</DialogTitle>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input disabled={isLoading} placeholder="My team" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button disabled={isLoading} size="sm" variant="outline" onClick={() => setShowNewTeamDialog(false)}>
                Cancel
              </Button>
              <Button size="sm" type="submit" isLoading={isLoading}>
                Create
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Form>
    </Dialog>
  );
}
