import { tgAuth, vkAuth } from "./utils";
import type { TgUserData, VkUserData } from "./models";

const formatMessage = (msg: string): string => `[ERROR] ${new Date().toISOString()} - ${msg}`;

type AppType = "vk" | "tg";

type UserDataMap = {
  vk: VkUserData;
  tg: TgUserData;
};

type SignResponse<T> = T | false;

function signature<T extends AppType>(
  type: T,
  sign: string,
  secret: string
): SignResponse<UserDataMap[T]> {
  const handlers: Record<AppType, () => UserDataMap[AppType] | undefined> = {
    vk: () => vkAuth(sign, secret),
    tg: () => tgAuth(sign, secret),
  };

  try {
    const data = handlers[type]?.();
    if (!data) throw new Error(`${type} data is invalid: ${data}`);
    return data as UserDataMap[T];
  } catch (e) {
    const msg =
      e instanceof Error ? e.message : typeof e === "object" ? JSON.stringify(e) : String(e);
    console.error(formatMessage(msg));
  }

  return false;
}

export default signature;
export type { TgUserData, VkUserData };
