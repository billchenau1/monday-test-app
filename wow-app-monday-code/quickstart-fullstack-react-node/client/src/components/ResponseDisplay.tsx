import React, { useState } from 'react';
import { Box, Text, Button, Flex } from "@vibe/core";
import { ApiResponse } from '../types/monday.types';

interface ResponseDisplayProps {
  response: ApiResponse<any> | null;
  title: string;
  testId?: string;
  isError?: boolean;
  containerStyle?: React.CSSProperties;
}

/**
 * ResponseDisplay Component
 * Displays API responses with tabs for Request and Response information
 * Handles both success and error responses
 */
export const ResponseDisplay: React.FC<ResponseDisplayProps> = ({
  response,
  title,
  testId,
  isError = false,
  containerStyle = {}
}) => {
  const [activeTab, setActiveTab] = useState<'response' | 'request' | 'token'>('response');
  const [showToken, setShowToken] = useState(false);

  const baseStyle = {
    marginTop: '10px',
    padding: '10px',
    backgroundColor: 'white',
    borderRadius: '4px',
    ...containerStyle
  };

  const preStyle: React.CSSProperties = {
    whiteSpace: 'pre-wrap',
    fontSize: '12px',
    margin: 0,
    backgroundColor: isError ? '#fff0f0' : '#f5f5f5',
    padding: '8px',
    borderRadius: '4px',
    maxHeight: '300px',
    overflow: 'auto',
    border: isError ? '1px solid #ffcccc' : 'none'
  };

  const tabButtonStyle = (isActive: boolean): React.CSSProperties => ({
    fontSize: '12px',
    padding: '6px 12px',
    backgroundColor: isActive ? '#007bff' : '#f8f9fa',
    color: isActive ? 'white' : '#666',
    border: `1px solid ${isActive ? '#007bff' : '#ddd'}`,
    borderRadius: '4px 4px 0 0',
    cursor: 'pointer',
    marginRight: '2px'
  });

  if (!response) {
    return (
      <div style={{ padding: '20px', background: '#f8f9fa', borderRadius: '8px' }}>
        <h3>{title}</h3>
        <p style={{ color: '#666' }}>No response data available</p>
      </div>
    );
  }

  const hasRequestInfo = response.requestInfo !== undefined;
  const hasTokenInfo = hasRequestInfo && response.requestInfo?.token !== undefined;

  return (
    <Box style={baseStyle} data-testid={testId}>
      <Text weight="bold" style={{ marginBottom: '10px' }}>
        {title}:
      </Text>
      
      {/* Show tabs only when request info is available */}
      {hasRequestInfo && (
        <div style={{ marginBottom: '20px', borderBottom: '1px solid #ddd' }}>
          <div style={{ display: 'flex', gap: '0' }}>
            <button
              onClick={() => setActiveTab('response')}
              style={{
                padding: '10px 20px',
                border: 'none',
                backgroundColor: activeTab === 'response' ? '#0073ea' : '#e9ecef',
                color: activeTab === 'response' ? 'white' : '#333',
                cursor: 'pointer',
                borderRadius: '8px 8px 0 0',
                fontSize: '14px'
              }}
            >
              📊 Response
            </button>
            <button
              onClick={() => setActiveTab('request')}
              style={{
                padding: '10px 20px',
                border: 'none',
                backgroundColor: activeTab === 'request' ? '#0073ea' : '#e9ecef',
                color: activeTab === 'request' ? 'white' : '#333',
                cursor: 'pointer',
                borderRadius: '8px 8px 0 0',
                fontSize: '14px'
              }}
            >
              📤 Request
            </button>
            {hasTokenInfo && (
              <button
                onClick={() => setActiveTab('token')}
                style={{
                  padding: '10px 20px',
                  border: 'none',
                  backgroundColor: activeTab === 'token' ? '#0073ea' : '#e9ecef',
                  color: activeTab === 'token' ? 'white' : '#333',
                  cursor: 'pointer',
                  borderRadius: '8px 8px 0 0',
                  fontSize: '14px'
                }}
              >
                🔐 Auth Debug
              </button>
            )}
          </div>
        </div>
      )}

      {/* Response Tab */}
      {activeTab === 'response' && (
        <pre style={{ 
          background: 'white', 
          padding: '15px', 
          borderRadius: '5px', 
          overflow: 'auto',
          maxHeight: '400px',
          fontSize: '12px',
          lineHeight: '1.4'
        }}>
          {JSON.stringify({
            error: response.error,
            message: response.message,
            data: response.data,
            ...(response.fullResponse && { fullResponse: response.fullResponse })
          }, null, 2)}
        </pre>
      )}

      {/* Request Tab */}
      {activeTab === 'request' && hasRequestInfo && (
        <pre style={{ 
          background: 'white', 
          padding: '15px', 
          borderRadius: '5px', 
          overflow: 'auto',
          maxHeight: '400px',
          fontSize: '12px',
          lineHeight: '1.4'
        }}>
          {JSON.stringify({
            method: response.requestInfo.method,
            url: response.requestInfo.url,
            apiVersion: response.requestInfo.apiVersion,
            queryType: response.requestInfo.queryType,
            timestamp: response.requestInfo.timestamp,
            headers: response.requestInfo.headers,
            query: response.requestInfo.query,
            variables: response.requestInfo.variables
          }, null, 2)}
        </pre>
      )}

      {/* Token Debug Tab */}
      {activeTab === 'token' && hasTokenInfo && (
        <div style={{ 
          background: 'white', 
          padding: '15px', 
          borderRadius: '5px'
        }}>
          <div style={{ marginBottom: '15px' }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>Authentication Debug</h4>
            <p style={{ margin: '0 0 15px 0', color: '#666', fontSize: '14px' }}>
              Use this information to debug authentication issues with the Monday API.
            </p>
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <button
              onClick={() => setShowToken(!showToken)}
              style={{
                padding: '8px 16px',
                backgroundColor: showToken ? '#dc3545' : '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              {showToken ? '🙈 Hide Token' : '👁️ Show Token'}
            </button>
          </div>

          <pre style={{ 
            background: '#f8f9fa', 
            padding: '10px', 
            borderRadius: '4px', 
            fontSize: '12px',
            lineHeight: '1.4'
          }}>
            {JSON.stringify({
              tokenStatus: response.requestInfo.token ? 'Available' : 'Not Available',
              tokenPreview: showToken ? response.requestInfo.token : (response.requestInfo.token ? '[HIDDEN - Click Show Token]' : 'No token available'),
              authMethod: 'SeamlessApiClient',
              apiVersion: response.requestInfo.apiVersion,
              endpoint: response.requestInfo.url
            }, null, 2)}
          </pre>
        </div>
      )}
    </Box>
  );
};

export default ResponseDisplay; 