/**
 * PDF生成工具
 * 解决浏览器缩放对PDF导出的影响，确保始终输出标准A5格式
 */

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export interface PDFGeneratorOptions {
  /** 文件名 */
  filename: string;
  /** 页面格式 */
  format: 'a4' | 'a5';
  /** 输出质量（DPI倍数） */
  quality: number;
  /** 是否添加页边距 */
  margin: number;
}

/**
 * 标准页面尺寸定义（毫米）
 */
const PAGE_SIZES = {
  a4: { width: 210, height: 297 },
  a5: { width: 148, height: 210 }
};

/**
 * 生成高质量PDF，不受浏览器缩放影响
 */
export async function generateStandardPDF(
  element: HTMLElement,
  options: PDFGeneratorOptions
): Promise<void> {
  const { filename, format = 'a5', quality = 2, margin = 10 } = options;
  
  // 获取页面尺寸
  const pageSize = PAGE_SIZES[format];
  const contentWidth = pageSize.width - margin * 2;
  const contentHeight = pageSize.height - margin * 2;
  
  // 临时调整元素样式以确保固定尺寸
  const originalStyles = await prepareElementForPDF(element, contentWidth, contentHeight);
  
  try {
    // 计算目标像素尺寸（基于96DPI）
    const targetPixelWidth = Math.round(contentWidth * 3.7795);
    const targetPixelHeight = Math.round(contentHeight * 3.7795);
    
    // 使用高DPI设置截图
    const canvas = await html2canvas(element, {
      scale: quality,
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#ffffff',
      width: targetPixelWidth,
      height: targetPixelHeight,
      scrollX: 0,
      scrollY: 0
    });
    
    // 创建PDF
    const pdf = new jsPDF({
      orientation: pageSize.width > pageSize.height ? 'landscape' : 'portrait',
      unit: 'mm',
      format: format
    });
    
    // 计算图片在PDF中的尺寸
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', margin, margin, contentWidth, contentHeight);
    
    // 保存PDF
    pdf.save(filename);
    
  } finally {
    // 恢复原始样式
    restoreElementStyles(element, originalStyles);
  }
}

/**
 * 准备元素用于PDF生成
 * 设置固定尺寸，不受浏览器缩放影响
 */
async function prepareElementForPDF(
  element: HTMLElement,
  targetWidth: number,
  targetHeight: number
): Promise<{[key: string]: string}> {
  const originalStyles: {[key: string]: string} = {};
  
  // 保存原始样式
  const stylesToSave = [
    'width', 'height', 'transform', 'transformOrigin', 'position',
    'top', 'left', 'margin', 'padding', 'boxSizing', 'overflow'
  ];
  
  stylesToSave.forEach(prop => {
    originalStyles[prop] = element.style.getPropertyValue(prop);
  });
  
  // 获取当前浏览器缩放级别
  const zoomLevel = Math.round(window.outerWidth / window.innerWidth * 100) / 100;
  
  // 计算目标像素尺寸
  const targetPixelWidth = targetWidth * 3.7795; // 转换为像素 (1mm ≈ 3.7795px at 96dpi)
  const targetPixelHeight = targetHeight * 3.7795;
  
  // 设置标准尺寸样式，确保内容完全填充目标区域
  element.style.boxSizing = 'border-box';
  element.style.width = `${targetPixelWidth}px`;
  element.style.height = 'auto';
  element.style.minHeight = `${targetPixelHeight}px`;
  element.style.maxWidth = `${targetPixelWidth}px`;
  element.style.overflow = 'hidden';
  
  // 不使用 transform scale，而是通过设置固定尺寸来控制
  // 这样可以避免在高缩放比例下内容变得过小的问题
  element.style.position = 'relative';
  element.style.margin = '0';
  element.style.padding = '20px';
  
  // 等待重新布局
  await new Promise(resolve => setTimeout(resolve, 200));
  
  return originalStyles;
}

/**
 * 恢复元素原始样式
 */
function restoreElementStyles(element: HTMLElement, originalStyles: {[key: string]: string}): void {
  Object.keys(originalStyles).forEach(prop => {
    if (originalStyles[prop]) {
      element.style.setProperty(prop, originalStyles[prop]);
    } else {
      element.style.removeProperty(prop);
    }
  });
}

/**
 * 生成打印友好的HTML字符串
 * 用于新窗口打印
 */
export async function generatePrintHTML(
  element: HTMLElement,
  options: { title: string; format: 'a4' | 'a5' }
): Promise<string> {
  const pageSize = PAGE_SIZES[options.format];
  
  // 获取元素的完整HTML内容，包括内联样式
  const clonedElement = element.cloneNode(true) as HTMLElement;
  
  // 获取所有计算样式并转换为内联样式
  const allElements = [clonedElement, ...Array.from(clonedElement.querySelectorAll('*'))] as HTMLElement[];
  allElements.forEach(el => {
    const computedStyle = window.getComputedStyle(el);
    const inlineStyle: string[] = [];
    
    // 复制重要的样式属性
    const importantStyles = [
      'display', 'position', 'width', 'height', 'margin', 'padding',
      'border', 'background', 'color', 'font-family', 'font-size',
      'font-weight', 'line-height', 'text-align', 'text-decoration',
      'flex', 'flex-direction', 'justify-content', 'align-items',
      'grid', 'grid-template-columns', 'gap'
    ];
    
    importantStyles.forEach(prop => {
      const value = computedStyle.getPropertyValue(prop);
      if (value && value !== 'initial' && value !== 'normal') {
        inlineStyle.push(`${prop}: ${value}`);
      }
    });
    
    if (inlineStyle.length > 0) {
      el.style.cssText = inlineStyle.join('; ');
    }
  });
  
  const content = clonedElement.outerHTML;
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>${options.title}</title>
        <style>
          * {
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Microsoft YaHei', SimSun, Arial, sans-serif;
            line-height: 1.4;
            color: #333;
            background: white;
            margin: 0;
            padding: 0;
          }
          
          .print-container {
            width: ${pageSize.width}mm;
            min-height: ${pageSize.height}mm;
            margin: 0 auto;
            padding: 10mm;
            background: white;
          }
          
          .no-print {
            text-align: center;
            margin: 20px 0;
            padding: 10px;
            background: #f5f5f5;
            border-radius: 5px;
          }
          
          .print-button {
            padding: 8px 16px;
            margin: 0 5px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
          }
          
          .print-button.primary {
            background: #4a90e2;
            color: white;
          }
          
          .print-button.secondary {
            background: #e2e8f0;
            color: #1a202c;
          }
          
          /* 确保Tailwind样式在打印时正常工作 */
          .bg-white { background-color: white !important; }
          .bg-gray-50 { background-color: #f9fafb !important; }
          .bg-gray-100 { background-color: #f3f4f6 !important; }
          .bg-gray-200 { background-color: #e5e7eb !important; }
          .bg-yellow-50 { background-color: #fffbeb !important; }
          .border { border: 1px solid #e5e7eb !important; }
          .border-l-4 { border-left: 4px solid !important; }
          .border-yellow-400 { border-color: #fbbf24 !important; }
          .border-gray-200 { border-color: #e5e7eb !important; }
          .border-gray-400 { border-color: #9ca3af !important; }
          .rounded { border-radius: 0.25rem !important; }
          .rounded-md { border-radius: 0.375rem !important; }
          .p-2 { padding: 0.5rem !important; }
          .p-3 { padding: 0.75rem !important; }
          .p-4 { padding: 1rem !important; }
          .p-6 { padding: 1.5rem !important; }
          .px-6 { padding-left: 1.5rem !important; padding-right: 1.5rem !important; }
          .py-2 { padding-top: 0.5rem !important; padding-bottom: 0.5rem !important; }
          .py-3 { padding-top: 0.75rem !important; padding-bottom: 0.75rem !important; }
          .pt-2 { padding-top: 0.5rem !important; }
          .pl-3 { padding-left: 0.75rem !important; }
          .mb-2 { margin-bottom: 0.5rem !important; }
          .mb-4 { margin-bottom: 1rem !important; }
          .ml-2 { margin-left: 0.5rem !important; }
          .mt-1 { margin-top: 0.25rem !important; }
          .flex { display: flex !important; }
          .grid { display: grid !important; }
          .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
          .grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; }
          .gap-3 { gap: 0.75rem !important; }
          .gap-x-4 { column-gap: 1rem !important; }
          .justify-between { justify-content: space-between !important; }
          .items-start { align-items: flex-start !important; }
          .items-center { align-items: center !important; }
          .text-left { text-align: left !important; }
          .text-center { text-align: center !important; }
          .text-right { text-align: right !important; }
          .text-xl { font-size: 1.25rem !important; line-height: 1.75rem !important; }
          .text-lg { font-size: 1.125rem !important; line-height: 1.75rem !important; }
          .text-sm { font-size: 0.875rem !important; line-height: 1.25rem !important; }
          .text-xs { font-size: 0.75rem !important; line-height: 1rem !important; }
          .font-bold { font-weight: 700 !important; }
          .font-medium { font-weight: 500 !important; }
          .text-gray-500 { color: #6b7280 !important; }
          .text-gray-600 { color: #4b5563 !important; }
          .text-gray-700 { color: #374151 !important; }
          .text-yellow-700 { color: #a16207 !important; }
          .w-20 { width: 5rem !important; }
          .h-20 { height: 5rem !important; }
          .min-w-[100px] { min-width: 100px !important; }
          .border-b { border-bottom: 1px solid #e5e7eb !important; }
          .border-gray-100 { border-color: #f3f4f6 !important; }
          .border-t { border-top: 1px solid #e5e7eb !important; }
          .inline-block { display: inline-block !important; }
          
          @media print {
            @page {
              size: ${options.format.toUpperCase()};
              margin: 0;
            }
            
            body {
              width: ${pageSize.width}mm;
              height: ${pageSize.height}mm;
            }
            
            .print-container {
              width: 100%;
              height: 100%;
              margin: 0;
              padding: 10mm;
              background: white !important;
              -webkit-print-color-adjust: exact;
              color-adjust: exact;
            }
            
            .no-print {
              display: none !important;
            }
          }
        </style>
      </head>
      <body>
        <div class="no-print">
          <button class="print-button primary" onclick="window.print()">
            打印
          </button>
          <button class="print-button secondary" onclick="window.close()">
            关闭
          </button>
        </div>
        <div class="print-container">
          ${content}
        </div>
      </body>
    </html>
  `;
} 