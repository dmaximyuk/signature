import { describe } from "bun:test";

import { decode, encode } from "./index.js";

import { run } from "../utils/index.js";

const { TG_RAW_SECRET } = process.env;

if (!TG_RAW_SECRET) {
  throw 'encode tests need "TG_RAW_SECRET" in ".env"';
}

const initData = encode(TG_RAW_SECRET);
const botToken = "8308844977:AAENPiOxpNizGIWN1_-rdn9tyrfIfDc7fQU";

describe("telegram", () => {
  run("check work encode", 1, () => encode(TG_RAW_SECRET));
  run("decode sign performance", 100_000, () => decode({ token: botToken })(initData));
});
