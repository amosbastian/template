import { authenticationSchema } from "../authentication-form/schema";

export async function signIn(formData: FormData) {
  "use server";
  const input = authenticationSchema.parse(formData);
  const { email, password } = input;

  const response = await fetch("http://localhost:4200/api/sign-in", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const json = await response.json();

  console.log(json);
}
