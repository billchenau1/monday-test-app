import React from 'react';
import { Button, Box, Heading, Text, Flex, TextArea } from "@vibe/core";
import { ApiResponse, BoardData, MeData, UserData } from '../types/monday.types';
import ResponseDisplay from './ResponseDisplay';

interface ApiSectionProps {
  // API data
  apiData: ApiResponse<{ boards: BoardData[] }> | null;
  apiLoading: boolean;
  users: ApiResponse<{ users: UserData[] }> | null;
  latestApiResponse: (ApiResponse & { apiCallType?: string }) | null;
  
  // Custom query state
  customQuery: string;
  customQueryResult: ApiResponse | null;
  showCustomQuery: boolean;
  
  // API playground state
  apiPlaygroundQuery: string;
  apiPlaygroundResult: ApiResponse | null;
  showApiPlayground: boolean;
  
  // Event handlers
  onFetchBoardData: () => void;
  onGetUsers: () => void;
  onExecuteCustomQuery: () => void;
  onExecuteApiPlayground: () => void;
  onToggleCustomQuery: () => void;
  onToggleApiPlayground: () => void;
  onUpdateCustomQuery: (query: string) => void;
  onUpdateApiPlaygroundQuery: (query: string) => void;

}

/**
 * API Section Component
 * Handles all Monday API related UI and interactions
 * Follows separation of concerns principle
 */
export const ApiSection: React.FC<ApiSectionProps> = ({
  apiData,
  apiLoading,
  users,
  latestApiResponse,
  customQuery,
  customQueryResult,
  showCustomQuery,
  apiPlaygroundQuery,
  apiPlaygroundResult,
  showApiPlayground,

  onFetchBoardData,
  onGetUsers,
  onExecuteCustomQuery,
  onExecuteApiPlayground,
  onToggleCustomQuery,
  onToggleApiPlayground,
  onUpdateCustomQuery,
  onUpdateApiPlaygroundQuery,

}) => {
  return (
    <Box>
      <Heading type="h4">🔗 Monday API Integration (monday.api)</Heading>
      <Text size="small" color="secondary" style={{ marginBottom: '10px' }}>
        Using Seamless Authentication - no API tokens needed! Queries automatically authenticated when running in Monday iframe.
      </Text>
      
      {/* Main API Actions */}
      <Flex gap="medium" wrap style={{ marginBottom: '15px' }}>
        <Button 
          onClick={onFetchBoardData} 
          disabled={apiLoading} 
          loading={apiLoading}
          data-testid="fetch-board-data-btn"
        >
          {apiLoading ? "Loading..." : "🎯 Fetch Board Data"}
        </Button>
        <Button 
          size="small" 
          onClick={onGetUsers}
          data-testid="get-users-btn"
        >
          Get Users
        </Button>
        <Button 
          kind="secondary" 
          size="small"
          onClick={onToggleCustomQuery}
          data-testid="toggle-custom-query-btn"
        >
          {showCustomQuery ? "Hide" : "Show"} Custom Query
        </Button>
        <Button 
          kind="tertiary" 
          size="small"
          onClick={onToggleApiPlayground}
          data-testid="toggle-api-playground-btn"
        >
          {showApiPlayground ? "Hide" : "Show"} API Playground
        </Button>
      </Flex>
      
      {/* Custom Query Section */}
      {showCustomQuery && (
        <Box 
          style={{ 
            padding: '15px', 
            backgroundColor: '#f0f4ff', 
            borderRadius: '8px', 
            marginBottom: '15px' 
          }}
          data-testid="custom-query-section"
        >
          <Text weight="bold" style={{ marginBottom: '10px' }}>Custom GraphQL Query:</Text>
          <TextArea 
            value={customQuery}
            onChange={onUpdateCustomQuery}
            placeholder="query { me { id name email } }"
            rows={6}
            data-testid="custom-query-textarea"
          />
          <Button 
            onClick={onExecuteCustomQuery} 
            style={{ marginTop: '10px' }}
            data-testid="execute-custom-query-btn"
          >
            Execute Query
          </Button>
          {customQueryResult && (
            <ResponseDisplay 
              response={customQueryResult} 
              title="Custom Query Response"
            />
          )}
        </Box>
      )}

      {/* API Playground Section */}
      {showApiPlayground && (
        <Box 
          style={{ 
            padding: '15px', 
            backgroundColor: '#fff9e0', 
            borderRadius: '8px', 
            marginBottom: '15px', 
            border: '1px solid #ffc107' 
          }}
          data-testid="api-playground-section"
        >
          <Text weight="bold" style={{ marginBottom: '10px' }}>
            🎮 API Playground - Custom Query Testing:
          </Text>
          <TextArea 
            value={apiPlaygroundQuery}
            onChange={onUpdateApiPlaygroundQuery}
            placeholder="query { me { id name email account { name } } }"
            rows={8}
            data-testid="api-playground-textarea"
          />
          <Button 
            onClick={onExecuteApiPlayground} 
            style={{ marginTop: '10px' }}
            data-testid="execute-api-playground-btn"
          >
            Execute Query
          </Button>
          {apiPlaygroundResult && (
            <ResponseDisplay 
              response={apiPlaygroundResult} 
              title="API Playground Response"
            />
          )}
        </Box>
      )}

      {/* Single Latest API Response Display */}
      {latestApiResponse && (
        <Box 
          style={{ 
            padding: '15px', 
            backgroundColor: '#f0f9ff', 
            borderRadius: '8px', 
            border: '1px solid #e0f2fe',
            marginTop: '15px'
          }}
          data-testid="latest-api-response"
        >
          <Text weight="bold" color="primary">
            📊 Latest API Response ({latestApiResponse.apiCallType || 'Unknown'}):
          </Text>
          <ResponseDisplay 
            response={latestApiResponse} 
            title={`${latestApiResponse.apiCallType || 'API'} Response`}
          />
        </Box>
      )}
    </Box>
  );
}; 