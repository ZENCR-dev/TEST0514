name: "MVP API Integration - Frontend-Backend Compatibility and Contract Testing"
description: |

## Purpose
Establish robust API integration between MVP frontend and backend, ensuring v3.2 compatibility and preparing for production deployment.

## Core Principles
1. **Context is King**: Understand existing API patterns and integration points
2. **Validation Loops**: Test API contracts at each integration step
3. **Information Dense**: Leverage existing apiClient and service patterns
4. **Progressive Success**: Start with core endpoints, expand to full API surface
5. **Global rules**: Follow RIPER workflow and API integration best practices

---

## Goal
Complete frontend-backend API integration with v3.2 compatibility and contract validation.

## Why
- **Business value**: Enables end-to-end prescription and payment workflows
- **Integration**: Bridges MVP frontend with production-ready backend
- **Problems solved**: Eliminates API compatibility issues and integration failures

## What
Comprehensive API integration including:
- API v3.2 compatibility verification
- Unified response format implementation
- Contract testing establishment
- Integration test automation

### Success Criteria
- [ ] All API endpoints use unified response format {success, data, message, meta}
- [ ] Frontend apiClient handles v3.2 responses correctly
- [ ] Contract tests validate API compatibility
- [ ] Integration tests cover prescription and payment workflows
- [ ] Error handling supports all API error scenarios
- [ ] Authentication and authorization work end-to-end

## How

### Technical Approach
**Phase 1: API Compatibility Audit**
- Verify all endpoints use v3.2 unified response format
- Update frontend services to handle new response structure
- Validate type definitions match backend contracts

**Phase 2: Contract Testing Implementation**
- Establish contract tests for critical endpoints
- Implement API response validation
- Create integration test suite

**Phase 3: End-to-End Integration**
- Test complete prescription creation workflow
- Validate payment processing integration
- Verify role-based access control

### Implementation Strategy
Use RIPER workflow with appropriate personas:
- RESEARCH: /analyze --api --persona-api-integrator --ultrathink
- INNOVATE: /design --integration --persona-backend
- PLAN: /task --api-integration --security-review
- EXECUTE: /build --api --integration --persona-api-integrator
- REVIEW: /test --integration --persona-test-engineer

### Key Technologies
- API v3.2 unified response format
- Frontend apiClient adapter
- Contract testing framework
- Integration test automation

## Context

### Current State Analysis
**API Integration Status:**
- Frontend MVP2.2 development complete
- Backend API v3.2 ready for integration
- Existing apiClient with adapter pattern
- Unified response format partially implemented

**Critical Integration Points:**
- Prescription creation and management
- Payment processing (Stripe + balance)
- User authentication and role management
- Medicine search and catalog access

### Dependencies
- Backend API v3.2 endpoints availability
- Frontend apiClient adapter implementation
- Authentication token management
- Error handling and retry mechanisms

## Validation

### Testing Strategy
**Contract Validation:**
```bash
npm test -- --testPathPattern="contract"
npm run test:integration
```

**API Endpoint Testing:**
```bash
# Test prescription endpoints
curl -X POST http://localhost:4000/api/v1/prescriptions
# Test payment endpoints  
curl -X POST http://localhost:4000/api/v1/payments/process
```

**Integration Testing:**
```bash
npm run test:e2e
npm run test:api-integration
```

### Success Metrics
- API response format compliance: 100%
- Contract test pass rate: 100%
- Integration test coverage: >90%
- Error handling coverage: All error scenarios tested

## Gotchas

### Common Issues
- **Response Format Inconsistency**: Ensure all endpoints return {success, data, message, meta}
- **Type Safety**: Frontend types must match backend response schemas exactly
- **Authentication Flow**: Token refresh and role switching must work seamlessly
- **Error Handling**: Network errors, API errors, and validation errors need different handling

### MVP Project Specific
- **Prescription Privacy**: No patient data in API requests/responses
- **Payment Security**: PCI compliance for payment data handling
- **Role Permissions**: Proper role-based access control validation
- **API Versioning**: Maintain backward compatibility during integration

### Integration Challenges
- **CORS Configuration**: Ensure proper cross-origin setup for development
- **Rate Limiting**: Handle API rate limits gracefully
- **Data Validation**: Client-side validation must match server-side rules
- **State Management**: Zustand stores must sync with API state correctly

## Confidence Level: 7/10
Good confidence based on existing API patterns and clear v3.2 specification. Main uncertainty around backend API stability and complete endpoint availability.