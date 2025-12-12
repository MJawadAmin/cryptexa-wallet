interface StorageData {
  [key: string]: any;
}

export class StorageService {
  /**
   * Save data to Chrome storage
   */
  static async set(key: string, value: any): Promise<void> {
    return new Promise((resolve, reject) => {
      chrome.storage.local.set({ [key]: value }, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      });
    });
  }

  /**
   * Get data from Chrome storage
   */
  static async get<T>(key: string): Promise<T | null> {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get([key], (result) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(result[key] || null);
        }
      });
    });
  }

  /**
   * Remove data from Chrome storage
   */
  static async remove(key: string): Promise<void> {
    return new Promise((resolve, reject) => {
      chrome.storage.local.remove([key], () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      });
    });
  }

  /**
   * Clear all storage
   */
  static async clear(): Promise<void> {
    return new Promise((resolve, reject) => {
      chrome.storage.local.clear(() => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      });
    });
  }

  /**
   * Get all storage data
   */
  static async getAll(): Promise<StorageData> {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(null, (items) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(items);
        }
      });
    });
  }

  /**
   * Check if key exists
   */
  static async has(key: string): Promise<boolean> {
    const value = await this.get(key);
    return value !== null;
  }
}
