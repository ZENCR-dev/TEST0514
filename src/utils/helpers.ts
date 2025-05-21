/**
 * 通用工具函数
 */

/**
 * 延迟函数，用于模拟API延迟
 * @param ms 延迟毫秒数
 * @returns Promise
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * 格式化日期
 * @param dateString ISO日期字符串
 * @returns 格式化后的日期字符串
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * 格式化价格
 * @param price 价格数值
 * @param currency 货币符号
 * @returns 格式化后的价格字符串
 */
export const formatPrice = (price: number, currency: string = '¥'): string => {
  return `${currency}${price.toFixed(2)}`;
};

/**
 * 生成唯一ID
 * @param prefix ID前缀
 * @returns 唯一ID字符串
 */
export const generateId = (prefix: string = 'id'): string => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * 中文拼音转换函数（简化版）
 * 注意：这只是一个简化版本，实际应用中应使用专业的拼音库
 * @param chinese 中文字符串
 * @returns 拼音字符串
 */
export const toPinyin = (chinese: string): string => {
  // 实际项目中应引入专业拼音库
  // 这里仅作为示例，返回空字符串
  console.warn('toPinyin函数是一个占位符，应使用专业拼音库实现');
  return '';
};

/**
 * 过滤对象中的空值
 * @param obj 输入对象
 * @returns 过滤后的对象
 */
export const removeEmpty = <T extends Record<string, any>>(obj: T): Partial<T> => {
  const result: Partial<T> = {};
  
  for (const key in obj) {
    if (obj[key] !== null && obj[key] !== undefined && obj[key] !== '') {
      result[key] = obj[key];
    }
  }
  
  return result;
};

/**
 * 深度克隆对象
 * @param obj 输入对象
 * @returns 克隆后的对象
 */
export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * 防抖函数
 * @param fn 要执行的函数
 * @param delay 延迟时间
 * @returns 防抖后的函数
 */
export const debounce = <T extends (...args: any[]) => any>(fn: T, delay: number): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  
  return function(...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

/**
 * 节流函数
 * @param fn 要执行的函数
 * @param limit 时间限制
 * @returns 节流后的函数
 */
export const throttle = <T extends (...args: any[]) => any>(fn: T, limit: number): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean = false;
  
  return function(...args: Parameters<T>) {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}; 