# CLAUDE.md - MVP Development Progress

## 📋 Current Status

**Last Updated**: 2025-07-22  
**Current Phase**: MVP1.9 Guest Mode Development Planning  
**Development Branch**: Grey-test-July (pending creation)  

---

## 🎯 MVP1.9 Guest Mode Development Plan

### Project Overview
Transform MVP2.2's Mock environment module into Guest Mode for gray testing, providing standalone frontend prescription generation tools.

### TDD Strategy Implementation

#### Core Testing Philosophy
- **Test-First Development**: Write comprehensive test specifications before implementation
- **Coverage-Driven**: Ensure >85% test coverage across all modules
- **Behavioral Testing**: Focus on user behavior and business logic validation
- **Integration Testing**: Validate end-to-end Guest mode workflows

---

## 📊 Phase-Based Test-Driven Development Plan

### Phase 1: Basic Architecture Setup (2 days)
**TDD Focus**: Foundation testing for Guest mode infrastructure

#### 1.1 Guest Mode State Management Tests
**Test File**: `src/store/__tests__/guestModeStore.test.ts`

**Required Test Specs**:
```typescript
describe('GuestModeStore', () => {
  describe('State Management', () => {
    it('should initialize with Guest mode enabled by default')
    it('should maintain allowed routes list for Guest users')
    it('should track temporary prescriptions in memory')
    it('should record session start time for timeout management')
  })

  describe('Route Protection', () => {
    it('should identify allowed routes correctly')
    it('should block protected routes in Guest mode')
    it('should trigger redirect to /prescription/create from home')
    it('should allow auth routes (/auth/*, /register/*)')
  })

  describe('Data Management', () => {
    it('should add temporary prescriptions to memory')
    it('should clear temporary data on demand')
    it('should not persist data to localStorage')
    it('should generate unique prescription IDs')
  })

  describe('Language State', () => {
    it('should default to Chinese language')
    it('should switch languages correctly')
    it('should return correct translation text')
  })
})
```

#### 1.2 Route Protection Tests
**Test File**: `src/components/auth/__tests__/GuestModeGuard.test.tsx`

**Required Test Specs**:
```typescript
describe('GuestModeGuard', () => {
  describe('Route Redirection', () => {
    it('should redirect / to /prescription/create in Guest mode')
    it('should block admin routes and show login prompt')
    it('should block doctor routes and show login prompt')
    it('should block pharmacy routes and show login prompt')
    it('should allow prescription creation route')
  })

  describe('Login Prompt Modal', () => {
    it('should show login prompt for protected routes')
    it('should display correct feature name in prompt')
    it('should provide login and register options')
    it('should allow continuing in demo mode')
  })

  describe('Component Hiding', () => {
    it('should hide test integration pages in Guest mode')
    it('should hide environment switcher component')
    it('should hide developer tools and debug panels')
  })
})
```

#### 1.3 Medicine Data Integration Tests
**Test File**: `src/data/__tests__/medicineData.test.ts`

**Required Test Specs**:
```typescript
describe('Medicine Data Integration', () => {
  describe('Data Structure Validation', () => {
    it('should contain exactly 442 medicine records')
    it('should match backend API format (id, name, chineseName, etc.)')
    it('should include all required fields for each medicine')
    it('should have valid SKU codes for all medicines')
    it('should use NZD$ pricing consistently')
  })

  describe('Search Functionality', () => {
    it('should search by Chinese name correctly')
    it('should search by English name correctly')
    it('should search by Pinyin name correctly')
    it('should search by SKU code correctly')
    it('should filter by category correctly')
    it('should return empty array for invalid searches')
  })

  describe('API Format Compliance', () => {
    it('should match UNIFIED_API_DOCUMENTATION Medicine interface')
    it('should include all 8 medicine categories')
    it('should have basePrice field for pricing')
    it('should include unit field for measurements')
  })
})
```

#### 1.4 Language Support Tests
**Test File**: `src/store/__tests__/languageStore.test.ts`

**Required Test Specs**:
```typescript
describe('Language Support System', () => {
  describe('Translation Management', () => {
    it('should provide Chinese translations for all keys')
    it('should provide English translations for all keys')
    it('should return key as fallback for missing translations')
    it('should handle medicine name display by language')
  })

  describe('Language Switching', () => {
    it('should switch from Chinese to English')
    it('should switch from English to Chinese')
    it('should update all text elements after switch')
    it('should preserve user language preference')
  })

  describe('Medicine Display', () => {
    it('should show Chinese names when language is zh')
    it('should show English names when language is en')
    it('should handle medicines without English names gracefully')
  })
})
```

### Phase 2: Core Feature Adaptation (3 days)
**TDD Focus**: Prescription creation and medicine search testing

#### 2.1 Prescription Creation Tests
**Test File**: `src/components/prescription/__tests__/PrescriptionCreator.guest.test.tsx`

**Required Test Specs**:
```typescript
describe('Prescription Creator - Guest Mode', () => {
  describe('Local Data Storage', () => {
    it('should save prescriptions to memory only')
    it('should generate demo prescription with correct format')
    it('should include isDemo flag in saved prescriptions')
    it('should not make API calls in Guest mode')
  })

  describe('Medicine Selection', () => {
    it('should search from local 442 medicine dataset')
    it('should add medicines to prescription correctly')
    it('should calculate weights and amounts correctly')
    it('should use NZD$ pricing with demo labels')
  })

  describe('PDF Export', () => {
    it('should generate PDF with demo watermark')
    it('should include prescription details correctly')
    it('should work without API dependencies')
  })
})
```

#### 2.2 Medicine Search Tests
**Test File**: `src/hooks/__tests__/useMedicineSearch.guest.test.ts`

**Required Test Specs**:
```typescript
describe('Medicine Search - Guest Mode', () => {
  describe('Local Search', () => {
    it('should search 442 medicines locally')
    it('should not make HTTP requests')
    it('should return results in API format')
    it('should support all search types (name, SKU, category)')
  })

  describe('Performance', () => {
    it('should complete searches within 100ms')
    it('should handle large result sets efficiently')
    it('should cache search results appropriately')
  })
})
```

### Phase 3: UX Optimization (2 days)
**TDD Focus**: User experience and interface testing

#### 3.1 Component Hiding Tests
**Test File**: `src/components/common/__tests__/componentVisibility.guest.test.tsx`

**Required Test Specs**:
```typescript
describe('Component Visibility - Guest Mode', () => {
  describe('Hidden Components', () => {
    it('should hide EnvironmentSwitcher in Guest mode')
    it('should hide test integration panels')
    it('should hide developer debug tools')
    it('should show GuestModeBanner instead')
  })

  describe('Navigation Updates', () => {
    it('should update navbar for Guest users')
    it('should remove unauthorized menu items')
    it('should show language switcher')
  })
})
```

#### 3.2 Responsive Design Tests
**Test File**: `src/components/__tests__/responsiveDesign.guest.test.tsx`

**Required Test Specs**:
```typescript
describe('Responsive Design - Guest Mode', () => {
  describe('Device Compatibility', () => {
    it('should render correctly on mobile devices')
    it('should render correctly on tablet devices')
    it('should render correctly on desktop devices')
    it('should handle touch interactions appropriately')
  })

  describe('Performance', () => {
    it('should load pages within 3 seconds')
    it('should maintain 60fps during interactions')
    it('should optimize bundle size for mobile')
  })
})
```

### Phase 4: Testing & Deployment (1 day)
**TDD Focus**: Integration and end-to-end testing

#### 4.1 End-to-End Tests
**Test File**: `__tests__/e2e/guestMode.e2e.test.ts`

**Required Test Specs**:
```typescript
describe('Guest Mode E2E', () => {
  describe('Complete User Journey', () => {
    it('should complete full prescription creation flow')
    it('should export PDF successfully')
    it('should clear data after export')
    it('should show login prompt for protected features')
  })

  describe('Cross-Browser Compatibility', () => {
    it('should work on Chrome')
    it('should work on Firefox')
    it('should work on Safari')
    it('should work on Edge')
  })

  describe('Zero API Validation', () => {
    it('should not make any HTTP requests to backend')
    it('should work completely offline')
    it('should function without authentication')
  })
})
```

---

## 🎯 Implementation Checklist

### Pre-Implementation Phase
- [ ] Create comprehensive test specifications for all phases
- [ ] Set up testing infrastructure (Jest, Testing Library, Playwright)
- [ ] Establish code coverage requirements (>85%)
- [ ] Define acceptance criteria for each feature

### TDD Workflow Standards
1. **Red Phase**: Write failing tests first
2. **Green Phase**: Implement minimum code to pass tests
3. **Refactor Phase**: Optimize while maintaining test coverage
4. **Integration Phase**: Ensure all components work together

### Quality Gates
- [ ] Unit test coverage > 85%
- [ ] Integration test coverage > 90%
- [ ] E2E test coverage for critical paths
- [ ] Zero backend dependencies validated
- [ ] Performance benchmarks met

---

## 📋 Risk Mitigation

### Technical Risks
- **Data Loss**: Tests verify memory-only storage works correctly
- **Performance**: Benchmark tests ensure 442 medicine search is fast
- **Compatibility**: Cross-browser tests validate universal support

### User Experience Risks
- **Confusion**: Clear demo labeling tests
- **Broken Flow**: E2E tests validate complete user journeys
- **Mobile Issues**: Responsive design tests on all devices

---

## 🚀 Next Steps

1. **Complete TDD Planning** (Current Phase)
2. **Set up Test Infrastructure**
3. **Begin Phase 1 Implementation with Test-First Approach**
4. **Iterative Development Following TDD Cycle**

---

**Document Status**: ✅ TDD Planning Complete  
**Next Action**: Begin Phase 1 Test Specification Creation  
**Responsible**: Claude Code Assistant  
**Review Status**: Pending Technical Team Review

*This document follows SuperClaude RIPER methodology with comprehensive TDD strategy*