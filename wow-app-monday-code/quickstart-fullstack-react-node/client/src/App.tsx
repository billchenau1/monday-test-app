import React from "react";
import "./App.css";
import "@vibe/core/tokens";
//Explore more Monday React Components here: https://vibe.monday.com/
import { Loader, Flex, Box, Heading, Text } from "@vibe/core";

// Import custom components and hooks following modular architecture
import { useMondayApp } from "./hooks/useMondayApp";
import { TabNavigation } from "./components/TabNavigation";
import { GetTab } from "./components/GetTab";
import { StorageSection } from "./components/StorageSection";
import { ApiSection } from "./components/ApiSection";
import { ExecuteTab } from "./components/ExecuteTab";
import { ListenTab } from "./components/ListenTab";
import { LocalApiTester } from "./components/LocalApiTester";

/**
 * Main App Component
 * Now uses a clean tabbed interface to organize Monday SDK methods
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

    // Render tab content based on active tab
    const renderTabContent = () => {
        switch (mondayApp.activeTab) {
            case 'get':
                return (
                    <GetTab
                        itemIds={mondayApp.itemIds}
                        sessionToken={mondayApp.sessionToken}
                        filter={mondayApp.filter}
                        locationData={mondayApp.locationData}
                        theme={mondayApp.theme}
                        location={mondayApp.location}
                        context={mondayApp.context}
                        clientInfo={mondayApp.clientInfo}
                        onGetItemIds={mondayApp.getItemIds}
                        onGetSessionToken={mondayApp.getSessionToken}
                        onGetFilter={mondayApp.getFilter}
                        onGetLocationData={mondayApp.getLocationData}
                    />
                );
                
            case 'storage':
                return (
                    <StorageSection
                        instanceStorage={mondayApp.instanceStorage}
                        globalStorage={mondayApp.globalStorage}
                        onTestInstanceStorage={mondayApp.testInstanceStorage}
                        onSetInstanceStorageValue={mondayApp.setInstanceStorageValue}
                        onTestGlobalStorage={mondayApp.testGlobalStorage}
                        onSetGlobalStorageValue={mondayApp.setGlobalStorageValue}
                        onTestStorageAuth={mondayApp.testStorageAuth}
                    />
                );
                
            case 'api':
                return (
                    <ApiSection
                        apiData={mondayApp.apiData}
                        apiLoading={mondayApp.apiLoading}
                        users={mondayApp.users}
                        latestApiResponse={mondayApp.latestApiResponse}
                        customQuery={mondayApp.customQuery}
                        customQueryResult={mondayApp.customQueryResult}
                        showCustomQuery={mondayApp.showCustomQuery}
                        apiPlaygroundQuery={mondayApp.apiPlaygroundQuery}
                        apiPlaygroundResult={mondayApp.apiPlaygroundResult}
                        showApiPlayground={mondayApp.showApiPlayground}
                        onFetchBoardData={mondayApp.fetchBoardData}
                        onGetUsers={mondayApp.getUsers}
                        onExecuteCustomQuery={mondayApp.executeCustomQuery}
                        onExecuteApiPlayground={mondayApp.executeApiPlayground}
                        onToggleCustomQuery={mondayApp.toggleCustomQuery}
                        onToggleApiPlayground={mondayApp.toggleApiPlayground}
                        onUpdateCustomQuery={mondayApp.updateCustomQuery}
                        onUpdateApiPlaygroundQuery={mondayApp.updateApiPlaygroundQuery}
                    />
                );
                
            case 'execute':
                return (
                    <ExecuteTab
                        executeResults={mondayApp.executeResults}
                        onExecuteAction={mondayApp.executeAction}
                    />
                );
                
            case 'listen':
                return (
                    <ListenTab
                        contextListener={mondayApp.contextListener}
                        itemIdsListener={mondayApp.itemIdsListener}
                        eventsListener={mondayApp.eventsListener}
                        theme={mondayApp.theme}
                        location={mondayApp.location}
                    />
                );
                
            case 'local':
                return <LocalApiTester />;
                
            default:
                return (
                    <GetTab
                        itemIds={mondayApp.itemIds}
                        sessionToken={mondayApp.sessionToken}
                        filter={mondayApp.filter}
                        locationData={mondayApp.locationData}
                        theme={mondayApp.theme}
                        location={mondayApp.location}
                        context={mondayApp.context}
                        clientInfo={mondayApp.clientInfo}
                        onGetItemIds={mondayApp.getItemIds}
                        onGetSessionToken={mondayApp.getSessionToken}
                        onGetFilter={mondayApp.getFilter}
                        onGetLocationData={mondayApp.getLocationData}
                    />
                );
        }
    };

    return (
        <div className="App" style={{ overflowX: 'auto', width: '100%' }}>
            <Box padding="medium" style={{ minWidth: '1000px', width: 'fit-content' }}>
                <Heading type="h2" style={{ marginBottom: '20px' }}>
                    🚀 Comprehensive Monday SDK Test Suite
                </Heading>
                
                {/* Info Box */}
                <Box style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#fff3cd', borderRadius: '6px' }}>
                    <Text size="small" weight="bold">
                        💡 Use the tabs above to explore different Monday SDK methods. Check out the "Local Testing" tab for API testing outside the Monday iframe.
                    </Text>
                </Box>
                
                {/* Tab Navigation */}
                <TabNavigation 
                    activeTab={mondayApp.activeTab}
                    onTabChange={mondayApp.setActiveTab}
                />
                
                {/* Tab Content */}
                <Box style={{ minHeight: '400px' }}>
                    {renderTabContent()}
                </Box>
            </Box>
        </div>
    );
};

export default App;
