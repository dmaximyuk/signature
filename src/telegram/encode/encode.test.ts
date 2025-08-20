import { describe } from "bun:test";

import { encode } from "./encode";

import { run } from "../../utils";

const { TG_RAW_SECRET } = process.env;

if (!TG_RAW_SECRET) {
  throw 'encode tests need "TG_RAW_SECRET" in ".env"';
}

describe("telegram", () => {
  run("encode sign performance", 100_000, () => encode(TG_RAW_SECRET));
});
