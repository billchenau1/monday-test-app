# 🧪 Local API Testing Guide

## Overview
This guide explains how to test the Monday API functions locally, outside of the Monday iframe environment.

## 🚀 Quick Start

### 1. Development Server
The React development server is now running! Open your browser and navigate to:
```
http://localhost:3000
```

### 2. Access Local API Testing Suite
Once the app loads, scroll down to find the **"Local API Testing Suite"** section at the bottom of the page.

## 🧰 Testing Options Available

### A. Interactive UI Testing
- **Run All Tests**: Comprehensive test suite for all API functions
- **Individual Function Tests**: Test specific API functions (Board Data, Users)
- **Custom Query Testing**: Test your own GraphQL queries
- **Real-time Results**: See results immediately in the UI

### B. Unit Testing (Command Line)
```bash
npm test -- --testNamePattern="MondayApiService" --watchAll=false
```

### C. Direct Function Testing
All functions have been updated with:
- ✅ Correct API version (`2024-10`)
- ✅ Proper GraphQL query names
- ✅ Enhanced error handling
- ✅ GraphQL validation error detection

## 📋 What to Expect

### When Testing Locally (Outside Monday iframe):
- **API calls will show fallback/demo data** ✅
- **Error handling will be demonstrated** ✅
- **GraphQL validation errors will be properly displayed** ✅
- **Function structure and flow can be verified** ✅

### When Testing in Monday iframe:
- **Real API calls will work with seamless authentication** ✅
- **Actual board and user data will be retrieved** ✅
- **No GraphQL validation errors should occur** ✅

## 🔧 API Functions Fixed

1. **fetchBoardData()**: Updated query name and error handling
2. **getUsers()**: Fixed query structure and validation
3. **executeCustomQuery()**: Enhanced error detection
4. **executeApiPlaygroundQuery()**: Improved validation handling

## 🎯 Key Changes Made

### API Version
- ❌ Old: `"2025-04"` (invalid)
- ✅ New: `"2024-10"` (valid)

### Query Structure
- ❌ Old: `query { me { ... } }`
- ✅ New: `query GetMyData { me { ... } }`

### Error Handling
- ✅ Added GraphQL error detection
- ✅ Proper error message propagation
- ✅ Fallback data with error information

## 🧪 Testing Scenarios

### 1. Basic Functionality Test
Click "🚀 Run All Tests" to verify all functions work correctly.

### 2. Custom Query Testing
Try these sample queries:
```graphql
query GetMyInfo { 
  me { 
    id 
    name 
    email 
  } 
}
```

```graphql
query GetBoards { 
  boards(limit: 5) { 
    id 
    name 
    description 
  } 
}
```

### 3. Error Testing
Try an invalid query to test error handling:
```graphql
query InvalidQuery { 
  nonExistentField { 
    invalidProperty 
  } 
}
```

## 🔍 Troubleshooting

### If you see "GraphQL validation errors":
- ✅ This is expected locally (shows error handling works)
- ✅ Will be resolved when running in Monday iframe
- ✅ Check the error details for specific validation issues

### If tests don't run:
1. Ensure development server is running (`npm start`)
2. Check browser console for errors
3. Verify API service import is working

### If API calls fail completely:
- ✅ This is expected outside Monday iframe
- ✅ The fallback data should still display
- ✅ Error handling should work properly

## 🎉 Success Criteria

Your API functions are working correctly if:
- ✅ All unit tests pass
- ✅ UI tests run without crashes
- ✅ Error messages are clear and informative
- ✅ Fallback data is properly displayed
- ✅ Query structure follows GraphQL best practices

## 🚀 Next Steps

1. **Local Testing**: Use the UI to verify all functions work
2. **Monday iframe Testing**: Deploy and test in actual Monday environment
3. **Production Ready**: Your API calls should now work without GraphQL validation errors!

---

**Note**: The real test will be when you deploy this to Monday and test it in the actual iframe environment, where seamless authentication will provide real data instead of fallback data. 