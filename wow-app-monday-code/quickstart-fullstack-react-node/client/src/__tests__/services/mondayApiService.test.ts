import { mondayApiService } from '../../services/mondayApiService';

// Mock the @mondaydotcomorg/api module
jest.mock('@mondaydotcomorg/api', () => {
  const mockRequest = jest.fn();
  
  // Store mock globally for test access
  (global as any).mockRequest = mockRequest;
  
  return {
    SeamlessApiClient: jest.fn().mockImplementation(() => ({
      request: mockRequest,
    })),
  };
});

describe('MondayApiService', () => {
  let mockRequest: any;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    
    // Get the mock from global
    mockRequest = (global as any).mockRequest;
  });

  describe('fetchBoardData', () => {
    it('should successfully fetch board data', async () => {
      // Arrange
      const mockResponse = {
        data: {
          data: {
            boards: [{
              id: "1234567890",
              name: "Test Board",
              description: "Test Description",
              state: "active",
              board_kind: "public",
              workspace: { id: "workspace1", name: "Test Workspace" },
              groups: [{ id: "group1", title: "Group 1", color: "#ff0000" }],
              columns: [{ id: "col1", title: "Name", type: "text", settings_str: "{}" }],
              items_page: {
                cursor: "cursor123",
                items: [{
                  id: "item1",
                  name: "Test Item",
                  created_at: "2023-01-01",
                  updated_at: "2023-01-02",
                  state: "active",
                  group: { id: "group1", title: "Group 1" },
                  column_values: []
                }]
              }
            }]
          }
        }
      };
      mockRequest.mockResolvedValue(mockResponse);

      // Act
      const result = await mondayApiService.fetchBoardData();

      // Assert
      expect(result.error).toBe(false);
      expect(result.data).toEqual({ boards: mockResponse.data.data.boards });
      expect(result.requestInfo).toBeDefined();
      expect(result.requestInfo?.queryType).toBe('boards');
      expect(mockRequest).toHaveBeenCalledWith(
        expect.stringContaining('query {'),
        {}
      );
    });

    it('should handle API errors gracefully', async () => {
      // Arrange
      const mockError = new Error('API Error');
      mockRequest.mockRejectedValue(mockError);

      // Act
      const result = await mondayApiService.fetchBoardData();

      // Assert
      expect(result.error).toBe(true);
      expect(result.message).toBe('API Error');
      expect(result.data).toBeUndefined();
      expect(result.fullResponse).toBe(mockError);
      expect(result.requestInfo).toBeDefined();
      expect(result.requestInfo?.token).toBeDefined();
    });

    it('should handle GraphQL validation errors', async () => {
      // Arrange
      const mockResponse = {
        data: {
          errors: [
            { message: "Unauthorized field or type", path: ["me"] }
          ]
        }
      };
      mockRequest.mockResolvedValue(mockResponse);

      // Act
      const result = await mondayApiService.fetchBoardData();

      // Assert
      expect(result.error).toBe(true);
      expect(result.message).toBe('GraphQL validation errors');
      expect(result.data).toBeUndefined();
      expect(result.fullResponse).toBe(mockResponse);
    });

    it('should handle empty boards response', async () => {
      // Arrange
      const mockResponse = {
        data: {
          data: {
            boards: []
          }
        }
      };
      mockRequest.mockResolvedValue(mockResponse);

      // Act
      const result = await mondayApiService.fetchBoardData();

      // Assert
      expect(result.error).toBe(true);
      expect(result.message).toBe('No boards found in account');
      expect(result.data).toBeUndefined();
      expect(result.fullResponse).toBe(mockResponse);
    });
  });

  describe('executeCustomQuery', () => {
    it('should execute valid custom query', async () => {
      // Arrange
      const query = 'query { me { id name } }';
      const variables = { limit: 10 };
      const mockResponse = { 
        data: { 
          data: { 
            me: { id: "123", name: "Test" } 
          } 
        } 
      };
      mockRequest.mockResolvedValue(mockResponse);

      // Act
      const result = await mondayApiService.executeCustomQuery(query, variables);

      // Assert
      expect(result.error).toBe(false);
      expect(result.data).toEqual(mockResponse.data.data);
      expect(result.requestInfo).toBeDefined();
      expect(result.requestInfo?.queryType).toBe('custom');
      expect(mockRequest).toHaveBeenCalledWith(query, variables);
    });

    it('should handle query execution errors', async () => {
      // Arrange
      const query = 'query { invalid }';
      const mockError = { message: 'Invalid query', errors: [{ message: 'Field not found' }] };
      mockRequest.mockRejectedValue(mockError);

      // Act
      const result = await mondayApiService.executeCustomQuery(query);

      // Assert
      expect(result.error).toBe(true);
      expect(result.message).toBe('Invalid query');
      expect(result.fullResponse).toBe(mockError);
      expect(result.requestInfo).toBeDefined();
    });
  });

  describe('getUsers', () => {
    it('should fetch users successfully', async () => {
      // Arrange
      const mockResponse = {
        data: {
          data: {
            users: [
              { id: "1", name: "User 1", email: "user1@test.com", enabled: true },
              { id: "2", name: "User 2", email: "user2@test.com", enabled: true }
            ]
          }
        }
      };
      mockRequest.mockResolvedValue(mockResponse);

      // Act
      const result = await mondayApiService.getUsers(5);

      // Assert
      expect(result.error).toBe(false);
      expect(result.data).toEqual({ users: mockResponse.data.data.users });
      expect(result.requestInfo?.queryType).toBe('users');
      expect(mockRequest).toHaveBeenCalledWith(
        expect.stringContaining('query($limit: Int!)'),
        { limit: 5 }
      );
    });

    it('should handle users fetch error', async () => {
      // Arrange
      const mockError = new Error('Unauthorized');
      mockRequest.mockRejectedValue(mockError);

      // Act
      const result = await mondayApiService.getUsers();

      // Assert
      expect(result.error).toBe(true);
      expect(result.message).toBe('Unauthorized');
      expect(result.data).toEqual({ users: [] });
    });
  });

  describe('executeApiPlaygroundQuery', () => {
    it('should execute playground query successfully', async () => {
      // Arrange
      const testQuery = 'query { me { id } }';
      const mockResponse = { 
        data: { 
          data: { 
            me: { id: "123" } 
          } 
        } 
      };
      mockRequest.mockResolvedValue(mockResponse);

      // Act
      const result = await mondayApiService.executeApiPlaygroundQuery(testQuery);

      // Assert
      expect(result.error).toBe(false);
      expect(result.data).toEqual(mockResponse.data.data);
      expect(result.requestInfo?.queryType).toBe('playground');
      expect(mockRequest).toHaveBeenCalledWith(testQuery, undefined);
    });

    it('should execute playground query with variables', async () => {
      // Arrange
      const testQuery = 'query($limit: Int) { boards(limit: $limit) { id } }';
      const variables = { limit: 5 };
      const mockResponse = { 
        data: { 
          data: { 
            boards: [] 
          } 
        } 
      };
      mockRequest.mockResolvedValue(mockResponse);

      // Act
      const result = await mondayApiService.executeApiPlaygroundQuery(testQuery, variables);

      // Assert
      expect(result.error).toBe(false);
      expect(result.data).toEqual(mockResponse.data.data);
      expect(mockRequest).toHaveBeenCalledWith(testQuery, variables);
    });

    it('should handle playground query errors', async () => {
      // Arrange
      const mockError = new Error('Query failed');
      mockRequest.mockRejectedValue(mockError);

      // Act
      const result = await mondayApiService.executeApiPlaygroundQuery('query { me { id } }');

      // Assert
      expect(result.error).toBe(true);
      expect(result.message).toBe('Query failed');
      expect(result.data).toBeUndefined();
      expect(result.fullResponse).toBe(mockError);
    });
  });

  describe('request info tracking', () => {
    it('should include complete request information in all responses', async () => {
      // Arrange
      const mockResponse = { data: { me: { id: "123" } } };
      mockRequest.mockResolvedValue(mockResponse);

      // Act
      const result = await mondayApiService.executeCustomQuery('query { me { id } }');

      // Assert
      expect(result.requestInfo).toBeDefined();
      expect(result.requestInfo?.method).toBe('POST');
      expect(result.requestInfo?.url).toBe('https://api.monday.com/v2');
      expect(result.requestInfo?.apiVersion).toBe('2025-04');
      expect(result.requestInfo?.timestamp).toBeDefined();
      expect(result.requestInfo?.headers).toBeDefined();
      expect(result.requestInfo?.query).toBe('query { me { id } }');
      expect(result.requestInfo?.token).toBeDefined();
    });
  });
});