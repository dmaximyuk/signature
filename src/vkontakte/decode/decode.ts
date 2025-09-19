import { createHmac } from "../../utils/crypto.js";

import { type DecodeFunction } from "../../models.js";

export interface Response {
  vk_app_id: number;
  vk_are_notifications_enabled: number;
  vk_is_app_user: number;
  vk_is_favorite: number;
  vk_language: string;
  vk_platform: string;
  vk_ref: string;
  vk_ts: number;
  vk_user_id: number;
}

export const decode: DecodeFunction<Response> = (params) => {
  if (params?.token == null || params.token?.constructor !== String || params?.token?.length < 10) {
    throw new Error("VKontakte Decode need mini app token");
  }

  return (signature) => {
    if (signature == null || signature.constructor !== String) return;

    try {
      const signIndex = signature.lastIndexOf("sign=");
      if (signIndex === -1 || signIndex + 5 >= signature.length) return;

      const sign = signature.slice(signIndex + 5);
      const query = signature.slice(0, signIndex - 1);

      const digest = createHmac("sha256", params.token, query);
      if (sign !== digest) return;

      const result: Partial<Response> = {};
      let keyStart = 0;
      let keyEnd = -1;
      let valueStart = -1;

      for (let i = 0; i <= query.length; i++) {
        const c = i < query.length ? signature.charCodeAt(i) : 38;

        if (c === 61 && keyEnd === -1) {
          keyEnd = i;
          valueStart = i + 1;
        } else if (c === 38) {
          if (keyEnd !== -1) {
            const key = signature.slice(keyStart, keyEnd);
            const value = signature.slice(valueStart, i);
            (result as any)[key] = value.length && !isNaN(value as any) ? +value : value;
          }
          keyStart = i + 1;
          keyEnd = -1;
          valueStart = -1;
        }
      }

      return result as Response;
    } catch {
      return;
    }
  };
};
