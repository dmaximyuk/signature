import { describe, expect, test } from "bun:test";

import { decode, encode } from "./index.js";

import { run } from "../utils/index.js";

const { VK_RAW_SECRET, VK_APP_TOKEN } = process.env;

if (!VK_RAW_SECRET || !VK_APP_TOKEN) {
  console.warn('VK tests skipped: need "VK_RAW_SECRET" and "VK_APP_TOKEN" in ".env"');
} else {
  const launchParams = encode(VK_RAW_SECRET)!;
  const appToken = VK_APP_TOKEN;

  describe("vkontakte", () => {
    test("encode creates valid signature", () => {
      expect(launchParams).toBeDefined();
      expect(typeof launchParams).toBe("string");
      expect(launchParams.length).toBeGreaterThan(10);
    });

    test("decode returns full user data", () => {
      const validator = decode({ token: appToken });
      const result = validator(launchParams);

      expect(result).toBeDefined();
      expect(result?.userId).toBeGreaterThan(0);
      expect(result?.params).toBeDefined();
      expect(result?.params.vk_user_id).toBe(result?.userId);
    });

    test("decode rejects invalid signature", () => {
      const validator = decode({ token: appToken });
      expect(validator("invalid")).toBeUndefined();
    });

    test("decode rejects tampered data", () => {
      const validator = decode({ token: appToken });
      const tampered = "fake_sign|123|456|ZmFrZQ==";
      expect(validator(tampered)).toBeUndefined();
    });

    test("decode rejects wrong token", () => {
      const validator = decode({ token: "wrong_token_12345" });
      expect(validator(launchParams)).toBeUndefined();
    });

    describe("performance", () => {
      test("encode", () => {
        run({ name: "encode", count: 10_000, fn: () => encode(VK_RAW_SECRET) });
      });

      test("decode", () => {
        const decodeFn = decode({ token: appToken });
        run({ name: "decode", count: 100_000, fn: () => decodeFn(launchParams) });
      });
    });
  });
}
