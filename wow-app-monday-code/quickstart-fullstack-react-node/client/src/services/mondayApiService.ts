import mondaySdk, { MondayClientSdk } from "monday-sdk-js";
import { ApiResponse, BoardData, MeData, UserData } from "../types/monday.types";

// Initialize Monday SDK with seamless authentication
const monday: MondayClientSdk = mondaySdk();
monday.setApiVersion("2025-04");

/**
 * Monday API Service
 * Handles all Monday.com API interactions with proper error handling
 * Uses seamless authentication for iframe context
 */
export class MondayApiService {
  /**
   * Fetches board data including user info and boards
   * @returns Promise<ApiResponse> with board and user data
   */
  async fetchBoardData(): Promise<ApiResponse<{ me: MeData; boards: BoardData[] }>> {
    try {
      const query = `
        query GetBoardData {
          me {
            id
            name
            email
            account {
              id
              name
            }
          }
          boards(limit: 3) {
            id
            name
            description
            state
            board_kind
          }
        }
      `;
      
      console.log("Executing board data query:", query);
      const response = await monday.api(query);
      console.log("Board data response:", response);
      
      // Check for GraphQL errors in the response
      if ((response as any).errors && (response as any).errors.length > 0) {
        console.error("GraphQL errors:", (response as any).errors);
        return {
          error: true,
          message: "GraphQL validation errors",
          errors: (response as any).errors,
          data: {
            // Fallback data for demo purposes
            me: { 
              id: "demo", 
              name: "Demo User", 
              email: "demo@monday.com", 
              account: { id: "demo", name: "Demo Account" } 
            },
            boards: [
              { id: "1", name: "Demo Board 1", description: "Sample board", state: "active", board_kind: "public" },
              { id: "2", name: "Demo Board 2", description: "Another sample", state: "active", board_kind: "public" }
            ]
          }
        };
      }
      
      return {
        data: response.data,
        error: false
      };
    } catch (error: any) {
      console.error("Error fetching board data:", error);
      return {
        error: true,
        message: error.message || 'Unknown error',
        errors: error.errors,
        data: {
          // Fallback data for demo purposes
          me: { 
            id: "demo", 
            name: "Demo User", 
            email: "demo@monday.com", 
            account: { id: "demo", name: "Demo Account" } 
          },
          boards: [
            { id: "1", name: "Demo Board 1", description: "Sample board", state: "active", board_kind: "public" },
            { id: "2", name: "Demo Board 2", description: "Another sample", state: "active", board_kind: "public" }
          ]
        }
      };
    }
  }

  /**
   * Executes a custom GraphQL query
   * @param query - GraphQL query string
   * @returns Promise<ApiResponse> with query results
   */
  async executeCustomQuery(query: string): Promise<ApiResponse> {
    if (!query.trim()) {
      return {
        error: true,
        message: "Please enter a GraphQL query"
      };
    }

    try {
      console.log("Executing custom query:", query);
      const response = await monday.api(query);
      console.log("Custom query response:", response);
      
      // Check for GraphQL errors in the response
      if ((response as any).errors && (response as any).errors.length > 0) {
        console.error("GraphQL errors:", (response as any).errors);
        return {
          error: true,
          message: "GraphQL validation errors",
          errors: (response as any).errors,
          data: response.data
        };
      }
      
      return response;
    } catch (error: any) {
      console.error("Custom query error:", error);
      return {
        error: true,
        message: error.message || 'Unknown error',
        errors: error.errors
      };
    }
  }

  /**
   * Fetches users data
   * @returns Promise<ApiResponse> with users data
   */
  async getUsers(): Promise<ApiResponse<{ users: UserData[] }>> {
    try {
      const query = 'query GetUsers { users { name id email } }';
      console.log("Executing users query:", query);
      const response = await monday.api(query);
      console.log("Users response:", response);
      
      // Check for GraphQL errors in the response
      if ((response as any).errors && (response as any).errors.length > 0) {
        console.error("GraphQL errors:", (response as any).errors);
        return {
          error: true,
          message: "GraphQL validation errors",
          errors: (response as any).errors,
          data: response.data
        };
      }
      
      return response;
    } catch (error: any) {
      console.error("Error fetching users:", error);
      return {
        error: true,
        message: error.message || 'Unknown error',
        errors: error.errors
      };
    }
  }

  /**
   * Executes API playground query with client/server side options
   * @param query - GraphQL query string
   * @param queryType - 'client' or 'server' side execution
   * @returns Promise<ApiResponse> with query results
   */
  async executeApiPlaygroundQuery(query: string, queryType: 'client' | 'server'): Promise<ApiResponse> {
    if (!query.trim()) {
      return {
        error: true,
        message: "Please enter a GraphQL query"
      };
    }

    try {
      console.log(`Executing ${queryType}-side query:`, query);
      let response;
      
      if (queryType === 'client') {
        // Client-side query with seamless auth
        response = await monday.api(query);
      } else {
        // Server-side query (would typically go through backend)
        // For demo purposes, we'll still use client-side but indicate it's server-side
        response = await monday.api(query);
        response = { ...response, queryType: 'server-side (demo)' };
      }
      
      console.log(`${queryType}-side query response:`, response);
      
      // Check for GraphQL errors in the response
      if ((response as any).errors && (response as any).errors.length > 0) {
        console.error("GraphQL errors:", (response as any).errors);
        return {
          error: true,
          message: "GraphQL validation errors",
          errors: (response as any).errors,
          data: response.data
        };
      }
      
      return response;
    } catch (error: any) {
      console.error(`${queryType}-side query error:`, error);
      return {
        error: true,
        message: error.message || 'Unknown error',
        errors: error.errors
      };
    }
  }
}

// Export singleton instance
export const mondayApiService = new MondayApiService(); 