import React, { useState } from 'react';
import { Button, Box, Heading, Text, Flex, TextArea, Divider } from "@vibe/core";
import { mondayApiService } from '../services/mondayApiService';
import { ResponseDisplay } from './ResponseDisplay';

/**
 * Local API Tester Component
 * For testing API functions locally without Monday iframe context
 */
export const LocalApiTester: React.FC = () => {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [customQuery, setCustomQuery] = useState('query GetMyInfo { me { id name email } }');

  const addTestResult = (title: string, result: any) => {
    setTestResults(prev => [...prev, { title, result, timestamp: new Date().toLocaleTimeString() }]);
  };

  const runAllTests = async () => {
    setLoading(true);
    setTestResults([]);
    addTestResult('🚀 Test Session Started', { message: 'Running comprehensive API tests...' });

    try {
      // Test 1: Fetch Board Data
      addTestResult('📊 Fetching Board Data', { status: 'Starting...' });
      const boardData = await mondayApiService.fetchBoardData();
      addTestResult('📊 Board Data Result', boardData);

      // Test 2: Get Users
      addTestResult('👥 Getting Users', { status: 'Starting...' });
      const users = await mondayApiService.getUsers();
      addTestResult('👥 Users Result', users);

      // Test 3: Custom Query
      addTestResult('🔧 Custom Query Test', { status: 'Starting...' });
      const customResult = await mondayApiService.executeCustomQuery(customQuery);
      addTestResult('🔧 Custom Query Result', customResult);

      // Test 4: API Playground
      addTestResult('🎮 API Playground Test', { status: 'Starting...' });
      const playgroundResult = await mondayApiService.executeApiPlaygroundQuery(
        'query GetMyInfoWithAccount { me { id name email account { id name } } }',
        'client'
      );
      addTestResult('🎮 API Playground Result', playgroundResult);

      addTestResult('✅ All Tests Completed', { 
        message: 'All API tests completed successfully!',
        totalTests: 4,
        timestamp: new Date().toISOString()
      });

    } catch (error: any) {
      addTestResult('❌ Test Error', { 
        error: error.message,
        stack: error.stack 
      });
    } finally {
      setLoading(false);
    }
  };

  const testSingleFunction = async (testName: string, testFn: () => Promise<any>) => {
    setLoading(true);
    try {
      addTestResult(`🔄 ${testName}`, { status: 'Starting...' });
      const result = await testFn();
      addTestResult(`✅ ${testName} Result`, result);
    } catch (error: any) {
      addTestResult(`❌ ${testName} Error`, { 
        error: error.message,
        stack: error.stack 
      });
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <Box style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <Heading type="h2">🧪 Local API Testing Suite</Heading>
      <Text size="small" color="secondary" style={{ marginBottom: '20px' }}>
        Test Monday API functions locally with mock data. Note: Real API calls will fail outside Monday iframe.
      </Text>

      {/* Control Panel */}
      <Box style={{ 
        padding: '15px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '8px', 
        marginBottom: '20px' 
      }}>
        <Flex gap="medium" wrap style={{ marginBottom: '15px' }}>
          <Button 
            onClick={runAllTests} 
            disabled={loading}
            loading={loading}
            size="medium"
          >
            {loading ? "Running Tests..." : "🚀 Run All Tests"}
          </Button>
          <Button 
            onClick={() => testSingleFunction('Board Data', () => mondayApiService.fetchBoardData())}
            disabled={loading}
            size="small"
            kind="secondary"
          >
            📊 Test Board Data
          </Button>
          <Button 
            onClick={() => testSingleFunction('Users', () => mondayApiService.getUsers())}
            disabled={loading}
            size="small"
            kind="secondary"
          >
            👥 Test Users
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
            onChange={setCustomQuery}
            placeholder="Enter your GraphQL query here..."
            rows={3}
            style={{ marginBottom: '8px' }}
          />
          <Button
            onClick={() => testSingleFunction('Custom Query', () => mondayApiService.executeCustomQuery(customQuery))}
            disabled={loading}
            size="small"
          >
            🔧 Test Custom Query
          </Button>
        </Box>
      </Box>

      <Divider />

      {/* Results Display */}
      <Box style={{ marginTop: '20px' }}>
        <Heading type="h4" style={{ marginBottom: '15px' }}>
          📋 Test Results ({testResults.length})
        </Heading>
        
        {testResults.length === 0 && (
          <Box style={{ 
            padding: '20px', 
            textAlign: 'center', 
            backgroundColor: '#f0f0f0', 
            borderRadius: '8px' 
          }}>
            <Text color="secondary">No test results yet. Run some tests to see results here.</Text>
          </Box>
        )}

        {testResults.map((result, index) => (
          <Box 
            key={index}
            style={{ 
              marginBottom: '15px',
              padding: '10px',
              backgroundColor: '#ffffff',
              border: '1px solid #e0e0e0',
              borderRadius: '6px'
            }}
          >
            <Flex justify="space-between" align="center" style={{ marginBottom: '8px' }}>
              <Text weight="bold">{result.title}</Text>
              <Text size="small" color="secondary">{result.timestamp}</Text>
            </Flex>
            <ResponseDisplay 
              data={result.result} 
              title=""
              testId={`test-result-${index}`}
            />
          </Box>
        ))}
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