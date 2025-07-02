import React from 'react';
import { Button, Box, Heading, Text, Flex } from "@vibe/core";
import { ResponseDisplay } from './ResponseDisplay';

interface ExecuteTabProps {
  executeResults: Record<string, any>;
  onExecuteAction: (action: string, params?: any) => void;
}

/**
 * ExecuteTab Component
 * Contains all monday.execute actions and notifications
 */
export const ExecuteTab: React.FC<ExecuteTabProps> = ({
  executeResults,
  onExecuteAction,
}) => {
  const executeActions = [
    { id: 'notice', label: '🔔 Show Notice', description: 'Display a notification message' },
    { id: 'confirm', label: '✅ Confirm Action', description: 'Show confirmation dialog' },
    { id: 'fileUpload', label: '📎 File Upload', description: 'Trigger file upload dialog' },
    { id: 'valueCreatedForUser', label: '🎉 Value Created', description: 'Notify value creation' },
    { id: 'openSettings', label: '⚙️ Open Settings', description: 'Open app settings panel' },
    { id: 'openItemCard', label: '📋 Open Item Card', description: 'Open item detail view' },
    { id: 'openLinkInTab', label: '🔗 Open Link', description: 'Open external link' },
    { id: 'expandApp', label: '📈 Expand App', description: 'Expand app view' },
    { id: 'collapseApp', label: '📉 Collapse App', description: 'Collapse app view' }
  ];

  return (
    <Box>
      <Heading type="h4">⚡ Execute Actions (monday.execute)</Heading>
      <Text size="small" color="secondary" style={{ marginBottom: '15px' }}>
        Trigger Monday platform actions and notifications
      </Text>

      {/* Action Buttons Grid */}
      <Box style={{ marginBottom: '20px' }}>
        <Flex gap="medium" wrap>
          {executeActions.map((action) => (
            <Button
              key={action.id}
              size="small"
              onClick={() => onExecuteAction(action.id)}
              style={{
                minWidth: '150px',
                height: '50px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                fontSize: '12px'
              }}
              data-testid={`execute-${action.id}-btn`}
            >
              <div style={{ marginBottom: '2px' }}>{action.label}</div>
              <div style={{ fontSize: '9px', opacity: 0.7 }}>{action.description}</div>
            </Button>
          ))}
        </Flex>
      </Box>

      {/* Execute Results */}
      {Object.keys(executeResults).length > 0 && (
        <Box style={{ marginTop: '20px' }}>
          <ResponseDisplay 
            data={executeResults} 
            title="Execute Results"
            testId="execute-results"
          />
        </Box>
      )}

      {/* Execute Action Guidelines */}
      <Box style={{ marginTop: '30px', padding: '15px', backgroundColor: '#fff3cd', borderRadius: '8px' }}>
        <Heading type="h5">💡 Execute Actions Guide</Heading>
        <Text size="small" style={{ marginBottom: '10px' }}>
          These actions interact directly with the Monday platform:
        </Text>
        
        <Flex direction="column" gap="xsmall">
          <Text size="small">• <strong>Notice:</strong> Shows success/error notifications to users</Text>
          <Text size="small">• <strong>Confirm:</strong> Displays confirmation dialogs for important actions</Text>
          <Text size="small">• <strong>File Upload:</strong> Opens file upload interface (requires board context)</Text>
          <Text size="small">• <strong>Value Created:</strong> Triggers analytics event for value tracking</Text>
          <Text size="small">• <strong>Settings/Item Card:</strong> Navigate to specific Monday.com views</Text>
          <Text size="small">• <strong>Expand/Collapse:</strong> Control app view size within Monday.com</Text>
        </Flex>
      </Box>
    </Box>
  );
}; 