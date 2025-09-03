// Фронтенд версия - все функции (encode + decode для тестирования)
export { encode, decode } from "./telegram/index.js";
export { decode as vkDecode } from "./vkontakte/index.js";
export { type Response as TelegramResponse } from "./telegram/decode/decode.js";
export { type Response as VKResponse } from "./vkontakte/decode/decode.js";
