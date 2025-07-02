import { useState, useEffect, useCallback } from 'react';
import { MondayClientSdk } from "monday-sdk-js";
import { AppState, MondayContext } from '../types/monday.types';
import { mondayApiService } from '../services/mondayApiService';
import { mondayStorageService } from '../services/mondayStorageService';
import { mondaySDK } from '../services/mondaySDK';

// Use centralized Monday SDK instance
const monday: MondayClientSdk = mondaySDK.getSDK();

/**
 * Custom hook for managing Monday app state and operations
 * Centralizes all Monday SDK interactions and state management
 * Uses centralized SDK instance for consistent authentication
 */
export const useMondayApp = () => {
  // Centralized state for all Monday app functionality
  const [state, setState] = useState<AppState>({
    // Loading states
    initLoading: true,
    apiLoading: false,

    // Monday context and client info
    context: null,
    theme: 'light',
    location: null,
    clientInfo: null,

    // Storage data
    instanceStorage: null,
    globalStorage: null,

    // API data
    apiData: null,
    users: null,

    // Single latest API response for unified display
    latestApiResponse: null,

    // Monday.get data
    itemIds: null,
    sessionToken: null,
    filter: null,
    locationData: null,

    // Execute results
    executeResults: {},

    // Listener data
    contextListener: null,
    itemIdsListener: null,
    eventsListener: null,

    // Custom query functionality
    customQuery: '',
    customQueryResult: null,
    showCustomQuery: false,

    // API Playground functionality
    apiPlaygroundQuery: '',
    apiPlaygroundResult: null,
    showApiPlayground: false,

    // Tab state
    activeTab: 'get' as 'get' | 'storage' | 'api' | 'execute' | 'listen'
  });

  /**
   * Safe state update helper
   * @param updates - Partial state updates
   */
  const updateState = useCallback((updates: Partial<AppState>) => {
    setState(prevState => ({ ...prevState, ...updates }));
  }, []);

  /**
   * Initialize Monday app with listeners and initial data
   */
  const initializeApp = useCallback(async () => {
    try {
      // Initialize centralized SDK for seamless authentication
      mondaySDK.initialize();
      
      // Notify Monday platform that user gained first value in app
      await monday.execute("valueCreatedForUser");

      // Set up event listeners
      monday.listen("context", (res) => {
        updateState({ 
          context: res.data as MondayContext,
          initLoading: false 
        });
      });

      monday.listen("theme", (res) => {
        updateState({ theme: res.data });
      });

      monday.listen("location", (res) => {
        updateState({ location: res.data });
      });

      // Storage is now initialized on-demand when buttons are clicked

      // Initialize client info
      await initializeClientInfo();

      // Set timeout fallback to prevent infinite loading
      setTimeout(() => {
        updateState({ initLoading: false });
      }, 3000);

    } catch (error) {
      console.error("Error initializing app:", error);
      updateState({ initLoading: false });
    }
  }, [updateState]);

  /**
   * Initialize client information
   */
  const initializeClientInfo = useCallback(async () => {
    try {
      const [contextData, themeData, locationData] = await Promise.all([
        monday.get("context"),
        monday.get("theme"),
        monday.get("location")
      ]);
      
      updateState({
        clientInfo: {
          context: contextData,
          theme: themeData,
          location: locationData
        }
      });
      
      // Configure app settings
      await monday.set("settings", {
        appName: "Enhanced Monday SDK Demo",
        version: "1.0.0",
        features: ["api", "storage", "events", "theme"]
      });
    } catch (error) {
      console.error("Error initializing client info:", error);
    }
  }, [updateState]);

  /**
   * API Operations
   */
  const fetchBoardData = useCallback(async () => {
    updateState({ apiLoading: true });
    try {
      const result = await mondayApiService.fetchBoardData();
      updateState({ 
        apiData: result, 
        latestApiResponse: { ...result, apiCallType: 'Board Data' },
        apiLoading: false 
      });
    } catch (error) {
      console.error("Error in fetchBoardData hook:", error);
      updateState({ apiLoading: false });
    }
  }, [updateState]);

  const executeCustomQuery = useCallback(async () => {
    const result = await mondayApiService.executeCustomQuery(state.customQuery);
    updateState({ 
      customQueryResult: result,
      latestApiResponse: { ...result, apiCallType: 'Custom Query' }
    });
  }, [state.customQuery, updateState]);

  const executeApiPlayground = useCallback(async () => {
    const result = await mondayApiService.executeApiPlaygroundQuery(
      state.apiPlaygroundQuery
    );
    updateState({ 
      apiPlaygroundResult: result,
      latestApiResponse: { ...result, apiCallType: 'API Playground' }
    });
  }, [state.apiPlaygroundQuery, updateState]);

  const getUsers = useCallback(async () => {
    const result = await mondayApiService.getUsers();
    updateState({ 
      users: result,
      latestApiResponse: { ...result, apiCallType: 'Users Data' }
    });
  }, [updateState]);

  /**
   * Storage Operations
   */
  const testInstanceStorage = useCallback(async () => {
    const result = await mondayStorageService.getInstanceStorage();
    updateState({ instanceStorage: result });
  }, [updateState]);

  const setInstanceStorageValue = useCallback(async () => {
    const value = prompt("Enter a value to store:");
    if (value) {
      const result = await mondayStorageService.setInstanceStorage(value);
      updateState({ instanceStorage: result });
    }
  }, [updateState]);

  const testGlobalStorage = useCallback(async () => {
    const result = await mondayStorageService.getGlobalStorage();
    updateState({ globalStorage: result });
  }, [updateState]);

  const setGlobalStorageValue = useCallback(async () => {
    const value = prompt("Enter a value to store globally:");
    if (value) {
      const result = await mondayStorageService.setGlobalStorage(value);
      updateState({ globalStorage: result });
    }
  }, [updateState]);

  /**
   * Tests storage authentication
   */
  const testStorageAuth = useCallback(async () => {
    try {
      const result = await mondaySDK.testStorageAuth();
      if (result.success) {
        alert("✅ Storage authentication test passed! Storage should work now.");
      } else {
        alert(`❌ Storage authentication test failed: ${result.error}`);
      }
    } catch (error: any) {
      alert(`❌ Storage authentication test error: ${error.message}`);
    }
  }, []);

  /**
   * Monday.get operations
   */
  const getItemIds = useCallback(async () => {
    try {
      const result = await monday.get("itemIds");
      updateState({ itemIds: result });
    } catch (error) {
      console.error("Error getting item IDs:", error);
      updateState({ itemIds: { error: true, message: "Failed to get item IDs" } });
    }
  }, [updateState]);

  const getSessionToken = useCallback(async () => {
    try {
      const result = await monday.get("sessionToken");
      updateState({ sessionToken: result?.data || "No token received" });
    } catch (error) {
      console.error("Error getting session token:", error);
      updateState({ sessionToken: "Error getting token" });
    }
  }, [updateState]);

  const getFilter = useCallback(async () => {
    try {
      const result = await monday.get("filter");
      updateState({ filter: result });
    } catch (error) {
      console.error("Error getting filter:", error);
      updateState({ filter: { error: true, message: "Failed to get filter" } });
    }
  }, [updateState]);

  const getLocationData = useCallback(async () => {
    try {
      const result = await monday.get("location");
      updateState({ locationData: result });
    } catch (error) {
      console.error("Error getting location:", error);
      updateState({ locationData: { error: true, message: "Failed to get location" } });
    }
  }, [updateState]);

  /**
   * Execute actions
   */
  const executeAction = useCallback(async (action: string, params?: any) => {
    try {
      let result;
      
      switch (action) {
        case "notice":
          result = await monday.execute("notice", { 
            message: "This is a test message!",
            type: "success",
            timeout: 5000,
          });
          break;
        case "confirm":
          result = await monday.execute("confirm", {
            message: "Are you sure you want to perform this action?",
            confirmButton: "Yes, do it!",
            cancelButton: "Cancel",
            excludeCancelButton: false
          });
          break;
        case "fileUpload":
          if (state.context?.boardId && state.context?.itemId) {
            result = await monday.execute('triggerFilesUpload', {
              boardId: state.context.boardId,
              itemId: state.context.itemId,
              columnId: 'files'
            });
          } else {
            result = { error: "Missing boardId or itemId in context" };
          }
          break;
        default:
          result = await monday.execute(action, params);
      }
      
      updateState({ 
        executeResults: { 
          ...state.executeResults, 
          [action]: result 
        } 
      });
      
    } catch (error: any) {
      console.error(`Error executing action ${action}:`, error);
      updateState({ 
        executeResults: { 
          ...state.executeResults, 
          [action]: { error: true, message: error.message } 
        } 
      });
    }
  }, [state.context, state.executeResults, updateState]);

  /**
   * UI state updates
   */
  const toggleCustomQuery = useCallback(() => {
    updateState({ showCustomQuery: !state.showCustomQuery });
  }, [state.showCustomQuery, updateState]);

  const toggleApiPlayground = useCallback(() => {
    updateState({ showApiPlayground: !state.showApiPlayground });
  }, [state.showApiPlayground, updateState]);

  const updateCustomQuery = useCallback((query: string) => {
    updateState({ customQuery: query });
  }, [updateState]);

  const updateApiPlaygroundQuery = useCallback((query: string) => {
    updateState({ apiPlaygroundQuery: query });
  }, [updateState]);



  /**
   * Tab Management
   */
  const setActiveTab = useCallback((tab: 'get' | 'storage' | 'api' | 'execute' | 'listen' | 'local') => {
    updateState({ activeTab: tab });
  }, [updateState]);

  // Initialize app on mount
  useEffect(() => {
    initializeApp();
  }, [initializeApp]);

  return {
    // State
    ...state,
    
    // API operations
    fetchBoardData,
    executeCustomQuery,
    executeApiPlayground,
    getUsers,
    
    // Storage operations
    testInstanceStorage,
    setInstanceStorageValue,
    testGlobalStorage,
    setGlobalStorageValue,
    testStorageAuth,
    
    // Monday.get operations
    getItemIds,
    getSessionToken,
    getFilter,
    getLocationData,
    
    // Execute operations
    executeAction,
    
    // UI operations
    toggleCustomQuery,
    toggleApiPlayground,
    updateCustomQuery,
    updateApiPlaygroundQuery,

    
    // Tab management
    setActiveTab,
  };
}; 