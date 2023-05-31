import { BASE_URL } from "@template/configuration";
import VerifyEmail from "../VerifyEmail";

export function Preview() {
  return <VerifyEmail name="Amos Bastian" verificationLink={`${BASE_URL}/api/verify-email/abc`} />;
}
