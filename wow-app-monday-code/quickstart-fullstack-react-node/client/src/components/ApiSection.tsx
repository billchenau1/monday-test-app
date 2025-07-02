import React from 'react';
import { Button, Box, Heading, Text, Flex, TextArea } from "@vibe/core";
import { ApiResponse, BoardData, MeData, UserData } from '../types/monday.types';
import { ResponseDisplay } from './ResponseDisplay';

interface ApiSectionProps {
  // API data
  apiData: ApiResponse<{ me: MeData; boards: BoardData[] }> | null;
  apiLoading: boolean;
  users: ApiResponse<{ users: UserData[] }> | null;
  
  // Custom query state
  customQuery: string;
  customQueryResult: ApiResponse | null;
  showCustomQuery: boolean;
  
  // API playground state
  apiPlaygroundQuery: string;
  apiPlaygroundResult: ApiResponse | null;
  showApiPlayground: boolean;
  apiQueryType: 'client' | 'server';
  
  // Event handlers
  onFetchBoardData: () => void;
  onGetUsers: () => void;
  onExecuteCustomQuery: () => void;
  onExecuteApiPlayground: () => void;
  onToggleCustomQuery: () => void;
  onToggleApiPlayground: () => void;
  onUpdateCustomQuery: (query: string) => void;
  onUpdateApiPlaygroundQuery: (query: string) => void;
  onSetApiQueryType: (type: 'client' | 'server') => void;
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
  customQuery,
  customQueryResult,
  showCustomQuery,
  apiPlaygroundQuery,
  apiPlaygroundResult,
  showApiPlayground,
  apiQueryType,
  onFetchBoardData,
  onGetUsers,
  onExecuteCustomQuery,
  onExecuteApiPlayground,
  onToggleCustomQuery,
  onToggleApiPlayground,
  onUpdateCustomQuery,
  onUpdateApiPlaygroundQuery,
  onSetApiQueryType,
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
              data={customQueryResult} 
              title="Custom Query Response"
              testId="custom-query-response"
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
            🎮 API Playground - Client/Server Testing:
          </Text>
          <Flex gap="small" style={{ marginBottom: '10px' }}>
            <Button 
              size="small" 
              kind={apiQueryType === 'client' ? 'primary' : 'secondary'}
              onClick={() => onSetApiQueryType('client')}
              data-testid="client-side-btn"
            >
              Client-side
            </Button>
            <Button 
              size="small" 
              kind={apiQueryType === 'server' ? 'primary' : 'secondary'}
              onClick={() => onSetApiQueryType('server')}
              data-testid="server-side-btn"
            >
              Server-side
            </Button>
          </Flex>
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
            Execute {apiQueryType === 'client' ? 'Client-side' : 'Server-side'} Query
          </Button>
          {apiPlaygroundResult && (
            <ResponseDisplay 
              data={apiPlaygroundResult} 
              title="API Playground Response"
              testId="api-playground-response"
            />
          )}
        </Box>
      )}

      {/* Main API Data Display */}
      {apiData && (
        <Box 
          style={{ 
            padding: '15px', 
            backgroundColor: '#f0f9ff', 
            borderRadius: '8px', 
            border: '1px solid #e0f2fe' 
          }}
          data-testid="main-api-data"
        >
          <Text weight="bold" color="primary">📊 API Response Data:</Text>
          {apiData.error ? (
            <Box style={{ marginTop: '10px' }}>
              <Text color="danger" weight="bold">❌ Error occurred:</Text>
              <Text size="small" color="danger">{apiData.message}</Text>
              <ResponseDisplay 
                data={apiData} 
                title="Full Error Response"
                testId="api-error-response"
                isError={true}
              />
              {apiData.data?.me && (
                <Box style={{ marginTop: '10px' }}>
                  <Text weight="bold">📋 Fallback Demo Data:</Text>
                  <Text>👤 Name: {apiData.data.me.name}</Text>
                  <Text>📧 Email: {apiData.data.me.email}</Text>
                  <Text>🏢 Account: {apiData.data.me.account?.name}</Text>
                </Box>
              )}
            </Box>
          ) : (
            <Box data-testid="api-success-data">
              <Text>👤 Name: {apiData.data?.me?.name}</Text>
              <Text>📧 Email: {apiData.data?.me?.email}</Text>
              <Text>🏢 Account: {apiData.data?.me?.account?.name}</Text>
              <Text weight="bold" style={{ marginTop: '10px' }} color="primary">
                📋 Your Boards ({apiData.data?.boards?.length}):
              </Text>
              {apiData.data?.boards?.slice(0, 3).map((board: BoardData) => (
                <Box key={board.id} style={{ marginLeft: '10px', marginTop: '5px' }}>
                  <Text>• <strong>{board.name}</strong></Text>
                  <Text size="small">  ID: {board.id}</Text>
                  <Text size="small">  Description: {board.description || 'No description'}</Text>
                  <Text size="small">  State: {board.state}</Text>
                  <Text size="small">  Type: {board.board_kind}</Text>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      )}

      {/* Users Data Display */}
      {users && (
        <ResponseDisplay 
          data={users} 
          title="👥 Users Data - Raw Response"
          testId="users-data-response"
          containerStyle={{ marginTop: '10px' }}
        />
      )}
    </Box>
  );
}; 