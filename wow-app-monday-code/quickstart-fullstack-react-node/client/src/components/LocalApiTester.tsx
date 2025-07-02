import React, { useState } from 'react';
import { Button, Box, Heading, Text, Flex, TextArea, Divider } from "@vibe/core";
import { mondayApiService } from '../services/mondayApiService';

/**
 * Local API Tester Component
 * For testing API functions locally without Monday iframe context
 */
export const LocalApiTester: React.FC = () => {
  const [latestResult, setLatestResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [customQuery, setCustomQuery] = useState('query GetMyInfo { me { id name email } }');
  const [singleLoading, setSingleLoading] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, any>>({});

  const setTestResult = (title: string, result: any) => {
    setLatestResult({ 
      title, 
      result, 
      timestamp: new Date().toLocaleTimeString(),
      fullResponse: result // Store the complete response
    });
  };

  const testAllApiFunctions = async () => {
    setLoading(true);
    setResults({});
    const testResults: Record<string, any> = {};
    
    try {
      // Test Board Data - fetch all boards (up to 5)
      const boardData = await mondayApiService.fetchBoardData();
      testResults.boardData = boardData;
      setResults(prev => ({ ...prev, boardData }));

      // Test Users
      const users = await mondayApiService.getUsers();
      testResults.users = users;
      setResults(prev => ({ ...prev, users }));

      // Test Custom Query
      const customResult = await mondayApiService.executeCustomQuery(customQuery);
      testResults.customQuery = customResult;
      setResults(prev => ({ ...prev, customQuery: customResult }));

      // Test API Playground
      const playgroundResult = await mondayApiService.executeApiPlaygroundQuery(
        'query GetMyInfoWithAccount { me { id name email account { id name } } }'
      );
      testResults.playground = playgroundResult;
      setResults(prev => ({ ...prev, playground: playgroundResult }));

      // Set the latest result to a summary of all tests
      setTestResult('All API Functions Test Suite', {
        success: true,
        totalTests: 4,
        results: testResults,
        summary: 'Completed all API function tests'
      });

    } catch (error: any) {
      console.error('API testing error:', error);
      const errorResult = { 
        error: true, 
        message: error.message,
        fullResponse: error 
      };
      setResults(prev => ({ 
        ...prev, 
        error: errorResult
      }));
      setTestResult('All API Functions Test Suite', errorResult);
    } finally {
      setLoading(false);
    }
  };

  const testSingleFunction = async (name: string, fn: () => Promise<any>) => {
    setSingleLoading(name);
    try {
      const result = await fn();
      setResults(prev => ({ ...prev, [name.toLowerCase().replace(' ', '')]: result }));
      setTestResult(name, result);
    } catch (error: any) {
      console.error(`${name} error:`, error);
      const errorResult = { 
        error: true, 
        message: error.message,
        fullResponse: error 
      };
      setResults(prev => ({ 
        ...prev, 
        [name.toLowerCase().replace(' ', '')]: errorResult
      }));
      setTestResult(name, errorResult);
    } finally {
      setSingleLoading(null);
    }
  };

  const clearResults = () => {
    setLatestResult(null);
  };

  return (
    <Box style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <Heading type="h2">🧪 Local API Testing Suite</Heading>
      <Text size="small" color="secondary" style={{ marginBottom: '20px' }}>
        Test Monday API functions locally. Note: API calls will fail outside Monday iframe due to authentication context. Check the Latest Test Result section below to see responses.
      </Text>

      {/* Important Notice */}
      <Box style={{ 
        padding: '15px', 
        backgroundColor: '#fff3cd', 
        borderRadius: '8px', 
        marginBottom: '20px',
        border: '1px solid #ffeaa7'
      }}>
        <Text weight="bold" style={{ marginBottom: '8px' }}>⚠️ Authentication Notice:</Text>
        <Text size="small">
          Since we're running outside the Monday iframe context, API calls will fail due to missing authentication tokens. 
          However, you can still test the error handling and see the complete request/response structure including headers and debug information.
        </Text>
      </Box>

      {/* Control Panel */}
      <Box style={{ 
        padding: '15px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '8px', 
        marginBottom: '20px' 
      }}>
        <Flex gap="medium" wrap style={{ marginBottom: '15px' }}>
          <Button 
            onClick={testAllApiFunctions} 
            disabled={loading}
            loading={loading}
            size="medium"
          >
            {loading ? "Running Tests..." : "🚀 Run All Tests"}
          </Button>
          <Button 
            onClick={() => testSingleFunction('Board Data', () => mondayApiService.fetchBoardData())}
            disabled={singleLoading === 'Board Data'}
            size="small"
          >
            {singleLoading === 'Board Data' ? 'Testing...' : '🏁 Test Board Data'}
          </Button>
          <Button 
            onClick={() => testSingleFunction('Users', () => mondayApiService.getUsers())}
            disabled={singleLoading === 'Users'}
            size="small"
          >
            {singleLoading === 'Users' ? 'Testing...' : '👥 Test Users'}
          </Button>
          <Button 
            onClick={clearResults}
            size="small"
            kind="tertiary"
          >
            🗑️ Clear Results
          </Button>
        </Flex>

        {/* Custom Query Testing */}
        <Box>
          <Text weight="bold" style={{ marginBottom: '8px' }}>Custom Query Test:</Text>
          <TextArea
            value={customQuery}
            onChange={(event) => {
              // Handle both string and event object cases
              const value = typeof event === 'string' ? event : event?.target?.value || '';
              setCustomQuery(value);
            }}
            placeholder="Enter your GraphQL query here..."
            rows={3}
            style={{ marginBottom: '8px' }}
          />
          <Button
            onClick={() => testSingleFunction('Custom Query', () => mondayApiService.executeCustomQuery(customQuery))}
            disabled={singleLoading === 'Custom Query'}
            size="small"
          >
            {singleLoading === 'Custom Query' ? 'Testing...' : '🚀 Test Custom Query'}
          </Button>
        </Box>
      </Box>

      <Divider />

      {/* Latest Result Display */}
      <Box style={{ marginTop: '20px' }}>
        <Heading type="h4" style={{ marginBottom: '15px' }}>
          📋 Latest Test Result
        </Heading>
        
        {!latestResult && (
          <Box style={{ 
            padding: '20px', 
            textAlign: 'center', 
            backgroundColor: '#f0f0f0', 
            borderRadius: '8px' 
          }}>
            <Text color="secondary">No test results yet. Run a test to see the result here.</Text>
          </Box>
        )}

        {latestResult && (
          <Box 
            style={{ 
              marginBottom: '15px',
              padding: '15px',
              backgroundColor: '#ffffff',
              border: '2px solid #007bff',
              borderRadius: '8px'
            }}
          >
            <Flex justify="space-between" align="center" style={{ marginBottom: '12px' }}>
              <Text weight="bold" size="medium">{latestResult.title}</Text>
              <Text size="small" color="secondary">{latestResult.timestamp}</Text>
            </Flex>
            
            {/* Full Response Display */}
            <Box style={{ marginBottom: '10px' }}>
              <Text weight="bold" size="small" style={{ marginBottom: '5px' }}>📊 Full API Response:</Text>
              <Box style={{ 
                padding: '12px', 
                backgroundColor: '#f8f9fa', 
                borderRadius: '4px',
                fontFamily: 'monospace',
                fontSize: '12px',
                maxHeight: '400px',
                overflowY: 'auto',
                border: '1px solid #dee2e6'
              }}>
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                  {JSON.stringify(latestResult.fullResponse, null, 2)}
                </pre>
              </Box>
            </Box>
          </Box>
        )}
      </Box>

      {/* Instructions */}
      <Divider style={{ margin: '30px 0' }} />
      <Box style={{ 
        padding: '15px', 
        backgroundColor: '#e8f4f8', 
        borderRadius: '8px' 
      }}>
        <Heading type="h5" style={{ marginBottom: '10px' }}>💡 Testing Instructions</Heading>
        <Text size="small">
          • <strong>All Tests:</strong> Runs comprehensive test suite for all API functions<br/>
          • <strong>Individual Tests:</strong> Test specific API functions independently<br/>
          • <strong>Custom Query:</strong> Test your own GraphQL queries<br/>
          • <strong>Expected Behavior:</strong> API calls will show fallback/demo data since we're not in Monday iframe<br/>
          • <strong>Error Testing:</strong> Try invalid queries to test error handling
        </Text>
      </Box>
    </Box>
  );
}; 