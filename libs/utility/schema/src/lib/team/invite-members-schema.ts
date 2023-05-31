import { ROLES } from "@template/configuration";
import * as z from "zod";

export const inviteMembersSchema = z.object({
  teamSlug: z.string().min(1),
  invitations: z.array(
    z.object({
      email: z.string().email({ message: "Please enter a valid email address" }),
      role: z.enum(ROLES),
    }),
  ),
});
