export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  allows_write_to_pm?: boolean;
  photo_url?: string;
}

export interface DecodeResult {
  userId: number;
  authDate: number;
  queryId: string;
  user: TelegramUser;
}

export interface DecodeOptions {
  token: string;
  maxAge?: number;
}

type DecodeFn = (sig: string | undefined) => DecodeResult | undefined;

const HASH_LEN = 64;

let nodeHmac: typeof import("node:crypto").createHmac;

const getNodeHmac = () => {
  if (!nodeHmac) nodeHmac = require("node:crypto").createHmac;
  return nodeHmac;
};

export const decode = (options: DecodeOptions): DecodeFn => {
  if (!options?.token || typeof options.token !== "string" || options.token.length < 10) {
    throw new Error("Telegram decode requires bot token");
  }

  const hmac = getNodeHmac();
  const secretKey = hmac("sha256", "WebAppData").update(options.token).digest();
  const maxAge = options.maxAge;

  return (sig) => {
    if (!sig || sig.charCodeAt(HASH_LEN) !== 124) return;

    const p2 = sig.indexOf("|", 65);
    if (p2 < 66) return;

    const p3 = sig.indexOf("|", p2 + 1);
    if (p3 < 0) return;

    const p4 = sig.indexOf("|", p3 + 1);
    if (p4 < 0) return;

    const p5 = sig.indexOf("|", p4 + 1);
    if (p5 < 0) return;

    const authDate = +sig.slice(65, p2);
    if (maxAge !== undefined && ((Date.now() / 1000) | 0) - authDate > maxAge) return;

    if (
      sig.slice(0, HASH_LEN) !==
      hmac("sha256", secretKey)
        .update(atob(sig.slice(p5 + 1)))
        .digest("hex")
    )
      return;

    const user = JSON.parse(atob(sig.slice(p4 + 1, p5)));
    if (typeof user?.id !== "number") return;

    try {
      return {
        userId: +sig.slice(p2 + 1, p3),
        authDate,
        queryId: sig.slice(p3 + 1, p4),
        user,
      };
    } catch {
      return;
    }
  };
};
