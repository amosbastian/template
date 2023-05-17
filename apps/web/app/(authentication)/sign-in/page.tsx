import { BRAND_NAME } from "@template/configuration";
import { SignInForm } from "@template/feature/authentication/server";
import { Logo, buttonVariants } from "@template/ui";
import { classnames } from "@template/utility";
import { ChevronLeft } from "lucide-react";
import { type Metadata } from "next";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link
        href="/"
        className={classnames(buttonVariants({ variant: "ghost" }), "absolute left-4 top-4 md:left-8 md:top-8")}
      >
        <>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </>
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[420px]">
        <div className="flex flex-col space-y-2 text-center">
          <Logo className="mx-auto h-6" />
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Sign up for {BRAND_NAME}</h1>
        </div>
        <SignInForm />
        <p className="text-muted-foreground px-8 text-center text-sm">
          <Link href="/sign-up" className="hover:text-brand underline underline-offset-4">
            Don&apos;t have an account? Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export const metadata: Metadata = {
  title: {
    default: `Sign in`,
    template: `%s | ${BRAND_NAME}`,
  },
};
