export const encode = (launchParams: unknown): string | undefined => {
  if (typeof launchParams !== "string") return;

  try {
    const signIndex = launchParams.lastIndexOf("&sign=");
    if (signIndex === -1) return;

    const sign = launchParams.slice(signIndex + 6);
    const query = launchParams.slice(0, signIndex);

    let userId = "0";
    let ts = "0";

    const userMatch = launchParams.match(/vk_user_id=(\d+)/);
    if (userMatch) userId = userMatch[1];

    const tsMatch = launchParams.match(/vk_ts=(\d+)/);
    if (tsMatch) ts = tsMatch[1];

    return `${sign}|${userId}|${ts}|${btoa(query)}`;
  } catch {
    return;
  }
};
