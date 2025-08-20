import { describe } from "bun:test";

import { decode } from "./decode";
import { encode } from "../encode/encode";

import { run } from "../../utils";

const { TG_RAW_SECRET } = process.env;

if (!TG_RAW_SECRET) {
  throw 'encode tests need "TG_RAW_SECRET" in ".env"';
}

const botToken = "8308844977:AAENPiOxpNizGIWN1_-rdn9tyrfIfDc7fQU";
const initData = encode(TG_RAW_SECRET);

describe("telegram", () => {
  run("decode sign performance", 100_000, () => decode({ botToken: botToken }, initData));
});
