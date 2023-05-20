"use client";

import { Team } from "@template/db";
import { classnames } from "@template/utility/shared";
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../avatar/avatar";
import { Button } from "../button/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../command/command";
import { Popover, PopoverContent, PopoverTrigger } from "../popover/popover";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>;
type TeamSwitcherTeam = Pick<Team, "id" | "name">;

type TeamSwitcherProps = {
  activeTeam: TeamSwitcherTeam;
  teams?: TeamSwitcherTeam[];
} & PopoverTriggerProps;

export function TeamSwitcher({ activeTeam, className, teams = [] }: TeamSwitcherProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedTeam, setSelectedTeam] = React.useState<TeamSwitcherTeam>(activeTeam);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a team"
          className={classnames("w-[200px] justify-between", className)}
        >
          <Avatar className="mr-2 h-5 w-5">
            <AvatarImage src={`https://avatar.vercel.sh/random.png`} alt={selectedTeam.name} />
            <AvatarFallback>SC</AvatarFallback>
          </Avatar>
          {selectedTeam.name}
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search team..." />
            <CommandEmpty>No team found.</CommandEmpty>
            <CommandGroup heading="Teams">
              {[activeTeam, ...teams].map((team) => (
                <CommandItem
                  key={team.id}
                  onSelect={() => {
                    setSelectedTeam(team);
                    setOpen(false);
                  }}
                  className="text-sm"
                >
                  <Avatar className="mr-2 h-5 w-5">
                    <AvatarImage src={`https://avatar.vercel.sh/random.png`} alt={team.name} />
                    <AvatarFallback>SC</AvatarFallback>
                  </Avatar>
                  {team.name}
                  <Check
                    className={classnames("ml-auto h-4 w-4", selectedTeam.id === team.id ? "opacity-100" : "opacity-0")}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <Link href="/dashboard/team/create">
                <CommandItem>
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Create team
                </CommandItem>
              </Link>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
