import { Link } from "lucide-react";
import { signUp } from "./action";
import { zfd } from "zod-form-data";
import { z } from "zod";

export const signUpSchema = zfd.formData({
  email: zfd.text(z.string().email().min(5)),
  password: zfd.text(z.string().min(1)),
});

/* eslint-disable-next-line */
export interface SignUpFormProps {}

export function SignUpForm(props: SignUpFormProps) {
  return (
    <div>
      <h1>Create an account</h1>
      <form action={signUp}>
        <label htmlFor="email">email</label>
        <br />
        <input id="email" type="email" name="email" />
        <br />
        <label htmlFor="password">password</label>
        <br />
        <input type="password" id="password" name="password" />
        <br />
        <input type="submit" value="Sign up" className="button" />
      </form>
      <Link href="/sign-in" className="link">
        Sign in
      </Link>
    </div>
  );
}

export default SignUpForm;
