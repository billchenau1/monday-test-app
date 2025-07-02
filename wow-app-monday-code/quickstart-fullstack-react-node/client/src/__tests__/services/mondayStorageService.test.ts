import { MondayStorageService } from '../../services/mondayStorageService';

// Mock the monday-sdk-js module
jest.mock('monday-sdk-js', () => {
  const mockInstanceGetItem = jest.fn();
  const mockInstanceSetItem = jest.fn();
  const mockGlobalGetItem = jest.fn();
  const mockGlobalSetItem = jest.fn();
  
  const mockStorage = {
    instance: {
      getItem: mockInstanceGetItem,
      setItem: mockInstanceSetItem,
    },
    getItem: mockGlobalGetItem,
    setItem: mockGlobalSetItem,
  };
  
  // Store mocks globally for test access
  (global as any).mockInstanceGetItem = mockInstanceGetItem;
  (global as any).mockInstanceSetItem = mockInstanceSetItem;
  (global as any).mockGlobalGetItem = mockGlobalGetItem;
  (global as any).mockGlobalSetItem = mockGlobalSetItem;
  
  return {
    __esModule: true,
    default: jest.fn(() => ({
      storage: mockStorage,
      setApiVersion: jest.fn(),
    })),
  };
});

describe('MondayStorageService', () => {
  let service: MondayStorageService;
  let mockInstanceGetItem: any;
  let mockInstanceSetItem: any;
  let mockGlobalGetItem: any;
  let mockGlobalSetItem: any;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    
    // Get the mocks from global
    mockInstanceGetItem = (global as any).mockInstanceGetItem;
    mockInstanceSetItem = (global as any).mockInstanceSetItem;
    mockGlobalGetItem = (global as any).mockGlobalGetItem;
    mockGlobalSetItem = (global as any).mockGlobalSetItem;
    
    // Create new service instance
    service = new MondayStorageService();
  });

  describe('Instance Storage', () => {
    describe('getInstanceStorage', () => {
      it('should successfully get instance storage value', async () => {
        // Arrange
        const mockResponse = { data: { value: 'test-value' } };
        mockInstanceGetItem.mockResolvedValue(mockResponse);

        // Act
        const result = await service.getInstanceStorage('test-key');

        // Assert
        expect(result.error).toBe(false);
        expect(result.success).toBe(true);
        expect(result.value).toEqual(mockResponse.data.value);
        expect(mockInstanceGetItem).toHaveBeenCalledWith('test-key');
      });

      it('should handle instance storage get errors', async () => {
        // Arrange
        const mockError = new Error('Storage error');
        mockInstanceGetItem.mockRejectedValue(mockError);

        // Act
        const result = await service.getInstanceStorage('test-key');

        // Assert
        expect(result.error).toBe(true);
        expect(result.success).toBe(false);
        expect(result.message).toBe('Storage error');
        expect(result.value).toBeUndefined();
      });

      it('should handle errors without message property', async () => {
        // Arrange
        const mockError = { code: 'STORAGE_ERROR' };
        mockInstanceGetItem.mockRejectedValue(mockError);

        // Act
        const result = await service.getInstanceStorage('test-key');

        // Assert
        expect(result.error).toBe(true);
        expect(result.success).toBe(false);
        expect(result.message).toBe('Unknown storage error');
      });
    });

    describe('setInstanceStorage', () => {
      it('should successfully set instance storage value', async () => {
        // Arrange
        const mockResponse = { success: true };
        mockInstanceSetItem.mockResolvedValue(mockResponse);

        // Act
        const result = await service.setInstanceStorage('test-value', 'test-key');

        // Assert
        expect(result.error).toBe(false);
        expect(result.success).toBe(true);
        expect(result.value).toEqual(mockResponse);
        expect(mockInstanceSetItem).toHaveBeenCalledWith('test-key', 'test-value');
      });

      it('should handle instance storage set errors', async () => {
        // Arrange
        const mockError = new Error('Set storage error');
        mockInstanceSetItem.mockRejectedValue(mockError);

        // Act
        const result = await service.setInstanceStorage('test-value', 'test-key');

        // Assert
        expect(result.error).toBe(true);
        expect(result.success).toBe(false);
        expect(result.message).toBe('Set storage error');
        expect(result.value).toBeUndefined();
      });

      it('should handle complex string values', async () => {
        // Arrange
        const complexValue = JSON.stringify({ nested: { data: 'test' }, array: [1, 2, 3] });
        const mockResponse = { success: true };
        mockInstanceSetItem.mockResolvedValue(mockResponse);

        // Act
        const result = await service.setInstanceStorage(complexValue, 'test-key');

        // Assert
        expect(result.error).toBe(false);
        expect(result.success).toBe(true);
        expect(result.value).toEqual(mockResponse);
        expect(mockInstanceSetItem).toHaveBeenCalledWith('test-key', complexValue);
      });
    });
  });

  describe('Global Storage', () => {
    describe('getGlobalStorage', () => {
      it('should successfully get global storage value', async () => {
        // Arrange
        const mockResponse = { data: { value: 'global-value' } };
        mockGlobalGetItem.mockResolvedValue(mockResponse);

        // Act
        const result = await service.getGlobalStorage('global-key');

        // Assert
        expect(result.error).toBe(false);
        expect(result.success).toBe(true);
        expect(result.value).toEqual(mockResponse.data.value);
        expect(mockGlobalGetItem).toHaveBeenCalledWith('global-key');
      });

      it('should handle global storage get errors', async () => {
        // Arrange
        const mockError = new Error('Global storage error');
        mockGlobalGetItem.mockRejectedValue(mockError);

        // Act
        const result = await service.getGlobalStorage('global-key');

        // Assert
        expect(result.error).toBe(true);
        expect(result.success).toBe(false);
        expect(result.message).toBe('Global storage error');
      });
    });

    describe('setGlobalStorage', () => {
      it('should successfully set global storage value', async () => {
        // Arrange
        const mockResponse = { success: true };
        mockGlobalSetItem.mockResolvedValue(mockResponse);

        // Act
        const result = await service.setGlobalStorage('global-value', 'global-key');

        // Assert
        expect(result.error).toBe(false);
        expect(result.success).toBe(true);
        expect(result.value).toEqual(mockResponse);
        expect(mockGlobalSetItem).toHaveBeenCalledWith('global-key', 'global-value');
      });

      it('should handle global storage set errors', async () => {
        // Arrange
        const mockError = new Error('Set global storage error');
        mockGlobalSetItem.mockRejectedValue(mockError);

        // Act
        const result = await service.setGlobalStorage('global-value', 'global-key');

        // Assert
        expect(result.error).toBe(true);
        expect(result.success).toBe(false);
        expect(result.message).toBe('Set global storage error');
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle null/undefined errors gracefully', async () => {
      // Arrange
      mockInstanceGetItem.mockRejectedValue(null);

      // Act
      const result = await service.getInstanceStorage('test-key');

      // Assert
      expect(result.error).toBe(true);
      expect(result.success).toBe(false);
      expect(result.message).toBe('Unknown storage error');
    });

    it('should preserve error details in response message', async () => {
      // Arrange
      const mockError = new Error('Storage quota exceeded');
      mockInstanceSetItem.mockRejectedValue(mockError);

      // Act
      const result = await service.setInstanceStorage('test-value', 'test-key');

      // Assert
      expect(result.error).toBe(true);
      expect(result.success).toBe(false);
      expect(result.message).toBe('Storage quota exceeded');
    });
  });

  describe('Key Validation', () => {
    it('should handle empty string keys', async () => {
      // Arrange
      const mockResponse = { data: { value: null } };
      mockInstanceGetItem.mockResolvedValue(mockResponse);

      // Act - when key is empty string, service still uses the empty string key
      const result = await service.getInstanceStorage('');

      // Assert
      expect(result.error).toBe(false);
      expect(result.success).toBe(true);
      expect(mockInstanceGetItem).toHaveBeenCalledWith('');
    });

    it('should use default key when no key provided', async () => {
      // Arrange
      const mockResponse = { data: { value: null } };
      mockInstanceGetItem.mockResolvedValue(mockResponse);

      // Act - when no key is provided, service should use default key
      const result = await service.getInstanceStorage();

      // Assert
      expect(result.error).toBe(false);
      expect(result.success).toBe(true);
      expect(mockInstanceGetItem).toHaveBeenCalledWith('my_example_key');
    });

    it('should handle special character keys', async () => {
      // Arrange
      const specialKey = 'test-key_with.special@chars';
      const mockResponse = { data: { value: 'special-value' } };
      mockInstanceGetItem.mockResolvedValue(mockResponse);

      // Act
      const result = await service.getInstanceStorage(specialKey);

      // Assert
      expect(result.error).toBe(false);
      expect(result.success).toBe(true);
      expect(result.value).toEqual(mockResponse.data.value);
      expect(mockInstanceGetItem).toHaveBeenCalledWith(specialKey);
    });
  });

  describe('Value Types', () => {
    it('should handle string values', async () => {
      // Arrange
      const mockResponse = { success: true };
      mockInstanceSetItem.mockResolvedValue(mockResponse);

      // Act
      const result = await service.setInstanceStorage('string-value', 'test-key');

      // Assert
      expect(result.error).toBe(false);
      expect(result.success).toBe(true);
      expect(mockInstanceSetItem).toHaveBeenCalledWith('test-key', 'string-value');
    });

    it('should handle JSON string values', async () => {
      // Arrange
      const mockResponse = { success: true };
      mockInstanceSetItem.mockResolvedValue(mockResponse);

      // Act
      const result = await service.setInstanceStorage('42', 'test-key');

      // Assert
      expect(result.error).toBe(false);
      expect(result.success).toBe(true);
      expect(mockInstanceSetItem).toHaveBeenCalledWith('test-key', '42');
    });

    it('should handle boolean string values', async () => {
      // Arrange
      const mockResponse = { success: true };
      mockInstanceSetItem.mockResolvedValue(mockResponse);

      // Act
      const result = await service.setInstanceStorage('true', 'test-key');

      // Assert
      expect(result.error).toBe(false);
      expect(result.success).toBe(true);
      expect(mockInstanceSetItem).toHaveBeenCalledWith('test-key', 'true');
    });

    it('should handle empty string values', async () => {
      // Arrange
      const mockResponse = { success: true };
      mockInstanceSetItem.mockResolvedValue(mockResponse);

      // Act
      const result = await service.setInstanceStorage('', 'test-key');

      // Assert
      expect(result.error).toBe(false);
      expect(result.success).toBe(true);
      expect(mockInstanceSetItem).toHaveBeenCalledWith('test-key', '');
    });
  });
}); 