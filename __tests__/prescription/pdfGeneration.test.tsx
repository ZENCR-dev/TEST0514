/**
 * PDF生成功能测试
 * 验证不同浏览器缩放比例下的一致性
 */

import { generateStandardPDF, generatePrintHTML } from '@/utils/pdfGenerator';

// Mock html2canvas and jsPDF
jest.mock('html2canvas', () => {
  return jest.fn().mockResolvedValue({
    toDataURL: jest.fn().mockReturnValue('data:image/png;base64,mock-image-data'),
    height: 800,
    width: 600
  });
});

jest.mock('jspdf', () => {
  const mockPDF = {
    addImage: jest.fn(),
    save: jest.fn()
  };
  return jest.fn().mockImplementation(() => mockPDF);
});

// Mock window properties for zoom testing
const mockWindowProperties = (zoomLevel: number) => {
  Object.defineProperty(window, 'outerWidth', {
    writable: true,
    configurable: true,
    value: 1920 * zoomLevel
  });
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: 1920
  });
  Object.defineProperty(window, 'devicePixelRatio', {
    writable: true,
    configurable: true,
    value: 1
  });
};

describe('PDF Generation', () => {
  let mockElement: HTMLElement;

  beforeEach(() => {
    // Create a mock DOM element
    mockElement = document.createElement('div');
    mockElement.innerHTML = `
      <div>
        <h1>测试处方单</h1>
        <p>处方内容测试</p>
      </div>
    `;
    mockElement.style.cssText = 'width: 400px; height: 600px; padding: 20px;';
    document.body.appendChild(mockElement);

    // Reset window properties
    mockWindowProperties(1);
  });

  afterEach(() => {
    document.body.removeChild(mockElement);
    jest.clearAllMocks();
  });

  describe('generateStandardPDF', () => {
    it('应该在正常缩放下生成PDF', async () => {
      mockWindowProperties(1); // 100%缩放

      await generateStandardPDF(mockElement, {
        filename: 'test.pdf',
        format: 'a5',
        quality: 2,
        margin: 10
      });

      expect(require('html2canvas')).toHaveBeenCalled();
      expect(require('jspdf')).toHaveBeenCalledWith({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a5'
      });
    });

    it('应该在150%缩放下生成一致的PDF', async () => {
      mockWindowProperties(1.5); // 150%缩放

      await generateStandardPDF(mockElement, {
        filename: 'test-150.pdf',
        format: 'a5',
        quality: 2,
        margin: 10
      });

      // 验证html2canvas被调用时的参数包含正确的尺寸补偿
      const html2canvasCall = require('html2canvas').mock.calls[0];
      expect(html2canvasCall[1]).toMatchObject({
        scale: 2,
        backgroundColor: '#ffffff',
        scrollX: 0,
        scrollY: 0
      });
    });

    it('应该在75%缩放下生成一致的PDF', async () => {
      mockWindowProperties(0.75); // 75%缩放

      await generateStandardPDF(mockElement, {
        filename: 'test-75.pdf',
        format: 'a5',
        quality: 2,
        margin: 10
      });

      expect(require('html2canvas')).toHaveBeenCalled();
    });

    it('应该正确处理错误情况', async () => {
      // Mock html2canvas to throw an error
      require('html2canvas').mockRejectedValueOnce(new Error('Canvas generation failed'));

      await expect(generateStandardPDF(mockElement, {
        filename: 'test-error.pdf',
        format: 'a5',
        quality: 2,
        margin: 10
      })).rejects.toThrow('Canvas generation failed');
    });

    it('应该支持A4格式', async () => {
      await generateStandardPDF(mockElement, {
        filename: 'test-a4.pdf',
        format: 'a4',
        quality: 2,
        margin: 10
      });

      expect(require('jspdf')).toHaveBeenCalledWith({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
    });
  });

  describe('generatePrintHTML', () => {
    it('应该生成正确的打印HTML', async () => {
      const result = await generatePrintHTML(mockElement, {
        title: '测试打印',
        format: 'a5'
      });

      expect(result).toContain('<!DOCTYPE html>');
      expect(result).toContain('测试打印');
      expect(result).toContain('148mm'); // A5宽度
      expect(result).toContain('210mm'); // A5高度
      expect(result).toContain('测试处方单');
      expect(result).toContain('@page');
      expect(result).toContain('size: A5');
    });

    it('应该支持A4格式的打印HTML', async () => {
      const result = await generatePrintHTML(mockElement, {
        title: '测试打印A4',
        format: 'a4'
      });

      expect(result).toContain('210mm'); // A4宽度
      expect(result).toContain('297mm'); // A4高度
      expect(result).toContain('size: A4');
    });

    it('应该包含打印按钮和样式', async () => {
      const result = await generatePrintHTML(mockElement, {
        title: '测试打印',
        format: 'a5'
      });

      expect(result).toContain('print-button');
      expect(result).toContain('onclick="window.print()"');
      expect(result).toContain('onclick="window.close()"');
      expect(result).toContain('@media print');
      expect(result).toContain('.no-print');
    });
  });

  describe('样式恢复功能', () => {
    it('应该在PDF生成后恢复原始样式', async () => {
      // 记录原始样式
      const originalWidth = mockElement.style.width;
      const originalHeight = mockElement.style.height;
      const originalTransform = mockElement.style.transform;

      await generateStandardPDF(mockElement, {
        filename: 'test-restore.pdf',
        format: 'a5',
        quality: 2,
        margin: 10
      });

      // 验证样式已恢复
      expect(mockElement.style.width).toBe(originalWidth);
      expect(mockElement.style.height).toBe(originalHeight);
      expect(mockElement.style.transform).toBe(originalTransform);
    });

    it('应该在发生错误时也能恢复样式', async () => {
      const originalWidth = mockElement.style.width;
      
      // Mock html2canvas to throw an error
      require('html2canvas').mockRejectedValueOnce(new Error('Test error'));

      try {
        await generateStandardPDF(mockElement, {
          filename: 'test-error-restore.pdf',
          format: 'a5',
          quality: 2,
          margin: 10
        });
      } catch (error) {
        // 预期的错误
      }

      // 验证样式仍然被恢复
      expect(mockElement.style.width).toBe(originalWidth);
    });
  });
}); 