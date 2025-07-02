import React from 'react';
import { Button, Box, Heading, Text, Flex } from "@vibe/core";
import { StorageData } from '../types/monday.types';

interface StorageSectionProps {
  instanceStorage: StorageData | null;
  globalStorage: StorageData | null;
  onTestInstanceStorage: () => void;
  onSetInstanceStorageValue: () => void;
  onTestGlobalStorage: () => void;
  onSetGlobalStorageValue: () => void;
  onTestStorageAuth?: () => void;
}

/**
 * Storage Section Component
 * Handles all Monday storage operations UI
 * Separated for better code organization and testability
 */
export const StorageSection: React.FC<StorageSectionProps> = ({
  instanceStorage,
  globalStorage,
  onTestInstanceStorage,
  onSetInstanceStorageValue,
  onTestGlobalStorage,
  onSetGlobalStorageValue,
  onTestStorageAuth,
}) => {
  return (
    <Box>
      <Heading type="h4">💾 Monday Storage (monday.storage)</Heading>
      
      {/* Debug Section */}
      {onTestStorageAuth && (
        <Box style={{ padding: '10px', backgroundColor: '#fff3cd', borderRadius: '6px', marginBottom: '10px' }}>
          <Text size="small" weight="bold" style={{ marginBottom: '5px' }}>
            🔧 Debug Storage Authentication
          </Text>
          <Button 
            size="small" 
            onClick={onTestStorageAuth}
            data-testid="test-storage-auth-btn"
          >
            Test Storage Auth
          </Button>
        </Box>
             )}
       
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