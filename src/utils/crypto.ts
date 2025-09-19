// Универсальная функция для создания HMAC, работающая в Node.js и браузере
export function createHmac(algorithm: string, key: string | Buffer, data: string | Buffer): string {
  // Проверяем, находимся ли мы в браузере
  if (typeof window !== 'undefined' && typeof window.crypto !== 'undefined') {
    // Для браузера выбрасываем ошибку, так как синхронная версия недоступна
    throw new Error('Synchronous HMAC is not available in browser environment. Use Web Crypto API instead.');
  } else {
    // Node.js версия
    const { createHmac: nodeCreateHmac } = require('node:crypto');
    return nodeCreateHmac(algorithm, key).update(data).digest('hex');
  }
}

// Асинхронная версия для браузера
export async function createHmacAsync(algorithm: string, key: string | Buffer, data: string | Buffer): Promise<string> {
  // Проверяем, находимся ли мы в браузере
  if (typeof window !== 'undefined' && typeof window.crypto !== 'undefined') {
    // Браузерная версия с Web Crypto API
    const encoder = new TextEncoder();
    const keyData = encoder.encode(typeof key === 'string' ? key : key.toString());
    const dataToSign = encoder.encode(typeof data === 'string' ? data : data.toString());
    
    const cryptoKey = await window.crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    
    const signature = await window.crypto.subtle.sign('HMAC', cryptoKey, dataToSign);
    return btoa(String.fromCharCode(...new Uint8Array(signature)));
  } else {
    // Node.js версия
    const { createHmac: nodeCreateHmac } = await import('node:crypto');
    return nodeCreateHmac(algorithm, key).update(data).digest('base64');
  }
}
