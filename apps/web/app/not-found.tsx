import { getAuthentication } from "@template/authentication";
import { Button, SignOutButton } from "@template/ui/web";
import Link from "next/link";

export default async function NotFound() {
  const { user } = await getAuthentication();

  return (
    <main className="grid min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-base font-semibold text-indigo-600 dark:text-indigo-500">404</p>
        <h1 className="text-foreground mt-4 text-3xl font-bold tracking-tight sm:text-5xl">Page not found</h1>
        <p className="text-muted-foreground mt-6 text-base leading-7">
          {user ? `You are logged in as ${user.email}` : "Sorry, we couldn't find the page you're looking for."}
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          {user ? (
            <SignOutButton>Sign in as a different user</SignOutButton>
          ) : (
            <Link href="/">
              <Button>Go back home</Button>
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
