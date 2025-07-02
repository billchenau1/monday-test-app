import mondaySdk, { MondayClientSdk } from "monday-sdk-js";

/**
 * Centralized Monday SDK Service
 * Manages a single SDK instance with proper authentication and configuration
 * Ensures seamless auth context is maintained across all services
 */
class MondaySDKService {
  private static instance: MondaySDKService;
  private sdk: MondayClientSdk;
  private isInitialized: boolean = false;

  private constructor() {
    this.sdk = mondaySdk();
  }

  /**
   * Gets the singleton instance of the Monday SDK service
   * @returns MondaySDKService instance
   */
  public static getInstance(): MondaySDKService {
    if (!MondaySDKService.instance) {
      MondaySDKService.instance = new MondaySDKService();
    }
    return MondaySDKService.instance;
  }

  /**
   * Initializes the SDK with proper configuration
   * Should be called once during app initialization
   */
  public initialize(): void {
    if (this.isInitialized) {
      return;
    }

    try {
      // Remove API version setting as it might interfere with storage authentication
      // The storage API works best with the default/current version
      console.log("Initializing Monday SDK for seamless authentication");
      
      this.isInitialized = true;
    } catch (error) {
      console.error("Error initializing Monday SDK:", error);
    }
  }

  /**
   * Gets the configured Monday SDK instance
   * @returns MondayClientSdk instance
   */
  public getSDK(): MondayClientSdk {
    if (!this.isInitialized) {
      this.initialize();
    }
    return this.sdk;
  }

  /**
   * Sets API version if needed for specific operations
   * @param version - API version string
   */
  public setApiVersion(version: string): void {
    this.sdk.setApiVersion(version);
  }

  /**
   * Resets SDK to default configuration
   */
  public resetToDefault(): void {
    // Remove any API version setting to use default
    this.sdk = mondaySdk();
    this.isInitialized = false;
    this.initialize();
  }

  /**
   * Tests storage authentication by attempting a simple operation
   * @returns Promise<boolean> indicating if storage is properly authenticated
   */
  public async testStorageAuth(): Promise<{ success: boolean; error?: string }> {
    try {
      console.log("Testing storage authentication...");
      const testKey = 'auth_test_key';
      const testValue = 'auth_test_value';
      
      // Try to set a test value
      const setResult = await this.sdk.storage.instance.setItem(testKey, testValue);
      console.log("Storage set test result:", setResult);
      
      // Try to get the test value
      const getResult = await this.sdk.storage.instance.getItem(testKey);
      console.log("Storage get test result:", getResult);
      
      // Clean up test data
      try {
        await this.sdk.storage.instance.deleteItem(testKey);
      } catch (cleanupError) {
        console.warn("Cleanup error (non-critical):", cleanupError);
      }
      
      return { success: true };
    } catch (error: any) {
      console.error("Storage authentication test failed:", error);
      return { 
        success: false, 
        error: error.message || 'Unknown storage authentication error' 
      };
    }
  }
}

// Export singleton instance
export const mondaySDK = MondaySDKService.getInstance();
export default mondaySDK; 