import { getAuthentication } from "@template/authentication";
import { db, keys } from "@template/db";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@template/ui/web";
import { eq } from "drizzle-orm";
import { UserIcon } from "lucide-react";
import { RemoveConnectedAccount } from "../remove-connected-account/remove-connected-account";
import { AddConnectedAccount } from "../add-connected-account/add-connected-account";

type ConnectedAccountsProps = {
  className?: string;
};

export async function ConnectedAccounts({ className }: ConnectedAccountsProps) {
  const { user } = await getAuthentication();

  if (!user) {
    return null;
  }

  const userKeys = await db.query.keys.findMany({
    where: eq(keys.userId, user.id),
  });

  const providers = userKeys.map((key) => key.id.split(":")[0]);

  return (
    <div className={className}>
      <Accordion type="single" collapsible>
        {userKeys.map((key) => {
          const provider = key.id.split(":")[0];

          if (provider === "github") {
            // @ts-expect-error: RSC
            return <GithubAccordion key={key.id} id={key.id} />;
          }

          if (provider === "email") {
            // @ts-expect-error: RSC
            return <EmailAccordion key={key.id} id={key.id} />;
          }

          return null;
        })}
      </Accordion>
      <AddConnectedAccount providers={providers} />
    </div>
  );
}

interface ProviderAccordionProps {
  id: string;
}

const EmailAccordion = async ({ id }: ProviderAccordionProps) => {
  const { user } = await getAuthentication();

  const keyId = id.split(":")[1];

  return (
    <AccordionItem value="email">
      <AccordionTrigger>Email ({keyId})</AccordionTrigger>
      <AccordionContent>
        <div className="flex flex-row items-center gap-x-2">
          <Avatar className="h-8 w-8">
            {user.image ? (
              <div className="bg-gray-3 aspect-square h-full w-full">
                <AvatarImage className="bg-gray-3" alt="GitHub profile picture" src={user.image} />
              </div>
            ) : (
              <AvatarFallback>
                <span className="sr-only">{user.name}</span>
                <UserIcon className="h-6 w-6" />
              </AvatarFallback>
            )}
          </Avatar>
          <div>
            <p className="text-foreground text-sm">{user.name}</p>
            <p className="text-muted-foreground text-sm">{id}</p>
          </div>
        </div>
        <RemoveConnectedAccount id={id} />
      </AccordionContent>
    </AccordionItem>
  );
};

type GithubAccount = {
  login: string;
  avatar_url: string;
  name: string;
};

const GithubAccordion = async ({ id }: ProviderAccordionProps) => {
  const { user } = await getAuthentication();

  const keyId = id.split(":")[1];
  const response = await fetch(`https://api.github.com/user/${keyId}`);
  const githubAccount: GithubAccount = await response.json();

  return (
    <AccordionItem value="github">
      <AccordionTrigger>GitHub {`${githubAccount.login ? `(${githubAccount.login})` : ""}`}</AccordionTrigger>
      <AccordionContent>
        <div className="flex flex-row items-center gap-x-2">
          <Avatar className="h-8 w-8">
            {githubAccount.avatar_url || user.image ? (
              <div className="bg-gray-3 aspect-square h-full w-full">
                <AvatarImage
                  className="bg-gray-3"
                  alt="GitHub profile picture"
                  src={githubAccount.avatar_url || user.image}
                />
              </div>
            ) : (
              <AvatarFallback>
                <span className="sr-only">{githubAccount.name}</span>
                <UserIcon className="h-6 w-6" />
              </AvatarFallback>
            )}
          </Avatar>
          <div>
            <p className="text-foreground text-sm">{githubAccount.name || user.name}</p>
            <p className="text-muted-foreground text-sm">{githubAccount.login}</p>
          </div>
        </div>
        <RemoveConnectedAccount id={id} />
      </AccordionContent>
    </AccordionItem>
  );
};
