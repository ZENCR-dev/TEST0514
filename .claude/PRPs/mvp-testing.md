name: "MVP Testing Optimization - Comprehensive Test Coverage and Quality Assurance"
description: |

## Purpose
Establish comprehensive testing infrastructure for MVP TCM Platform, achieving 95%+ coverage and ensuring production readiness.

## Core Principles
1. **Context is King**: Build upon existing test patterns and infrastructure
2. **Validation Loops**: Implement testing at unit, integration, and E2E levels
3. **Information Dense**: Leverage established mocking and testing utilities
4. **Progressive Success**: Fix critical tests first, then expand coverage
5. **Global rules**: Follow RIPER workflow and testing best practices

---

## Goal
Achieve comprehensive test coverage and establish robust quality assurance processes for MVP production deployment.

## Why
- **Business value**: Ensures reliable prescription and payment workflows
- **Integration**: Validates frontend-backend integration quality
- **Problems solved**: Eliminates production bugs and ensures system reliability

## What
Complete testing optimization including:
- Unit test coverage improvement (target: 95%+)
- Integration test implementation
- E2E test automation
- Performance testing setup
- Quality assurance processes

### Success Criteria
- [ ] Unit test coverage >95% for core modules
- [ ] Integration tests cover all critical workflows
- [ ] E2E tests validate complete user journeys
- [ ] Performance tests ensure acceptable response times
- [ ] All tests pass consistently in CI/CD pipeline
- [ ] Test documentation and maintenance processes established

## How

### Technical Approach
**Phase 1: Unit Test Optimization**
- Fix existing test failures (prescription-history module priority)
- Expand test coverage for core components
- Enhance mock infrastructure and test utilities

**Phase 2: Integration Testing**
- Implement API contract testing
- Test frontend-backend integration points
- Validate data flow and state management

**Phase 3: E2E and Performance Testing**
- Automate critical user journey testing
- Implement performance benchmarking
- Setup continuous testing pipeline

### Implementation Strategy
Use RIPER workflow with appropriate personas:
- RESEARCH: /analyze --test --persona-test-engineer --ultrathink
- INNOVATE: /design --test-strategy --persona-qa
- PLAN: /task --test-implementation --comprehensive
- EXECUTE: /test --coverage --e2e --persona-test-engineer
- REVIEW: /review --test --evidence --persona-qa

### Key Technologies
- Jest + React Testing Library (unit tests)
- Puppeteer (E2E testing)
- Contract testing framework
- Performance testing tools
- CI/CD integration

## Context

### Current State Analysis
**Test Coverage Status:**
- Core modules: Variable coverage (some >90%, others <50%)
- prescription-history: Multiple test failures requiring fixes
- Payment modules: Good coverage but needs integration tests
- API services: Basic coverage, needs contract testing

**Testing Infrastructure:**
- Jest configuration established
- React Testing Library setup
- Basic mock infrastructure
- prescriptionTestFactory utility
- CI/CD pipeline partially configured

### Dependencies
- Fixed prescription-history module tests
- Stable API integration
- Mock infrastructure enhancements
- Performance testing tool selection

## Validation

### Testing Strategy
**Unit Test Validation:**
```bash
npm test -- --coverage --watchAll=false
npm run test:unit -- --verbose
```

**Integration Test Validation:**
```bash
npm run test:integration
npm run test:api-contract
```

**E2E Test Validation:**
```bash
npm run test:e2e
npm run test:performance
```

**Coverage Analysis:**
```bash
npm run test:coverage-report
npm run test:coverage-threshold
```

### Success Metrics
- Unit test coverage: >95% for core modules
- Integration test coverage: >90% for critical workflows
- E2E test coverage: 100% for primary user journeys
- Test execution time: <2 minutes for full suite
- Test reliability: >99% pass rate in CI/CD

## Gotchas

### Common Issues
- **Mock Complexity**: Complex component mocking can become brittle
- **Async Testing**: Proper handling of async operations and state updates
- **Test Isolation**: Ensuring tests don't interfere with each other
- **Performance Testing**: Establishing realistic performance baselines

### MVP Project Specific
- **Prescription Logic Testing**: Complex TCM prescription rules validation
- **Payment Testing**: Secure testing of payment flows without real transactions
- **Role-Based Testing**: Testing different user roles and permissions
- **Privacy Compliance**: Ensuring no real patient data in tests

### Testing Challenges
- **Browser Compatibility**: E2E tests across different browsers
- **Mobile Testing**: Responsive design validation
- **API Mocking**: Realistic API response simulation
- **State Management**: Testing complex Zustand store interactions

### Maintenance Considerations
- **Test Data Management**: Keeping test data current and relevant
- **Mock Updates**: Maintaining mocks as components evolve
- **Performance Regression**: Detecting performance degradation
- **Documentation**: Keeping test documentation current

## Confidence Level: 8/10
High confidence based on existing test infrastructure and clear testing patterns. Main uncertainty around E2E testing tool selection and performance testing implementation.