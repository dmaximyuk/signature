import { createHmac } from "crypto";
import { unpack } from "msgpackr";

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

// const SECRET_KEY_CACHE = new Map<string, Buffer>();

export const decode: DecodeFunction<Response> = (params, signature) => {
  if (signature == null || signature.constructor !== String) return;

  try {
    const parsed = unpack(Buffer.from(signature, "base64url")) as PackData<Response>;
    if (parsed == null) return;

    const hash = parsed.h as Buffer;
    const data = parsed.d as string | Buffer;
    const user = parsed.u;
    const authDate = parsed.a as number;
    const queryId = parsed.q as string;

    if (!(hash && data && user && authDate)) return;

    // let secretKey = SECRET_KEY_CACHE.get(params.botToken);
    // if (!secretKey) {
    //   secretKey = createHmac("sha256", "WebAppData").update(params.botToken).digest();
    //   SECRET_KEY_CACHE.set(params.botToken, secretKey);
    // }
    const secretKey = createHmac("sha256", "WebAppData").update(params.botToken).digest();
    const computed = createHmac("sha256", secretKey).update(data).digest();

    if (hash.constructor !== Buffer || hash.length !== computed.length) return;
    for (let i = 0; i < hash.length; i++) {
      if (hash[i] !== computed[i]) return;
    }

    return {
      queryId,
      authDate,
      user: user,
    };
  } catch {
    return;
  }
};
