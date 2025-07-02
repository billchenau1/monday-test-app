import React from 'react';
import { TextField, Button, Box, Heading, Text, Flex } from "@vibe/core";
import { StorageData } from '../types/monday.types';
import { ResponseDisplay } from './ResponseDisplay';

interface StorageSectionProps {
  storageExampleText: string;
  instanceStorage: StorageData | null;
  globalStorage: StorageData | null;
  onUpdateStorageText: (text: string) => void;
  onTestInstanceStorage: () => void;
  onSetInstanceStorageValue: () => void;
  onTestGlobalStorage: () => void;
  onSetGlobalStorageValue: () => void;
}

/**
 * Storage Section Component
 * Handles all Monday storage operations UI
 * Separated for better code organization and testability
 */
export const StorageSection: React.FC<StorageSectionProps> = ({
  storageExampleText,
  instanceStorage,
  globalStorage,
  onUpdateStorageText,
  onTestInstanceStorage,
  onSetInstanceStorageValue,
  onTestGlobalStorage,
  onSetGlobalStorageValue,
}) => {
  return (
    <Box>
      <Heading type="h4">💾 Monday Storage (monday.storage)</Heading>
      
      {/* Main Storage Input */}
      <TextField 
        title="My first text field" 
        value={storageExampleText} 
        onChange={onUpdateStorageText}
        data-testid="storage-text-field"
      />
      <Text size="small" color="secondary" style={{ marginBottom: '10px' }}>
        Type something and it will be saved to Monday storage!
      </Text>
      
      {/* Storage Action Buttons */}
      <Flex gap="small" wrap>
        <Button 
          size="small" 
          onClick={onTestInstanceStorage}
          data-testid="get-instance-storage-btn"
        >
          Get Instance Storage
        </Button>
        <Button 
          size="small" 
          onClick={onSetInstanceStorageValue}
          data-testid="set-instance-storage-btn"
        >
          Set Instance Storage
        </Button>
        <Button 
          size="small" 
          onClick={onTestGlobalStorage}
          data-testid="get-global-storage-btn"
        >
          Get Global Storage
        </Button>
        <Button 
          size="small" 
          onClick={onSetGlobalStorageValue}
          data-testid="set-global-storage-btn"
        >
          Set Global Storage
        </Button>
      </Flex>
      
      {/* Storage Results Display */}
      {(instanceStorage || globalStorage) && (
        <Box 
          style={{ 
            padding: '10px', 
            backgroundColor: '#f0f9ff', 
            borderRadius: '6px', 
            marginTop: '10px' 
          }}
          data-testid="storage-results"
        >
          {instanceStorage && (
            <Text 
              size="small" 
              style={{ display: 'block', marginBottom: '5px' }}
              data-testid="instance-storage-result"
            >
              Instance: {JSON.stringify(instanceStorage, null, 2)}
            </Text>
          )}
          {globalStorage && (
            <Text 
              size="small" 
              style={{ display: 'block' }}
              data-testid="global-storage-result"
            >
              Global: {JSON.stringify(globalStorage, null, 2)}
            </Text>
          )}
        </Box>
      )}
    </Box>
  );
}; 