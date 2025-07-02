import React from "react";
import "./App.css";
import "@vibe/core/tokens";
//Explore more Monday React Components here: https://vibe.monday.com/
import { Loader, Flex, Box, Heading, Text, Divider, Button } from "@vibe/core";

// Import custom components and hooks following modular architecture
import { useMondayApp } from "./hooks/useMondayApp";
import { ApiSection } from "./components/ApiSection";
import { StorageSection } from "./components/StorageSection";
import { ResponseDisplay } from "./components/ResponseDisplay";
import { LocalApiTester } from "./components/LocalApiTester";

/**
 * Main App Component
 * Refactored to follow modular architecture and separation of concerns
 * Uses custom hook for state management and separate components for UI sections
 */
const App = () => {
    // Use custom hook for all Monday app functionality
    const mondayApp = useMondayApp();

    // Show loading only briefly at the very beginning
    if (mondayApp.initLoading && !mondayApp.context) {
        return (
            <div className="App">
                <Box padding="large">
                    <Flex direction="column" align="center" justify="center" gap="medium">
                        <Loader size="medium" />
                        <Text>Loading Enhanced Monday SDK Demo...</Text>
                    </Flex>
                </Box>
            </div>
        );
    }

    return (
        <div className="App" style={{ overflowX: 'auto', width: '100%' }}>
            <Box padding="medium" style={{ minWidth: '1000px', width: 'fit-content' }}>
                <Heading type="h2" style={{ marginBottom: '20px' }}>
                    🚀 Comprehensive Monday SDK Test Suite
                </Heading>
                
                {/* Local Testing Mode Toggle */}
                <Box style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#fff3cd', borderRadius: '6px' }}>
                    <Text size="small" weight="bold">
                        💡 For Local Testing: Scroll down to find the "Local API Testing Suite" section to test API functions outside Monday iframe.
                    </Text>
                </Box>
                
                <Flex direction="column" gap="large">
                    {/* Storage Section */}
                    <StorageSection
                        storageExampleText={mondayApp.storageExampleText}
                        instanceStorage={mondayApp.instanceStorage}
                        globalStorage={mondayApp.globalStorage}
                        onUpdateStorageText={mondayApp.updateStorageText}
                        onTestInstanceStorage={mondayApp.testInstanceStorage}
                        onSetInstanceStorageValue={mondayApp.setInstanceStorageValue}
                        onTestGlobalStorage={mondayApp.testGlobalStorage}
                        onSetGlobalStorageValue={mondayApp.setGlobalStorageValue}
                    />

                    <Divider />

                    {/* Monday.get Section */}
                    <Box>
                        <Heading type="h4">📱 Monday Get Methods (monday.get)</Heading>
                        <Text size="small" color="secondary" style={{ marginBottom: '10px' }}>
                            Retrieve various data from the Monday platform
                        </Text>
                        <Flex gap="medium" wrap style={{ marginBottom: '15px' }}>
                            <Button size="small" onClick={mondayApp.getItemIds}>Get Item IDs</Button>
                            <Button size="small" onClick={mondayApp.getSessionToken}>Get Session Token</Button>
                            <Button size="small" onClick={mondayApp.getFilter}>Get Filter</Button>
                            <Button size="small" onClick={mondayApp.getLocationData}>Get Location</Button>
                        </Flex>
                        {mondayApp.itemIds && (
                            <ResponseDisplay 
                                data={mondayApp.itemIds} 
                                title="Item IDs"
                                testId="item-ids-response"
                            />
                        )}
                        {mondayApp.sessionToken && (
                            <Box style={{ padding: '10px', backgroundColor: '#f0f9ff', borderRadius: '6px', marginBottom: '10px' }}>
                                <Text weight="bold">Session Token:</Text>
                                <Text>{mondayApp.sessionToken}</Text>
                            </Box>
                        )}
                        {mondayApp.filter && (
                            <ResponseDisplay 
                                data={mondayApp.filter} 
                                title="Filter"
                                testId="filter-response"
                            />
                        )}
                        {mondayApp.locationData && (
                            <ResponseDisplay 
                                data={mondayApp.locationData} 
                                title="Location"
                                testId="location-response"
                            />
                        )}
                    </Box>

                    <Divider />

                    {/* API Section */}
                    <ApiSection
                        apiData={mondayApp.apiData}
                        apiLoading={mondayApp.apiLoading}
                        users={mondayApp.users}
                        customQuery={mondayApp.customQuery}
                        customQueryResult={mondayApp.customQueryResult}
                        showCustomQuery={mondayApp.showCustomQuery}
                        apiPlaygroundQuery={mondayApp.apiPlaygroundQuery}
                        apiPlaygroundResult={mondayApp.apiPlaygroundResult}
                        showApiPlayground={mondayApp.showApiPlayground}
                        apiQueryType={mondayApp.apiQueryType}
                        onFetchBoardData={mondayApp.fetchBoardData}
                        onGetUsers={mondayApp.getUsers}
                        onExecuteCustomQuery={mondayApp.executeCustomQuery}
                        onExecuteApiPlayground={mondayApp.executeApiPlayground}
                        onToggleCustomQuery={mondayApp.toggleCustomQuery}
                        onToggleApiPlayground={mondayApp.toggleApiPlayground}
                        onUpdateCustomQuery={mondayApp.updateCustomQuery}
                        onUpdateApiPlaygroundQuery={mondayApp.updateApiPlaygroundQuery}
                        onSetApiQueryType={mondayApp.setApiQueryType}
                    />

                    <Divider />

                    {/* Execute Actions Section */}
                    <Box>
                        <Heading type="h4">⚡ Execute Actions (monday.execute)</Heading>
                        <Text size="small" color="secondary" style={{ marginBottom: '10px' }}>
                            Trigger Monday platform actions and notifications
                        </Text>
                        <Flex gap="medium" wrap>
                            <Button size="small" onClick={() => mondayApp.executeAction("notice")}>🔔 Show Notice</Button>
                            <Button size="small" onClick={() => mondayApp.executeAction("confirm")}>✅ Confirm Action</Button>
                            <Button size="small" onClick={() => mondayApp.executeAction("fileUpload")}>📎 File Upload</Button>
                            <Button size="small" onClick={() => mondayApp.executeAction("valueCreatedForUser")}>🎉 Value Created</Button>
                            <Button size="small" onClick={() => mondayApp.executeAction("openSettings")}>⚙️ Open Settings</Button>
                            <Button size="small" onClick={() => mondayApp.executeAction("openItemCard")}>📋 Open Item Card</Button>
                            <Button size="small" onClick={() => mondayApp.executeAction("openLinkInTab")}>🔗 Open Link</Button>
                            <Button size="small" onClick={() => mondayApp.executeAction("expandApp")}>📈 Expand App</Button>
                            <Button size="small" onClick={() => mondayApp.executeAction("collapseApp")}>📉 Collapse App</Button>
                        </Flex>
                        {Object.keys(mondayApp.executeResults).length > 0 && (
                            <ResponseDisplay 
                                data={mondayApp.executeResults} 
                                title="Execute Results"
                                testId="execute-results"
                            />
                        )}
                    </Box>

                    <Divider />

                    {/* Event Listeners Section */}
                    <Box>
                        <Heading type="h4">🎧 Event Listeners (monday.listen)</Heading>
                        <Text size="small" color="secondary" style={{ marginBottom: '10px' }}>
                            Active listeners for real-time Monday platform events
                        </Text>
                        <Flex direction="column" gap="xsmall">
                            <Text>✅ Context changes (user, board info)</Text>
                            <Text>✅ Theme changes (light/dark mode)</Text>
                            <Text>✅ Location changes (navigation)</Text>
                            <Text>✅ Settings changes (configuration)</Text>
                        </Flex>
                        {(mondayApp.contextListener || mondayApp.itemIdsListener || mondayApp.eventsListener) && (
                            <Box style={{ padding: '10px', backgroundColor: '#f0f9ff', borderRadius: '6px', marginTop: '10px' }}>
                                <Text weight="bold">Listener Results:</Text>
                                {mondayApp.contextListener && <Text size="small">Context: {JSON.stringify(mondayApp.contextListener, null, 2)}</Text>}
                                {mondayApp.itemIdsListener && <Text size="small">ItemIds: {JSON.stringify(mondayApp.itemIdsListener, null, 2)}</Text>}
                                {mondayApp.eventsListener && <Text size="small">Events: {JSON.stringify(mondayApp.eventsListener, null, 2)}</Text>}
                            </Box>
                        )}
                    </Box>

                    <Divider />

                    {/* Client Info Section */}
                    <Box>
                        <Heading type="h4">📱 Client Information (monday.get)</Heading>
                        <Text size="small" color="secondary" style={{ marginBottom: '10px' }}>
                            Real-time client data from Monday platform
                        </Text>
                        <Flex direction="column" gap="small">
                            <Text>🎨 Theme: <strong>{mondayApp.theme || 'Light'}</strong></Text>
                            <Text>📍 Location: <strong>{mondayApp.location?.pathname || '/board-view'}</strong></Text>
                            <Text>⚙️ Context Status: <strong>{mondayApp.context ? 'Connected ✅' : 'Loading... ⏳'}</strong></Text>
                            {mondayApp.clientInfo && (
                                <Text>📊 Client Data: <strong>Loaded Successfully ✅</strong></Text>
                            )}
                        </Flex>
                        <Box style={{ padding: '10px', backgroundColor: '#f0f9ff', borderRadius: '6px', marginTop: '10px' }}>
                            <Text>📱 App Name: <strong>Enhanced Monday SDK Demo</strong></Text>
                            <Text>🔢 Current API Version: <strong>2024-10</strong></Text>
                            <Text>🔐 Authentication: <strong>Seamless Authentication (No tokens needed!)</strong></Text>
                            <Text>🛠️ Features: <strong>API, Storage, Events, Theme, Comprehensive Testing</strong></Text>
                        </Box>
                    </Box>

                    <Divider />

                    {/* Local API Testing Section */}
                    <LocalApiTester />
                </Flex>
            </Box>
        </div>
    );
};

export default App;
