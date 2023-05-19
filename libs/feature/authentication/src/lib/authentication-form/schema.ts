import { z } from "zod";
import { zfd } from "zod-form-data";

export const authenticationSchema = zfd.formData({
  email: zfd.text(z.string().email().min(5)),
  password: zfd.text(z.string().min(1)),
});
