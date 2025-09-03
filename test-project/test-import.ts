// Тест импорта библиотеки с TypeScript
import { decode as telegramDecode, encode as telegramEncode, type TelegramResponse } from '@dmaximyuk/signature/telegram';
import { decode as vkDecode, type VKResponse } from '@dmaximyuk/signature/vkontakte';

console.log('=== Тест импорта библиотеки с TypeScript ===');

// Проверяем типы
const telegramParams = { token: 'test-token' };
const telegramSignature = 'test-signature';

const telegramResult: TelegramResponse | undefined = telegramDecode(telegramParams, telegramSignature);
console.log('Telegram decode with types:', telegramResult);

const vkParams = { token: 'test-vk-token' };
const vkSignature = 'test-vk-signature';

const vkResult: VKResponse | undefined = vkDecode(vkParams, vkSignature);
console.log('VK decode with types:', vkResult);

console.log('=== TypeScript тест завершен ===');
