import * as CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.ID_SECRET_KEY || 'my_ultra_secret_key';

export const encryptId = (id: number): string => {
  const encrypted = CryptoJS.AES.encrypt(id.toString(), SECRET_KEY).toString();

  return encodeURIComponent(encrypted);
};

export const decryptId = (encryptedId: string): number => {
  const decoded = decodeURIComponent(encryptedId);

  const bytes = CryptoJS.AES.decrypt(decoded, SECRET_KEY);

  const decrypted = bytes.toString(CryptoJS.enc.Utf8);

  return parseInt(decrypted, 10);
};
