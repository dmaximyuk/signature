export const encode = (rawInitData: unknown): string | undefined => {
  if (typeof rawInitData !== "string") return;

  try {
    const params = new URLSearchParams(rawInitData);

    const hash = params.get("hash");
    if (!hash) return;

    const authDate = params.get("auth_date") || "0";
    const queryId = params.get("query_id") || "";
    const userRaw = params.get("user") || "{}";

    let userId = "0";
    const idMatch = userRaw.match(/"id"\s*:\s*(\d+)/);
    if (idMatch) userId = idMatch[1];

    const entries: string[] = [];
    params.forEach((v, k) => {
      if (k !== "hash") entries.push(`${k}=${v}`);
    });
    entries.sort();

    return `${hash}|${authDate}|${userId}|${queryId}|${btoa(userRaw)}|${btoa(entries.join("\n"))}`;
  } catch {
    return;
  }
};
