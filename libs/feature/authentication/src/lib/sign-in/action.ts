import { signInSchema } from "./sign-in-form";

export async function signIn(formData: FormData) {
  "use server";
  const input = signInSchema.parse(formData);
  const { email, password } = input;

  const response = await fetch("http://localhost:4200/api/register", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const json = await response.json();

  console.log(json);
}