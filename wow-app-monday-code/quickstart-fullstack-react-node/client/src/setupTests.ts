// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock console methods to keep test output clean
global.console = {
  ...console,
  // Suppress console.log in tests unless specifically needed
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Global test utilities
beforeEach(() => {
  // Clear all mocks before each test
  jest.clearAllMocks();
}); 