export const run = (name: string, count: number, fn: () => any) => {
  const startTime = performance.now();
  for (let i = 0; i < count; i++) {
    const data = fn();
    if (count - i <= 1) {
      console.log(data);
    }
  }

  const elapsedMs = performance.now() - startTime;
  console.log(`${name}: ${elapsedMs.toFixed(2)}ms / ${(elapsedMs / count).toFixed(6)}ms`);
};
