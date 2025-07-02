import { MondayApiService } from '../../services/mondayApiService';

// Mock the monday-sdk-js module
jest.mock('monday-sdk-js', () => {
  const mockApi = jest.fn();
  const mockSetApiVersion = jest.fn();
  
  // Store mocks globally for test access
  (global as any).mockApi = mockApi;
  (global as any).mockSetApiVersion = mockSetApiVersion;
  
  return {
    __esModule: true,
    default: jest.fn(() => ({
      api: mockApi,
      setApiVersion: mockSetApiVersion,
    })),
  };
});

describe('MondayApiService', () => {
  let service: MondayApiService;
  let mockApi: any;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    
    // Get the mock from global
    mockApi = (global as any).mockApi;
    
    // Create new service instance
    service = new MondayApiService();
  });

  describe('fetchBoardData', () => {
    it('should successfully fetch board data', async () => {
      // Arrange
      const mockResponse = {
        data: {
          me: {
            id: "123",
            name: "Test User",
            email: "test@example.com",
            account: { id: "456", name: "Test Account" }
          },
          boards: [
            { id: "1", name: "Test Board", description: "Test", state: "active", board_kind: "public" }
          ]
        }
      };
      mockApi.mockResolvedValue(mockResponse);

      // Act
      const result = await service.fetchBoardData();

      // Assert
      expect(result.error).toBe(false);
      expect(result.data).toEqual(mockResponse.data);
      expect(mockApi).toHaveBeenCalledWith(expect.stringContaining('query'));
    });

    it('should handle API errors gracefully', async () => {
      // Arrange
      const mockError = new Error('API Error');
      mockApi.mockRejectedValue(mockError);

      // Act
      const result = await service.fetchBoardData();

      // Assert
      expect(result.error).toBe(true);
      expect(result.message).toBe('API Error');
      expect(result.data).toBeDefined(); // Should have fallback data
      expect(result.data?.me.name).toBe('Demo User');
    });

    it('should include fallback data when API fails', async () => {
      // Arrange
      mockApi.mockRejectedValue(new Error('Network error'));

      // Act
      const result = await service.fetchBoardData();

      // Assert
      expect(result.error).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.me).toBeDefined();
      expect(result.data?.boards).toBeDefined();
      expect(result.data?.boards.length).toBeGreaterThan(0);
    });
  });

  describe('executeCustomQuery', () => {
    it('should execute valid custom query', async () => {
      // Arrange
      const query = 'query { me { id name } }';
      const mockResponse = { data: { me: { id: "123", name: "Test" } } };
      mockApi.mockResolvedValue(mockResponse);

      // Act
      const result = await service.executeCustomQuery(query);

      // Assert
      expect(result).toEqual(mockResponse);
      expect(mockApi).toHaveBeenCalledWith(query);
    });

    it('should reject empty query', async () => {
      // Act
      const result = await service.executeCustomQuery('');

      // Assert
      expect(result.error).toBe(true);
      expect(result.message).toBe('Please enter a GraphQL query');
      expect(mockApi).not.toHaveBeenCalled();
    });

    it('should reject whitespace-only query', async () => {
      // Act
      const result = await service.executeCustomQuery('   ');

      // Assert
      expect(result.error).toBe(true);
      expect(result.message).toBe('Please enter a GraphQL query');
      expect(mockApi).not.toHaveBeenCalled();
    });

    it('should handle query execution errors', async () => {
      // Arrange
      const query = 'query { invalid }';
      const mockError = { message: 'Invalid query', errors: [{ message: 'Field not found' }] };
      mockApi.mockRejectedValue(mockError);

      // Act
      const result = await service.executeCustomQuery(query);

      // Assert
      expect(result.error).toBe(true);
      expect(result.message).toBe('Invalid query');
      expect(result.errors).toEqual([{ message: 'Field not found' }]);
    });
  });

  describe('getUsers', () => {
    it('should fetch users successfully', async () => {
      // Arrange
      const mockResponse = {
        data: {
          users: [
            { id: "1", name: "User 1", email: "user1@test.com" },
            { id: "2", name: "User 2", email: "user2@test.com" }
          ]
        }
      };
      mockApi.mockResolvedValue(mockResponse);

      // Act
      const result = await service.getUsers();

      // Assert
      expect(result).toEqual(mockResponse);
      expect(mockApi).toHaveBeenCalledWith('query GetUsers { users { name id email } }');
    });

    it('should handle users fetch error', async () => {
      // Arrange
      const mockError = new Error('Unauthorized');
      mockApi.mockRejectedValue(mockError);

      // Act
      const result = await service.getUsers();

      // Assert
      expect(result.error).toBe(true);
      expect(result.message).toBe('Unauthorized');
    });
  });

  describe('executeApiPlaygroundQuery', () => {
    const testQuery = 'query { me { id } }';

    it('should execute client-side query', async () => {
      // Arrange
      const mockResponse = { data: { me: { id: "123" } } };
      mockApi.mockResolvedValue(mockResponse);

      // Act
      const result = await service.executeApiPlaygroundQuery(testQuery, 'client');

      // Assert
      expect(result).toEqual(mockResponse);
      expect(mockApi).toHaveBeenCalledWith(testQuery);
    });

    it('should execute server-side query with demo flag', async () => {
      // Arrange
      const mockResponse = { data: { me: { id: "123" } } };
      mockApi.mockResolvedValue(mockResponse);

      // Act
      const result = await service.executeApiPlaygroundQuery(testQuery, 'server');

      // Assert
      expect((result as any).queryType).toBe('server-side (demo)');
      expect(result.data).toEqual(mockResponse.data);
      expect(mockApi).toHaveBeenCalledWith(testQuery);
    });

    it('should reject empty playground query', async () => {
      // Act
      const result = await service.executeApiPlaygroundQuery('', 'client');

      // Assert
      expect(result.error).toBe(true);
      expect(result.message).toBe('Please enter a GraphQL query');
    });

    it('should handle playground query errors', async () => {
      // Arrange
      const mockError = new Error('Playground error');
      mockApi.mockRejectedValue(mockError);

      // Act
      const result = await service.executeApiPlaygroundQuery(testQuery, 'client');

      // Assert
      expect(result.error).toBe(true);
      expect(result.message).toBe('Playground error');
    });
  });

  describe('Error Handling', () => {
    it('should handle errors without message property', async () => {
      // Arrange
      const mockError = { code: 'UNKNOWN_ERROR' };
      mockApi.mockRejectedValue(mockError);

      // Act
      const result = await service.executeCustomQuery('query { test }');

      // Assert
      expect(result.error).toBe(true);
      expect(result.message).toBe('Unknown error');
    });

    it('should preserve error structure', async () => {
      // Arrange
      const mockError = {
        message: 'GraphQL Error',
        errors: [{ message: 'Unauthorized field', path: ['me'] }]
      };
      mockApi.mockRejectedValue(mockError);

      // Act
      const result = await service.executeCustomQuery('query { me { secret } }');

      // Assert
      expect(result.error).toBe(true);
      expect(result.message).toBe('GraphQL Error');
      expect(result.errors).toEqual(mockError.errors);
    });
  });
});