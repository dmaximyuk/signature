import { createHmac } from "crypto";
import { VkUserData } from "../models";

function vkAuth(params: string, secret: string): VkUserData | undefined {
  try {
    const signIndex = params.lastIndexOf("sign=");
    if (signIndex === -1 || signIndex + 5 >= params.length) return;

    const sign = params.slice(signIndex + 5);
    const query = params.slice(0, signIndex - 1);

    const digest = createHmac("sha256", secret).update(query).digest("base64url");
    if (sign !== digest) return;

    const result: Partial<VkUserData> = {};
    let keyStart = 0;
    let keyEnd = -1;
    let valueStart = -1;

    for (let i = 0; i <= query.length; i++) {
      const c = i < query.length ? params.charCodeAt(i) : 38;

      if (c === 61 && keyEnd === -1) {
        keyEnd = i;
        valueStart = i + 1;
      } else if (c === 38) {
        if (keyEnd !== -1) {
          const key = params.slice(keyStart, keyEnd);
          const value = params.slice(valueStart, i);
          (result as any)[key] = value.length && !isNaN(value as any) ? +value : value;
        }
        keyStart = i + 1;
        keyEnd = -1;
        valueStart = -1;
      }
    }

    return result as VkUserData;
  } catch {
    return;
  }
}

export default vkAuth;
