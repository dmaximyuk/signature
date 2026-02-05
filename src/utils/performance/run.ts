export interface RunOptions {
  name: string;
  count: number;
  fn: () => unknown;
  warmup?: number;
}

export const run = (nameOrOptions: string | RunOptions, count?: number, fn?: () => unknown) => {
  const opts: RunOptions =
    typeof nameOrOptions === "string"
      ? { name: nameOrOptions, count: count!, fn: fn! }
      : nameOrOptions;

  const { name, count: n, fn: runFn, warmup = 0 } = opts;

  for (let i = 0; i < warmup; i++) runFn();

  const start = performance.now();
  for (let i = 0; i < n; i++) runFn();
  const elapsedMs = performance.now() - start;

  const msPerOp = elapsedMs / n;
  const opsPerSec = n / (elapsedMs / 1000);
  console.log(
    `[perf] ${name}: ${elapsedMs.toFixed(2)}ms total, ${msPerOp.toFixed(4)}ms/op, ${opsPerSec.toFixed(0)} ops/s (n=${n})`
  );
};
