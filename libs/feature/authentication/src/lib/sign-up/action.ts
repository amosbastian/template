import { signUpSchema } from "./sign-up-form";

export async function signUp(formData: FormData) {
  "use server";
  const input = signUpSchema.parse(formData);
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
