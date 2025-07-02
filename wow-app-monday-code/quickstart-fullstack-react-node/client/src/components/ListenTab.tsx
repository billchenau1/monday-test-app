import React from 'react';
import { Box, Heading, Text, Flex } from "@vibe/core";
import { ResponseDisplay } from './ResponseDisplay';

interface ListenTabProps {
  contextListener: any;
  itemIdsListener: any;
  eventsListener: any;
  theme: string;
  location: any;
}

/**
 * ListenTab Component
 * Shows active event listeners and their current values
 */
export const ListenTab: React.FC<ListenTabProps> = ({
  contextListener,
  itemIdsListener,
  eventsListener,
  theme,
  location,
}) => {
  const listeners = [
    {
      name: '🔄 Context Changes',
      description: 'Listens for user, board, and item context changes',
      status: 'Active ✅',
      data: contextListener
    },
    {
      name: '🎨 Theme Changes', 
      description: 'Monitors light/dark mode switches',
      status: 'Active ✅',
      currentValue: theme || 'Light'
    },
    {
      name: '📍 Location Changes',
      description: 'Tracks navigation within Monday.com platform',
      status: 'Active ✅',
      currentValue: location?.pathname || '/board-view'
    },
    {
      name: '📄 Item IDs Changes',
      description: 'Monitors selected items in board views',
      status: 'Active ✅',
      data: itemIdsListener
    },
    {
      name: '⚙️ Settings Changes',
      description: 'Listens for configuration updates',
      status: 'Active ✅',
      data: eventsListener
    }
  ];

  return (
    <Box>
      <Heading type="h4">🎧 Event Listeners (monday.listen)</Heading>
      <Text size="small" color="secondary" style={{ marginBottom: '15px' }}>
        Active listeners for real-time Monday platform events
      </Text>

      {/* Active Listeners Status */}
      <Box style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#d4edda', borderRadius: '8px' }}>
        <Heading type="h5">📡 Active Listeners</Heading>
        <Flex direction="column" gap="small" style={{ marginTop: '10px' }}>
          {listeners.map((listener, index) => (
            <Box key={index} style={{ padding: '10px', backgroundColor: 'white', borderRadius: '6px' }}>
              <Flex justify="space-between" align="center">
                <Box>
                  <Text weight="bold">{listener.name}</Text>
                  <Text size="small" color="secondary">{listener.description}</Text>
                </Box>
                <Text size="small" weight="bold" style={{ color: '#28a745' }}>
                  {listener.status}
                </Text>
              </Flex>
              {listener.currentValue && (
                <Text size="small" style={{ marginTop: '5px', color: '#007bff' }}>
                  Current: <strong>{listener.currentValue}</strong>
                </Text>
              )}
            </Box>
          ))}
        </Flex>
      </Box>

      {/* Listener Data Display */}
      {(contextListener || itemIdsListener || eventsListener) && (
        <Box style={{ marginBottom: '20px' }}>
          <Heading type="h5">📊 Listener Results</Heading>
          
          {contextListener && (
            <ResponseDisplay 
              data={contextListener} 
              title="Context Listener Data"
              testId="context-listener-response"
            />
          )}
          
          {itemIdsListener && (
            <ResponseDisplay 
              data={itemIdsListener} 
              title="Item IDs Listener Data"
              testId="item-ids-listener-response"
            />
          )}
          
          {eventsListener && (
            <ResponseDisplay 
              data={eventsListener} 
              title="Events Listener Data"
              testId="events-listener-response"
            />
          )}
        </Box>
      )}

      {/* How Listeners Work */}
      <Box style={{ marginTop: '30px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <Heading type="h5">ℹ️ How Event Listeners Work</Heading>
        <Text size="small" style={{ marginBottom: '10px' }}>
          These listeners are automatically active and provide real-time updates:
        </Text>
        
        <Flex direction="column" gap="xsmall">
          <Text size="small">• <strong>Context Listener:</strong> Updates when user navigates between boards/items</Text>
          <Text size="small">• <strong>Theme Listener:</strong> Responds to light/dark mode changes</Text>
          <Text size="small">• <strong>Location Listener:</strong> Tracks URL changes within Monday.com</Text>
          <Text size="small">• <strong>Item IDs Listener:</strong> Monitors item selection in board views</Text>
          <Text size="small">• <strong>Settings Listener:</strong> Watches for app configuration changes</Text>
        </Flex>
        
        <Box style={{ marginTop: '15px', padding: '10px', backgroundColor: '#fff3cd', borderRadius: '6px' }}>
          <Text size="small">
            💡 <strong>Tip:</strong> Try switching themes, navigating to different boards, or selecting items to see listeners update in real-time!
          </Text>
        </Box>
      </Box>
    </Box>
  );
}; 