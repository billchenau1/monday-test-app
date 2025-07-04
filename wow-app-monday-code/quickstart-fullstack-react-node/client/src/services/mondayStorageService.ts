import { MondayClientSdk } from "monday-sdk-js";
import { StorageData } from "../types/monday.types";
import { mondaySDK } from "./mondaySDK";

/**
 * Monday Storage Service
 * Handles all Monday.com storage operations with proper error handling
 * Uses centralized SDK instance to maintain authentication context
 */
export class MondayStorageService {
  private readonly STORAGE_EXAMPLE_KEY = 'my_example_key';
  private monday: MondayClientSdk;

  constructor() {
    // Use centralized SDK instance to maintain authentication context
    this.monday = mondaySDK.getSDK();
  }

  /**
   * Safe wrapper for storage operations
   * @param promise - Storage operation promise
   * @param errorPrefix - Error message prefix
   * @returns Promise<StorageData>
   */
  private async safeStorageCall(promise: Promise<any>, errorPrefix: string = "Storage Error"): Promise<StorageData> {
    try {
      const result = await promise;
      console.log(`${errorPrefix} - Raw result:`, result);
      
      // Handle Monday SDK response structure
      const data = result?.data || result;
      const value = data?.value !== undefined ? data.value : data;
      
      return {
        success: true,
        value: value,
        error: false
      };
    } catch (error: any) {
      console.error(`${errorPrefix}:`, error);
      return {
        error: true,
        message: error?.message || 'Unknown storage error',
        success: false
      };
    }
  }

  /**
   * Gets value from instance storage
   * @param key - Storage key (optional, uses default if not provided)
   * @returns Promise<StorageData>
   */
  async getInstanceStorage(key?: string): Promise<StorageData> {
    const storageKey = key !== undefined ? key : this.STORAGE_EXAMPLE_KEY;
    console.log(`Getting instance storage for key: ${storageKey}`);
    
    return this.safeStorageCall(
      this.monday.storage.instance.getItem(storageKey),
      "Instance Storage Get"
    );
  }

  /**
   * Sets value in instance storage
   * @param value - Value to store
   * @param key - Storage key (optional, uses default if not provided)
   * @returns Promise<StorageData>
   */
  async setInstanceStorage(value: string, key?: string): Promise<StorageData> {
    const storageKey = key !== undefined ? key : this.STORAGE_EXAMPLE_KEY;
    console.log(`Setting instance storage for key: ${storageKey}, value: ${value}`);
    
    return this.safeStorageCall(
      this.monday.storage.instance.setItem(storageKey, value),
      "Instance Storage Set"
    );
  }

  /**
   * Gets value from global storage
   * @param key - Storage key
   * @returns Promise<StorageData>
   */
  async getGlobalStorage(key: string = "globalTestKey"): Promise<StorageData> {
    return this.safeStorageCall(
      this.monday.storage.getItem(key),
      "Global Storage Get"
    );
  }

  /**
   * Sets value in global storage
   * @param value - Value to store
   * @param key - Storage key
   * @returns Promise<StorageData>
   */
  async setGlobalStorage(value: string, key: string = "globalTestKey"): Promise<StorageData> {
    return this.safeStorageCall(
      this.monday.storage.setItem(key, value),
      "Global Storage Set"
    );
  }

  /**
   * Gets value from user storage (if available)
   * @param key - Storage key
   * @returns Promise<StorageData>
   */
  async getUserStorage(key: string = "userTestKey"): Promise<StorageData> {
    try {
      return this.safeStorageCall(
        this.monday.storage.getItem(key),
        "User Storage Get"
      );
    } catch (error) {
      return {
        error: true,
        message: "User storage not available in this SDK version",
        success: false
      };
    }
  }

  /**
   * Sets value in user storage (if available)
   * @param value - Value to store
   * @param key - Storage key
   * @returns Promise<StorageData>
   */
  async setUserStorage(value: string, key: string = "userTestKey"): Promise<StorageData> {
    try {
      return this.safeStorageCall(
        this.monday.storage.setItem(key, value),
        "User Storage Set"
      );
    } catch (error) {
      return {
        error: true,
        message: "User storage not available in this SDK version",
        success: false
      };
    }
  }

  /**
   * Initializes storage with example text
   * @param text - Text to store
   * @returns Promise<StorageData>
   */
  async initializeExampleStorage(text: string): Promise<StorageData> {
    return this.setInstanceStorage(text);
  }

  /**
   * Gets the example storage text
   * @returns Promise<StorageData>
   */
  async getExampleStorage(): Promise<StorageData> {
    return this.getInstanceStorage();
  }
}

// Export singleton instance
export const mondayStorageService = new MondayStorageService(); 