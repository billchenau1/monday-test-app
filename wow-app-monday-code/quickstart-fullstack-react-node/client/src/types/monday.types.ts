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
  // Context and initialization
  context: MondayContext | null;
  initLoading: boolean;
  
  // API data
  apiData: ApiResponse<{ me: MeData; boards: BoardData[] }> | null;
  apiLoading: boolean;
  users: ApiResponse<{ users: UserData[] }> | null;
  
  // Monday.get data
  itemIds: any;
  sessionToken: string;
  filter: any;
  locationData: any;
  clientInfo: any;
  
  // Storage data
  storageExampleText: string;
  instanceStorage: StorageData | null;
  globalStorage: StorageData | null;
  
  // Query playground
  customQuery: string;
  customQueryResult: ApiResponse | null;
  showCustomQuery: boolean;
  apiPlaygroundQuery: string;
  apiPlaygroundResult: ApiResponse | null;
  showApiPlayground: boolean;
  apiQueryType: 'client' | 'server';
  
  // Listeners
  contextListener: any;
  itemIdsListener: any;
  eventsListener: any;
  
  // Execute results
  executeResults: Record<string, ExecuteResult>;
  
  // UI state
  theme: string;
  location: any;
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