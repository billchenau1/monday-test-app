import { SeamlessApiClient } from '@mondaydotcomorg/api';
import { ApiResponse, BoardData, UserData } from '../types/monday.types';

/**
 * Monday API Service
 * Handles all API interactions with Monday.com GraphQL API using SeamlessApiClient
 * Implements proper error handling, token management, and request tracking
 */
class MondayApiService {
  private client: SeamlessApiClient;
  private static instance: MondayApiService;

  private constructor() {
    this.client = new SeamlessApiClient();
  }

  /**
   * Get singleton instance of the service
   */
  public static getInstance(): MondayApiService {
    if (!MondayApiService.instance) {
      MondayApiService.instance = new MondayApiService();
    }
    return MondayApiService.instance;
  }

  /**
   * Get authorization token for debugging
   * @returns Promise<string | null> - The current token or null if not available
   */
  private async getToken(): Promise<string | null> {
    try {
      // Try to access the internal token from the client
      // This is for debugging purposes only
      const token = (this.client as any)?._token || null;
      return token;
    } catch (error) {
      console.warn('Could not access token for debugging:', error);
      return null;
    }
  }

  /**
   * Fetch board data from Monday API
   * @returns Promise<ApiResponse<BoardData[]>> - Returns up to 5 boards from the account
   */
  async fetchBoardData(): Promise<ApiResponse<{ boards: BoardData[] }>> {
    const query = `
      query {
        boards(limit: 5) {
          id
          name
          description
          board_kind
          state
          workspace {
            id
            name
          }
          groups {
            id
            title
            color
          }
          columns {
            id
            title
            type
            settings_str
          }
          items_page(limit: 5) {
            cursor
            items {
              id
              name
              created_at
              updated_at
              state
              group {
                id
                title
              }
              column_values {
                id
                text
                value
                column {
                  id
                  title
                  type
                }
              }
            }
          }
        }
      }
    `;

    const variables = {};
    const timestamp = new Date().toISOString();

    try {
      const token = await this.getToken();
      
      const response = await this.client.request(query, variables) as any;
      
      const requestInfo: any = {
        query,
        variables,
        method: 'POST',
        url: 'https://api.monday.com/v2',
        headers: {
          'Content-Type': 'application/json',
          'API-Version': '2025-04'
        },
        timestamp,
        apiVersion: '2025-04',
        queryType: 'boards',
        token: token ? `${token.substring(0, 10)}...` : 'Not available'
      };

      // Check for GraphQL errors in response
      if (response.error || response.data?.error) {
        return {
          data: undefined,
          error: true,
          message: 'GraphQL validation errors',
          fullResponse: response,
          requestInfo
        };
      }

      // Check for errors in response.data.errors
      if (response.data?.errors && response.data.errors.length > 0) {
        return {
          data: undefined,
          error: true,
          message: 'GraphQL validation errors',
          fullResponse: response,
          requestInfo
        };
      }

      const boards = response.data?.data?.boards || [];
      if (boards.length === 0) {
        return {
          data: undefined,
          error: true,
          message: 'No boards found in account',
          fullResponse: response,
          requestInfo
        };
      }

      return {
        data: { boards },
        error: false,
        message: `Successfully retrieved ${boards.length} boards`,
        fullResponse: response,
        requestInfo
      };

    } catch (error: any) {
      const token = await this.getToken();
      
      const requestInfo: any = {
        query,
        variables,
        method: 'POST',
        url: 'https://api.monday.com/v2',
        headers: {
          'Content-Type': 'application/json',
          'API-Version': '2025-04'
        },
        timestamp,
        apiVersion: '2025-04',
        queryType: 'boards',
        token: token ? `${token.substring(0, 10)}...` : 'Not available'
      };

      return {
        data: undefined,
        error: true,
        message: error.message || 'Network or parsing error occurred',
        fullResponse: error,
        requestInfo
      };
    }
  }

  /**
   * Execute a custom GraphQL query
   * @param query - The GraphQL query string
   * @param variables - Optional variables for the query
   * @returns Promise<ApiResponse<any>>
   */
  async executeCustomQuery(query: string, variables?: any): Promise<ApiResponse<any>> {
    const timestamp = new Date().toISOString();

    try {
      const token = await this.getToken();
      
      const response = await this.client.request(query, variables) as any;
      
      const requestInfo: any = {
        query,
        variables,
        method: 'POST',
        url: 'https://api.monday.com/v2',
        headers: {
          'Content-Type': 'application/json',
          'API-Version': '2025-04'
        },
        timestamp,
        apiVersion: '2025-04',
        queryType: 'custom',
        token: token ? `${token.substring(0, 10)}...` : 'Not available'
      };

      // Check for GraphQL errors in response
      if (response.error || response.data?.error) {
        return {
          data: response.data?.data,
          error: true,
          message: 'GraphQL validation errors',
          fullResponse: response,
          requestInfo
        };
      }

      // Check for errors in response.data.errors
      if (response.data?.errors && response.data.errors.length > 0) {
        return {
          data: response.data?.data,
          error: true,
          message: 'GraphQL validation errors',
          fullResponse: response,
          requestInfo
        };
      }

      return {
        data: response.data?.data,
        error: false,
        message: 'Query executed successfully',
        fullResponse: response,
        requestInfo
      };

    } catch (error: any) {
      const token = await this.getToken();
      
      const requestInfo: any = {
        query,
        variables,
        method: 'POST',
        url: 'https://api.monday.com/v2',
        headers: {
          'Content-Type': 'application/json',
          'API-Version': '2025-04'
        },
        timestamp,
        apiVersion: '2025-04',
        queryType: 'custom',
        token: token ? `${token.substring(0, 10)}...` : 'Not available'
      };

      return {
        data: undefined,
        error: true,
        message: error.message || 'Network or parsing error occurred',
        fullResponse: error,
        requestInfo
      };
    }
  }

  /**
   * Get users from Monday API
   * @param limit - Maximum number of users to fetch
   * @returns Promise<ApiResponse<{ users: UserData[] }>>
   */
  async getUsers(limit: number = 10): Promise<ApiResponse<{ users: UserData[] }>> {
    const query = `
      query($limit: Int!) {
        users(limit: $limit) {
          id
          name
          email
          enabled
          created_at
          is_admin
          is_guest
          photo_thumb
          time_zone_identifier
        }
      }
    `;

    const variables = { limit };
    const timestamp = new Date().toISOString();

    try {
      const token = await this.getToken();
      
      const response = await this.client.request(query, variables) as any;
      
      const requestInfo: any = {
        query,
        variables,
        method: 'POST',
        url: 'https://api.monday.com/v2',
        headers: {
          'Content-Type': 'application/json',
          'API-Version': '2025-04'
        },
        timestamp,
        apiVersion: '2025-04',
        queryType: 'users',
        token: token ? `${token.substring(0, 10)}...` : 'Not available'
      };

      // Check for GraphQL errors in response
      if (response.error || response.data?.error) {
        return {
          data: { users: [] },
          error: true,
          message: 'GraphQL validation errors',
          fullResponse: response,
          requestInfo
        };
      }

      // Check for errors in response.data.errors
      if (response.data?.errors && response.data.errors.length > 0) {
        return {
          data: { users: [] },
          error: true,
          message: 'GraphQL validation errors',
          fullResponse: response,
          requestInfo
        };
      }

      return {
        data: { users: response.data?.data?.users || [] },
        error: false,
        message: 'Users retrieved successfully',
        fullResponse: response,
        requestInfo
      };

    } catch (error: any) {
      const token = await this.getToken();
      
      const requestInfo: any = {
        query,
        variables,
        method: 'POST',
        url: 'https://api.monday.com/v2',
        headers: {
          'Content-Type': 'application/json',
          'API-Version': '2025-04'
        },
        timestamp,
        apiVersion: '2025-04',
        queryType: 'users',
        token: token ? `${token.substring(0, 10)}...` : 'Not available'
      };

      return {
        data: { users: [] },
        error: true,
        message: error.message || 'Network or parsing error occurred',
        fullResponse: error,
        requestInfo
      };
    }
  }

  /**
   * Execute API Playground query
   * @param query - The GraphQL query string
   * @param variables - Optional variables for the query
   * @returns Promise<ApiResponse<any>>
   */
  async executeApiPlaygroundQuery(query: string, variables?: any): Promise<ApiResponse<any>> {
    const timestamp = new Date().toISOString();

    try {
      const token = await this.getToken();
      
      const response = await this.client.request(query, variables) as any;
      
      const requestInfo: any = {
        query,
        variables,
        method: 'POST',
        url: 'https://api.monday.com/v2',
        headers: {
          'Content-Type': 'application/json',
          'API-Version': '2025-04'
        },
        timestamp,
        apiVersion: '2025-04',
        queryType: 'playground',
        token: token ? `${token.substring(0, 10)}...` : 'Not available'
      };

      // Check for GraphQL errors in response
      if (response.error || response.data?.error) {
        return {
          data: response.data?.data,
          error: true,
          message: 'GraphQL validation errors',
          fullResponse: response,
          requestInfo
        };
      }

      // Check for errors in response.data.errors
      if (response.data?.errors && response.data.errors.length > 0) {
        return {
          data: response.data?.data,
          error: true,
          message: 'GraphQL validation errors',
          fullResponse: response,
          requestInfo
        };
      }

      return {
        data: response.data?.data,
        error: false,
        message: 'Query executed successfully',
        fullResponse: response,
        requestInfo
      };

    } catch (error: any) {
      const token = await this.getToken();
      
      const requestInfo: any = {
        query,
        variables,
        method: 'POST',
        url: 'https://api.monday.com/v2',
        headers: {
          'Content-Type': 'application/json',
          'API-Version': '2025-04'
        },
        timestamp,
        apiVersion: '2025-04',
        queryType: 'playground',
        token: token ? `${token.substring(0, 10)}...` : 'Not available'
      };

      return {
        data: undefined,
        error: true,
        message: error.message || 'Network or parsing error occurred',
        fullResponse: error,
        requestInfo
      };
    }
  }
}

// Export singleton instance
export const mondayApiService = MondayApiService.getInstance();
export default mondayApiService; 