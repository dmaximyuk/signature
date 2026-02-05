import { describe, expect, test } from "bun:test";

import { decode, encode } from "./index.js";

import { run } from "../utils/index.js";

const { TG_RAW_SECRET, TG_BOT_TOKEN } = process.env;

if (!TG_RAW_SECRET || !TG_BOT_TOKEN) {
  throw 'Tests need "TG_RAW_SECRET" and "TG_BOT_TOKEN" in ".env"';
}

const initData = encode(TG_RAW_SECRET)!;
const botToken = TG_BOT_TOKEN;

describe("telegram", () => {
  test("encode creates valid signature", () => {
    expect(initData).toBeDefined();
    expect(typeof initData).toBe("string");
    expect(initData.length).toBeGreaterThan(10);
  });

  test("decode returns full user data", () => {
    const validator = decode({ token: botToken });
    const result = validator(initData);

    expect(result).toBeDefined();
    if (!result) return;
    expect(result.userId).toBeGreaterThan(0);
    expect(result.user).toBeDefined();
    expect(result.user.id).toBe(result.userId);
  });

  test("decode rejects invalid signature", () => {
    const validator = decode({ token: botToken });
    expect(validator("invalid")).toBeUndefined();
  });

  test("decode rejects tampered data", () => {
    const validator = decode({ token: botToken });
    const tampered = "a".repeat(64) + "|123|456||dXNlcg==|ZGF0YQ==";
    expect(validator(tampered)).toBeUndefined();
  });

  test("decode rejects wrong token", () => {
    const validator = decode({ token: "wrong_token_12345" });
    expect(validator(initData)).toBeUndefined();
  });

  describe("performance", () => {
    test("encode", () => {
      run({ name: "encode", count: 10_000, fn: () => encode(TG_RAW_SECRET) });
    });

    test("decode", () => {
      const decodeFn = decode({ token: botToken });
      run({ name: "decode", count: 100_000, fn: () => decodeFn(initData) });
    });
  });
});
