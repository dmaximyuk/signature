import { type PackData } from "../models";
import { type EncodeFunction } from "../../models";

export const encode: EncodeFunction = (rawInitData) => {
  if (typeof rawInitData !== "string") return;

  try {
    const params = new URLSearchParams(rawInitData);

    const hash = params.get("hash") || "";
    const authDate = Number(params.get("auth_date")) || 0;
    const queryId = params.get("query_id") || "";
    const user = params.get("user") || "{}";
    const data = Array.from(params.entries())
      .filter(([key]) => key !== "hash")
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}=${v}`)
      .join("\n");

    return btoa(
      JSON.stringify({
        q: queryId,
        a: authDate,
        h: hash,
        d: data,
        u: JSON.parse(user),
      } as PackData<any>)
    );
  } catch {
    return;
  }
};
