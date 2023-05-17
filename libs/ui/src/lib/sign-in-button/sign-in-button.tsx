"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "../button/button";

export const SignInButton = () => {
  return (
    <Button onClick={() => console.log("Sign in")}>
      Sign in
      <ArrowRight className="-mr-1 h-4" />
    </Button>
  );
};
