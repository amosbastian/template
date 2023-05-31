import { z } from "zod";

export const authenticationSchema = z.object({
  email: z.string().email().min(5),
  password: z.string().min(1),
  token: z.string().nullish(),
});
