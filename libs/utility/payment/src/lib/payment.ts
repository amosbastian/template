import { LemonsqueezyClient } from "lemonsqueezy.ts";

const client = new LemonsqueezyClient(process.env["LEMON_SQUEEZY_API_KEY"] ?? "");
