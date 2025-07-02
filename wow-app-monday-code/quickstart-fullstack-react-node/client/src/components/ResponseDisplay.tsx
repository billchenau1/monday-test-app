import React from 'react';
import { Box, Text } from "@vibe/core";

interface ResponseDisplayProps {
  data: any;
  title: string;
  testId?: string;
  isError?: boolean;
  containerStyle?: React.CSSProperties;
}

/**
 * ResponseDisplay Component
 * Displays API responses in a formatted, scrollable container
 * Handles both success and error responses
 */
export const ResponseDisplay: React.FC<ResponseDisplayProps> = ({
  data,
  title,
  testId,
  isError = false,
  containerStyle = {}
}) => {
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

  return (
    <Box style={baseStyle} data-testid={testId}>
      <Text weight="bold" style={{ marginBottom: '5px' }}>
        {title}:
      </Text>
      <pre style={preStyle}>
        {JSON.stringify(data, null, 2)}
      </pre>
    </Box>
  );
}; 