export {
  decode as telegramDecode,
  encode as telegramEncode,
  type DecodeOptions as TelegramDecodeOptions,
  type DecodeResult as TelegramDecodeResult,
  type TelegramUser,
} from "./telegram/index.js";
export {
  decode as vkontakteDecode,
  encode as vkontakteEncode,
  type DecodeOptions as VKontakteDecodeOptions,
  type DecodeResult as VKontakteDecodeResult,
  type VKontakteUser,
} from "./vkontakte/index.js";
