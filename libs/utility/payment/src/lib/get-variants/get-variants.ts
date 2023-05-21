import { client } from "../client";

export async function getVariants() {
  return client.listAllVariants();
}
