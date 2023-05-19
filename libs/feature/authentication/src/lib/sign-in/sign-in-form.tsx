"use client";

import { AuthenticationForm } from "../authentication-form/authentication-form";

export interface SignInFormProps {
  className?: string;
}

export function SignInForm({ className }: SignInFormProps) {
  return <AuthenticationForm action="/api/sign-in" className={className} />;
}

export default SignInForm;
