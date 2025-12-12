import CryptoJS from 'crypto-js';

export class EncryptionService {
  /**
   * Encrypt data with AES-256
   */
  static encrypt(data: string, password: string): string {
    return CryptoJS.AES.encrypt(data, password).toString();
  }

  /**
   * Decrypt AES-256 encrypted data
   */
  static decrypt(encryptedData: string, password: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedData, password);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  /**
   * Hash password with SHA-256
   */
  static hashPassword(password: string): string {
    return CryptoJS.SHA256(password).toString();
  }

  /**
   * Generate random salt
   */
  static generateSalt(): string {
    return CryptoJS.lib.WordArray.random(128 / 8).toString();
  }

  /**
   * Derive key from password with PBKDF2
   */
  static deriveKey(password: string, salt: string, iterations: number = 10000): string {
    return CryptoJS.PBKDF2(password, salt, {
      keySize: 256 / 32,
      iterations
    }).toString();
  }
}
