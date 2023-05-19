"use client";

import { AuthenticationForm } from "../authentication-form/authentication-form";

export interface SignUpFormProps {
  className?: string;
}

export function SignUpForm({ className }: SignUpFormProps) {
  return <AuthenticationForm action="/api/sign-up" className={className} />;
}

export default SignUpForm;
