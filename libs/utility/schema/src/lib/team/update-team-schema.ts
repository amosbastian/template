import * as z from "zod";

export const updateTeamSchema = z.object({
  id: z.number(),
  name: z.string().min(1),
  image: z.string().nullish(),
});
