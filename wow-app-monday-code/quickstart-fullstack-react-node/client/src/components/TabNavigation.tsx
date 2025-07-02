import React from 'react';
import { Button, Box, Flex } from "@vibe/core";

interface TabNavigationProps {
  activeTab: 'get' | 'storage' | 'api' | 'execute' | 'listen' | 'local';
  onTabChange: (tab: 'get' | 'storage' | 'api' | 'execute' | 'listen' | 'local') => void;
}

/**
 * Tab Navigation Component
 * Renders a horizontal tab bar for navigating between different Monday SDK methods
 */
export const TabNavigation: React.FC<TabNavigationProps> = ({ 
  activeTab, 
  onTabChange 
}) => {
  const tabs = [
    { id: 'get' as const, label: '📱 monday.get', description: 'Get Methods' },
    { id: 'storage' as const, label: '💾 monday.storage', description: 'Storage Operations' },
    { id: 'api' as const, label: '🚀 monday.api', description: 'API Calls' },
    { id: 'execute' as const, label: '⚡ monday.execute', description: 'Execute Actions' },
    { id: 'listen' as const, label: '🎧 monday.listen', description: 'Event Listeners' },
    { id: 'local' as const, label: '🧪 Local Testing', description: 'API Testing Suite' }
  ];

  return (
    <Box style={{ marginBottom: '20px' }}>
      <Flex 
        gap="small" 
        wrap 
        style={{ 
          borderBottom: '2px solid #e1e1e1',
          paddingBottom: '10px',
          marginBottom: '20px'
        }}
      >
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            size="medium"
            kind={activeTab === tab.id ? "primary" : "tertiary"}
            onClick={() => onTabChange(tab.id)}
            style={{
              minWidth: '180px',
              flexDirection: 'column',
              height: '60px',
              fontSize: '14px',
              fontWeight: activeTab === tab.id ? 'bold' : 'normal',
              border: activeTab === tab.id ? '2px solid #007bff' : '1px solid #ddd',
              borderRadius: '8px',
              transition: 'all 0.2s ease',
              boxShadow: activeTab === tab.id ? '0 2px 8px rgba(0,123,255,0.2)' : 'none'
            }}
            data-testid={`tab-${tab.id}`}
          >
            <div style={{ marginBottom: '2px' }}>{tab.label}</div>
            <div style={{ fontSize: '11px', opacity: 0.8 }}>{tab.description}</div>
          </Button>
        ))}
      </Flex>
    </Box>
  );
}; 