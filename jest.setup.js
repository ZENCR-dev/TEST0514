// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
require('@testing-library/jest-dom'); 

// Jest setup for TCM Prescription Platform
// 新西兰中医处方平台测试环境配置

// 使用CommonJS require而不是ES6 import
require('@testing-library/jest-dom');

// Import React for UI component mocks
const React = require('react');

// 修复Node.js全局对象在Jest环境中的缺失问题
// 用于支持supertest等需要Node.js API的测试工具
if (typeof global.TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

// Mock performance API for browser APIs not available in Jest
global.performance = global.performance || {
  mark: jest.fn(),
  measure: jest.fn(),
  getEntriesByName: jest.fn(() => []),
  getEntriesByType: jest.fn(() => []),
  clearMarks: jest.fn(),
  clearMeasures: jest.fn(),
  now: jest.fn(() => Date.now())
};

// 模拟window对象的localStorage和sessionStorage
const mockStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'localStorage', {
    value: mockStorage,
  });

  Object.defineProperty(window, 'sessionStorage', {
    value: mockStorage,
  });

  // 模拟window.location
  Object.defineProperty(window, 'location', {
    value: {
      href: 'http://localhost:3000',
      reload: jest.fn(),
    },
    writable: true,
  });

  // Mock window.performance
  Object.defineProperty(window, 'performance', {
    value: global.performance,
    writable: true,
  });
}

// 清理每个测试后的localStorage mock
beforeEach(() => {
  mockStorage.getItem.mockClear();
  mockStorage.setItem.mockClear();
  mockStorage.removeItem.mockClear();
  mockStorage.clear.mockClear();
});

// Mock react-hotkeys-hook to avoid ESM issues
jest.mock('react-hotkeys-hook', () => ({
  useHotkeys: jest.fn(),
}));

// Mock useMedicineSearch hook with default implementation
jest.mock('@/hooks/useMedicineSearch', () => ({
  useMedicineSearch: jest.fn(() => ({
    results: [],
    loading: false,
    error: null,
    searchMedicines: jest.fn(),
    clearResults: jest.fn(),
  })),
}));

// RIPER Phase 6: 基础Mock修复 - 添加window.matchMedia Mock
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver for scroll-related components
global.IntersectionObserver = jest.fn().mockImplementation((callback) => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock ResizeObserver for responsive components
global.ResizeObserver = jest.fn().mockImplementation((callback) => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// RIPER Phase 6: UI组件Mock标准化
jest.mock('@/components/ui/input', () => ({
  Input: React.forwardRef((props, ref) => (
    React.createElement('input', { ref, ...props })
  )),
}));

jest.mock('@/components/ui/button', () => ({
  Button: React.forwardRef((props, ref) => {
    const { children, onClick, disabled, variant, size, className, ...otherProps } = props;
    const testId = typeof children === 'string' ? 
      `button-${children.toLowerCase().replace(/\s+/g, '-')}` : 
      'button';
    
    return React.createElement('button', { 
      ref, 
      onClick,
      disabled,
      className: `${variant || ''} ${size || ''} ${className || ''}`.trim(),
      'data-testid': testId,
      ...otherProps
    }, children);
  }),
}));

jest.mock('@/components/ui/table', () => ({
  Table: ({ children, ...props }) => React.createElement('table', props, children),
  TableHeader: ({ children, ...props }) => React.createElement('thead', props, children),
  TableBody: ({ children, ...props }) => React.createElement('tbody', props, children),
  TableHead: ({ children, ...props }) => React.createElement('th', props, children),
  TableRow: ({ children, ...props }) => React.createElement('tr', props, children),
  TableCell: ({ children, ...props }) => React.createElement('td', props, children),
}));

// RIPER Phase 6: 扩展UI组件Mock - 为ErrorAndLoadingUI添加缺失的UI组件Mock
jest.mock('@/components/ui/card', () => ({
  Card: ({ children, ...props }) => React.createElement('div', { ...props, className: `card ${props.className || ''}` }, children),
  CardContent: ({ children, ...props }) => React.createElement('div', { ...props, className: `card-content ${props.className || ''}` }, children),
  CardHeader: ({ children, ...props }) => React.createElement('div', { ...props, className: `card-header ${props.className || ''}` }, children),
  CardTitle: ({ children, ...props }) => React.createElement('h3', { ...props, className: `card-title ${props.className || ''}` }, children),
}));

jest.mock('@/components/ui/badge', () => ({
  Badge: ({ children, variant, ...props }) => React.createElement('span', { 
    ...props, 
    className: `badge ${variant || 'default'} ${props.className || ''}` 
  }, children),
}));

jest.mock('@/components/ui/progress', () => ({
  Progress: ({ value, ...props }) => React.createElement('div', {
    ...props,
    role: 'progressbar',
    'aria-valuenow': value,
    className: `progress ${props.className || ''}`,
  }, React.createElement('div', { 
    className: 'progress-bar',
    style: { width: `${value || 0}%` }
  })),
}));

jest.mock('@/components/ui/separator', () => ({
  Separator: (props) => React.createElement('hr', { 
    ...props, 
    className: `separator ${props.className || ''}` 
  }),
}));

jest.mock('@/components/ui/alert', () => ({
  Alert: ({ children, variant, ...props }) => React.createElement('div', { 
    ...props, 
    role: 'alert',
    className: `alert ${variant || 'default'} ${props.className || ''}` 
  }, children),
  AlertDescription: ({ children, ...props }) => React.createElement('div', { 
    ...props, 
    className: `alert-description ${props.className || ''}` 
  }, children),
  AlertTitle: ({ children, ...props }) => React.createElement('h4', { 
    ...props, 
    className: `alert-title ${props.className || ''}` 
  }, children),
}));

// Mock lucide-react icons used in ErrorAndLoadingUI
jest.mock('lucide-react', () => ({
  AlertTriangle: (props) => React.createElement('div', { ...props, 'data-testid': 'alert-triangle-icon' }),
  RefreshCw: (props) => React.createElement('div', { ...props, 'data-testid': 'refresh-icon' }),
  Wifi: (props) => React.createElement('div', { ...props, 'data-testid': 'wifi-icon' }),
  WifiOff: (props) => React.createElement('div', { ...props, 'data-testid': 'wifi-off-icon' }),
  Server: (props) => React.createElement('div', { ...props, 'data-testid': 'server-icon' }),
  Shield: (props) => React.createElement('div', { ...props, 'data-testid': 'shield-icon' }),
  Clock: (props) => React.createElement('div', { ...props, 'data-testid': 'clock-icon' }),
  AlertCircle: (props) => React.createElement('div', { ...props, 'data-testid': 'alert-circle-icon' }),
  CheckCircle: (props) => React.createElement('div', { ...props, 'data-testid': 'check-circle-icon' }),
  X: (props) => React.createElement('div', { ...props, 'data-testid': 'x-icon' }),
  RotateCcw: (props) => React.createElement('div', { ...props, 'data-testid': 'rotate-ccw-icon' }),
  ExternalLink: (props) => React.createElement('div', { ...props, 'data-testid': 'external-link-icon' }),
  Settings: (props) => React.createElement('div', { ...props, 'data-testid': 'settings-icon' }),
  Info: (props) => React.createElement('div', { ...props, 'data-testid': 'info-icon' }),
  Loader2: (props) => React.createElement('div', { ...props, 'data-testid': 'loader2-icon' }),
  Download: (props) => React.createElement('div', { ...props, 'data-testid': 'download-icon' }),
  Search: (props) => React.createElement('div', { ...props, 'data-testid': 'search-icon' }),
  Filter: (props) => React.createElement('div', { ...props, 'data-testid': 'filter-icon' }),
  Database: (props) => React.createElement('div', { ...props, 'data-testid': 'database-icon' }),
  // RIPER Phase 5: 添加PrescriptionBatchActions需要的图标Mock
  Printer: (props) => React.createElement('div', { ...props, 'data-testid': 'printer-icon' }),
  Archive: (props) => React.createElement('div', { ...props, 'data-testid': 'archive-icon' }),
  Trash2: (props) => React.createElement('div', { ...props, 'data-testid': 'trash2-icon' }),
  FileText: (props) => React.createElement('div', { ...props, 'data-testid': 'file-text-icon' }),
  Users: (props) => React.createElement('div', { ...props, 'data-testid': 'users-icon' }),
  MoreHorizontal: (props) => React.createElement('div', { ...props, 'data-testid': 'more-horizontal-icon' }),
  CheckCircle2: (props) => React.createElement('div', { ...props, 'data-testid': 'check-circle2-icon' }),
  AlertTriangle: (props) => React.createElement('div', { ...props, 'data-testid': 'alert-triangle-icon' }),
  TrendingUp: (props) => React.createElement('div', { ...props, 'data-testid': 'trending-up-icon' }),
  // RIPER Phase 6: 添加PrescriptionHistoryTable需要的图标Mock
  Calendar: (props) => React.createElement('div', { ...props, 'data-testid': 'calendar-icon' }),
  User: (props) => React.createElement('div', { ...props, 'data-testid': 'user-icon' }),
  CreditCard: (props) => React.createElement('div', { ...props, 'data-testid': 'credit-card-icon' }),
  Pill: (props) => React.createElement('div', { ...props, 'data-testid': 'pill-icon' }),
  ChevronRight: (props) => React.createElement('div', { ...props, 'data-testid': 'chevron-right-icon' }),
  Grid: (props) => React.createElement('div', { ...props, 'data-testid': 'grid-icon' }),
  List: (props) => React.createElement('div', { ...props, 'data-testid': 'list-icon' }),
  Smartphone: (props) => React.createElement('div', { ...props, 'data-testid': 'smartphone-icon' }),
  // RIPER Phase 6: 添加PrescriptionBatchActions需要的图标Mock
  XCircle: (props) => React.createElement('div', { ...props, 'data-testid': 'x-circle-icon' }),
  Play: (props) => React.createElement('div', { ...props, 'data-testid': 'play-icon' }),
  Pause: (props) => React.createElement('div', { ...props, 'data-testid': 'pause-icon' }),
  // PrescriptionStatusTimeline specific icons
  Activity: (props) => React.createElement('div', { ...props, 'data-testid': 'activity-icon' }),
  ArrowRight: (props) => React.createElement('div', { ...props, 'data-testid': 'arrow-right-icon' }),
  Eye: (props) => React.createElement('div', { ...props, 'data-testid': 'eye-icon' }),
  ChevronDown: (props) => React.createElement('div', { ...props, 'data-testid': 'chevron-down-icon' }),
  ChevronUp: (props) => React.createElement('div', { ...props, 'data-testid': 'chevron-up-icon' }),
  Zap: (props) => React.createElement('div', { ...props, 'data-testid': 'zap-icon' }),
  Timer: (props) => React.createElement('div', { ...props, 'data-testid': 'timer-icon' }),
  Target: (props) => React.createElement('div', { ...props, 'data-testid': 'target-icon' }),
}));

// Mock utils
jest.mock('@/lib/utils', () => ({
  cn: (...classes) => classes.filter(Boolean).join(' '),
}));

jest.mock('@/components/ui/skeleton', () => ({
  Skeleton: ({ className, width, height, ...props }) => React.createElement('div', {
    ...props,
    className: `skeleton ${className || ''}`,
    style: { width, height },
    'data-testid': 'skeleton',
  }),
}));

// RIPER Phase 1: 添加prescription-history模块需要的缺失UI组件Mock
jest.mock('@/components/ui/select', () => ({
  Select: ({ children, onValueChange, value, defaultValue, ...props }) => {
    const handleChange = (e) => {
      if (onValueChange) {
        onValueChange(e.target.value);
      }
    };
    return React.createElement('select', {
      ...props,
      onChange: handleChange,
      value: value || defaultValue,
      'data-testid': 'select',
    }, children);
  },
  SelectContent: ({ children, ...props }) => React.createElement('div', { ...props, 'data-testid': 'select-content' }, children),
  SelectItem: ({ children, value, ...props }) => React.createElement('option', { ...props, value, 'data-testid': `select-item-${value}` }, children),
  SelectTrigger: ({ children, className, ...props }) => React.createElement('div', { 
    ...props, 
    className: `select-trigger ${className || ''}`,
    'data-testid': 'select-trigger'
  }, children),
  SelectValue: ({ children, placeholder, ...props }) => React.createElement('span', { 
    ...props, 
    'data-testid': 'select-value'
  }, children || placeholder),
}));

jest.mock('@/components/ui/label', () => ({
  Label: ({ children, htmlFor, className, ...props }) => React.createElement('label', {
    ...props,
    htmlFor,
    className: `label ${className || ''}`,
    'data-testid': 'label',
  }, children),
}));

jest.mock('@/components/ui/checkbox', () => ({
  Checkbox: ({ checked, onCheckedChange, disabled, id, className, ...props }) => {
    const handleChange = (e) => {
      if (onCheckedChange) {
        onCheckedChange(e.target.checked);
      }
    };
    return React.createElement('input', {
      ...props,
      type: 'checkbox',
      checked: checked,
      onChange: handleChange,
      disabled: disabled,
      id: id,
      className: `checkbox ${className || ''}`,
      'data-testid': 'checkbox',
    });
  },
}));

// RIPER Phase 4: 添加PrescriptionHistoryTable需要的组件Mock
jest.mock('@/hooks/doctor/usePrescriptionHistoryPerformance', () => ({
  usePrescriptionHistoryPerformance: jest.fn(() => ({
    isLargeDataset: false,
    shouldShowWarning: false,
    performanceMetrics: {
      renderTime: 0,
      dataSize: 0,
    },
  })),
}));

// Mock WindowManager for responsive design
global.window.matchMedia = jest.fn().mockImplementation(query => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
}));