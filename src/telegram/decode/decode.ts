import { createHmac } from "../../utils/crypto.js";

import { type DecodeFunction } from "../../models.js";
import { type PackData } from "../models.js";

export interface Response {
  queryId: string;
  authDate: number;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    username: string;
    language_code: string;
    is_premium: boolean;
    allows_write_to_pm: boolean;
    photo_url: string;
  };
}

export const decode: DecodeFunction<Response> = (params, signature) => {
  if (typeof window !== "undefined" && typeof window.crypto !== "undefined") {
    console.warn("Telegram decode in browser: signature verification skipped (for testing only)");
  }

  if (signature == null || signature.constructor !== String) return;

  try {
    const parsed = JSON.parse(atob(signature)) as PackData<Response>;
    if (parsed == null) return;

    const hash = parsed.h;
    const data = parsed.d;
    const user = parsed.u;
    const authDate = parsed.a;
    const queryId = parsed.q;

    if (!(hash && data && user && authDate)) return;

    const secretKey = createHmac("sha256", "WebAppData", params.token);
    const computed = createHmac("sha256", secretKey, data);

    if (hash !== computed) return;

    return {
      queryId,
      authDate,
      user,
    } as unknown as Response;
  } catch {
    return;
  }
};
