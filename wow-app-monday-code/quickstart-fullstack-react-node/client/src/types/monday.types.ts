// Monday SDK Types and Interfaces
export interface MondayContext {
  boardId?: number;
  itemId?: number;
  userId?: number;
  accountId?: number;
  theme?: string;
  [key: string]: any;
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: boolean;
  message?: string;
  errors?: Array<{
    message: string;
    path?: string[];
    extensions?: {
      code: string;
      [key: string]: any;
    };
  }>;
  fullResponse?: any; // Complete API response for debugging and advanced error handling
  requestInfo?: {
    query?: string;
    variables?: any;
    method?: string;
    url?: string;
    headers?: Record<string, string>;
    timestamp?: string;
    apiVersion?: string;
    queryType: string;
    token?: string; // Add token for debugging authentication
  }; // Complete request information for debugging
}

export interface BoardData {
  id: string;
  name: string;
  description?: string;
  state: string;
  board_kind: string;
}

export interface UserData {
  id: string;
  name: string;
  email?: string;
}

export interface MeData {
  id: string;
  name: string;
  email: string;
  account: {
    id: string;
    name: string;
  };
}

export interface StorageData {
  value?: string;
  success?: boolean;
  error?: boolean;
  message?: string;
}

export interface ExecuteResult {
  success?: boolean;
  error?: boolean;
  message?: string;
  [key: string]: any;
}

export interface AppState {
  // Loading states
  initLoading: boolean;
  apiLoading: boolean;

  // Monday context and client info
  context: MondayContext | null;
  theme: string;
  location: any;
  clientInfo: any;

  // Storage data
  instanceStorage: StorageData | null;
  globalStorage: StorageData | null;

  // API data
  apiData: ApiResponse<{ boards: BoardData[] }> | null;
  users: ApiResponse<{ users: UserData[] }> | null;
  
  // Single latest API response for unified display
  latestApiResponse: (ApiResponse & { apiCallType?: string }) | null;

  // Monday.get data
  itemIds: any;
  sessionToken: string | null;
  filter: any;
  locationData: any;

  // Execute results
  executeResults: Record<string, ExecuteResult>;

  // Listener data
  contextListener: any;
  itemIdsListener: any;
  eventsListener: any;

  // Custom query functionality
  customQuery: string;
  customQueryResult: ApiResponse | null;
  showCustomQuery: boolean;

  // API Playground functionality
  apiPlaygroundQuery: string;
  apiPlaygroundResult: ApiResponse | null;
  showApiPlayground: boolean;

  // Tab state
  activeTab: 'get' | 'storage' | 'api' | 'execute' | 'listen' | 'local';
}

export interface MondayApiService {
  fetchBoardData(): Promise<ApiResponse>;
  executeCustomQuery(query: string): Promise<ApiResponse>;
  getUsers(): Promise<ApiResponse>;
}

export interface MondayStorageService {
  testInstanceStorage(): Promise<StorageData>;
  setInstanceStorageValue(value: string): Promise<StorageData>;
  testGlobalStorage(): Promise<StorageData>;
  setGlobalStorageValue(value: string): Promise<StorageData>;
} 