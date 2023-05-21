import { client } from "../client";

export async function getProducts() {
  return client.listAllProducts();
}
