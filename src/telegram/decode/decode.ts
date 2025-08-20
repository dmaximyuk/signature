import { createHmac } from "crypto";

import { type PackData } from "../models";
import { type DecodeFunction } from "../../models";

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

    const secretKey = createHmac("sha256", "WebAppData").update(params.token).digest();
    const computed = createHmac("sha256", secretKey).update(data).digest("hex");

    if (hash === computed) {
      return {
        queryId,
        authDate,
        user,
      } as unknown as Response;
    }

    return;
  } catch {
    return;
  }
};
