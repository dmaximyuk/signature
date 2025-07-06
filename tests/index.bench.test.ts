import { describe } from "bun:test";
import signature from "../src";

import { vkAuthDefault } from "../src/utils";

const N = 100_000;

function run(name: string, fn: () => any) {
  const t0 = performance.now();
  for (let i = 0; i < N; i++) {
    const data = fn();
    if (N - i <= 1) {
      console.log(data);
    }
  }
  const t1 = performance.now();
  const elapsedMs = t1 - t0;
  console.log(`${name}: ${elapsedMs.toFixed(2)}ms / ${(elapsedMs / N).toFixed(6)}ms`);
}
const { TG_SECRET, TG_SIGN, VK_SECRET, VK_SIGN } = process.env;

if (!TG_SECRET || !TG_SIGN || !VK_SECRET || !VK_SIGN) {
  throw 'Tests need ".env"';
}

describe("benchmark", () => {
  run("TG", () => signature("tg", TG_SIGN || "", TG_SECRET || ""));
  run("VK", () => signature("vk", VK_SIGN || "", VK_SECRET || ""));
  run("VK Default", () => vkAuthDefault(VK_SIGN || "", VK_SECRET || ""));
});
