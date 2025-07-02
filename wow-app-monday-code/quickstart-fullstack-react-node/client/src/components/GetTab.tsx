import React from 'react';
import { Button, Box, Heading, Text, Flex } from "@vibe/core";
import { ResponseDisplay } from './ResponseDisplay';

interface GetTabProps {
  itemIds: any;
  sessionToken: string | null;
  filter: any;
  locationData: any;
  theme: string;
  location: any;
  context: any;
  clientInfo: any;
  onGetItemIds: () => void;
  onGetSessionToken: () => void;
  onGetFilter: () => void;
  onGetLocationData: () => void;
}

/**
 * GetTab Component
 * Contains all monday.get methods and client information display
 */
export const GetTab: React.FC<GetTabProps> = ({
  itemIds,
  sessionToken,
  filter,
  locationData,
  theme,
  location,
  context,
  clientInfo,
  onGetItemIds,
  onGetSessionToken,
  onGetFilter,
  onGetLocationData,
}) => {
  return (
    <Box>
      <Heading type="h4">📱 Monday Get Methods (monday.get)</Heading>
      <Text size="small" color="secondary" style={{ marginBottom: '15px' }}>
        Retrieve various data from the Monday platform
      </Text>

      {/* Get Methods Buttons */}
      <Flex gap="medium" wrap style={{ marginBottom: '20px' }}>
        <Button size="small" onClick={onGetItemIds} data-testid="get-item-ids-btn">
          Get Item IDs
        </Button>
        <Button size="small" onClick={onGetSessionToken} data-testid="get-session-token-btn">
          Get Session Token
        </Button>
        <Button size="small" onClick={onGetFilter} data-testid="get-filter-btn">
          Get Filter
        </Button>
        <Button size="small" onClick={onGetLocationData} data-testid="get-location-btn">
          Get Location
        </Button>
      </Flex>

      {/* Results Display */}
      {itemIds && (
        <ResponseDisplay 
          data={itemIds} 
          title="Item IDs"
          testId="item-ids-response"
        />
      )}
      
      {sessionToken && (
        <Box style={{ padding: '10px', backgroundColor: '#f0f9ff', borderRadius: '6px', marginBottom: '10px' }}>
          <Text weight="bold">Session Token:</Text>
          <Text>{sessionToken}</Text>
        </Box>
      )}
      
      {filter && (
        <ResponseDisplay 
          data={filter} 
          title="Filter"
          testId="filter-response"
        />
      )}
      
      {locationData && (
        <ResponseDisplay 
          data={locationData} 
          title="Location"
          testId="location-response"
        />
      )}

      {/* Client Information Section */}
      <Box style={{ marginTop: '30px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <Heading type="h5">📱 Client Information</Heading>
        <Text size="small" color="secondary" style={{ marginBottom: '10px' }}>
          Real-time client data from Monday platform
        </Text>
        
        <Flex direction="column" gap="small">
          <Text>🎨 Theme: <strong>{theme || 'Light'}</strong></Text>
          <Text>📍 Location: <strong>{location?.pathname || '/board-view'}</strong></Text>
          <Text>⚙️ Context Status: <strong>{context ? 'Connected ✅' : 'Loading... ⏳'}</strong></Text>
          {clientInfo && (
            <Text>📊 Client Data: <strong>Loaded Successfully ✅</strong></Text>
          )}
        </Flex>
        
        <Box style={{ padding: '10px', backgroundColor: '#f0f9ff', borderRadius: '6px', marginTop: '10px' }}>
          <Text>📱 App Name: <strong>Enhanced Monday SDK Demo</strong></Text>
          <Text>🎯 Purpose: <strong>Comprehensive SDK Testing & Integration</strong></Text>
          <Text>🔧 Features: <strong>API, Storage, Events, Theme Support</strong></Text>
          {context && (
            <>
              <Text>🆔 Board ID: <strong>{context.boardId || 'N/A'}</strong></Text>
              <Text>📄 Item ID: <strong>{context.itemId || 'N/A'}</strong></Text>
              <Text>👤 User ID: <strong>{context.userId || 'N/A'}</strong></Text>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
}; 