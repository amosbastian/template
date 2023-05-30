import { BASE_URL } from "@template/configuration";
import VerifyEmail from "../VerifyEmail";

export function Preview() {
  return <VerifyEmail username="amosbastian" verificationLink={`${BASE_URL}/api/verify-email/abc`} />;
}
