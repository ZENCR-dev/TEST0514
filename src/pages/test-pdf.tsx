import React, { useRef, useState, useEffect } from 'react';
import { generateStandardPDF, generatePrintHTML } from '@/utils/pdfGenerator';

export default function TestPDFPage() {
  const testContentRef = useRef<HTMLDivElement>(null);
  const [windowInfo, setWindowInfo] = useState({
    innerWidth: 0,
    innerHeight: 0,
    devicePixelRatio: 1,
    zoomLevel: 100,
    isClient: false
  });
  
  // 使用固定的日期和编号，避免服务器端和客户端不一致
  const [testDate, setTestDate] = useState('');
  const [docNumber, setDocNumber] = useState('');

  useEffect(() => {
    // 只在客户端执行
    if (typeof window !== 'undefined') {
      const updateWindowInfo = () => {
        setWindowInfo({
          innerWidth: window.innerWidth,
          innerHeight: window.innerHeight,
          devicePixelRatio: window.devicePixelRatio,
          zoomLevel: Math.round(window.outerWidth / window.innerWidth * 100),
          isClient: true
        });
      };

      updateWindowInfo();
      window.addEventListener('resize', updateWindowInfo);
      
      // 设置日期和文档编号
      setTestDate(new Date().toLocaleDateString());
      setDocNumber(`TEST-${Date.now().toString().slice(-6)}`);
      
      return () => window.removeEventListener('resize', updateWindowInfo);
    }
  }, []);

  const handleDownloadPDF = async () => {
    if (!testContentRef.current) return;
    
    try {
      await generateStandardPDF(testContentRef.current, {
        filename: `test-pdf-${new Date().getTime()}.pdf`,
        format: 'a5',
        quality: 2,
        margin: 10
      });
    } catch (error) {
      console.error('PDF生成失败:', error);
      alert('PDF生成失败，请重试');
    }
  };

  const handlePrint = async () => {
    if (!testContentRef.current) return;
    
    try {
      const printHTML = await generatePrintHTML(testContentRef.current, {
        title: 'PDF测试页面打印',
        format: 'a5'
      });
      
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        alert('无法打开打印窗口，请检查浏览器弹窗拦截设置');
        return;
      }
      
      printWindow.document.write(printHTML);
      printWindow.document.close();
    } catch (error) {
      console.error('打印准备失败:', error);
      alert('打印准备失败，请重试');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">PDF生成测试页面</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">测试说明</h2>
          <div className="space-y-2 text-gray-700">
            <p>• 此页面用于测试PDF生成功能在不同浏览器缩放比例下的一致性</p>
            <p>• 请尝试将浏览器缩放到50%、75%、100%、125%、150%、200%等不同比例</p>
            <p>• 在每个缩放比例下点击&ldquo;下载PDF&rdquo;按钮，验证生成的PDF格式是否一致</p>
            <p>• 生成的PDF应始终保持A5格式（148mm × 210mm）</p>
          </div>
        </div>

        {/* 当前浏览器信息，只在客户端渲染 */}
        {windowInfo.isClient && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">当前浏览器信息</h2>
            <div className="space-y-2 text-sm text-gray-600">
              <p>窗口尺寸: {`${windowInfo.innerWidth} × ${windowInfo.innerHeight}`}</p>
              <p>设备像素比: {windowInfo.devicePixelRatio}</p>
              <p>预估缩放比例: {`${windowInfo.zoomLevel}%`}</p>
            </div>
          </div>
        )}

        {/* 测试内容区域 */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div ref={testContentRef} className="bg-white p-6 border rounded">
            <div className="flex justify-between items-start mb-4">
              <div className="text-left">
                <h1 className="text-xl font-bold">PDF导出测试文档</h1>
                <p className="text-gray-500 text-sm">PDF Generation Test Document</p>
              </div>
              
              <div className="border rounded p-2 bg-white text-center">
                <div className="w-20 h-20 bg-gray-200 border-2 border-gray-400 flex items-center justify-center">
                  <span className="text-xs">QR码占位符</span>
                </div>
                <div className="text-xs mt-1">测试QR码</div>
              </div>
            </div>
            
            <div className="mb-4 border-t border-gray-200 pt-2">
              <div className="grid grid-cols-2 gap-x-4">
                <div className="mb-2">
                  <span className="font-medium">测试日期:</span>
                  <span className="ml-2">{testDate || '加载中...'}</span>
                </div>
                <div className="mb-2">
                  <span className="font-medium">文档编号:</span>
                  <span className="ml-2">{docNumber || '加载中...'}</span>
                </div>
              </div>
            </div>
            
            <div className="mb-4 border-t border-gray-200 pt-2">
              <div className="font-medium mb-2">测试内容项目</div>
              <div className="grid grid-cols-3 gap-3">
                <div className="border-l pl-3">
                  <div className="py-2 border-b border-gray-100">
                    <div className="font-medium">项目A</div>
                    <div className="text-sm text-gray-600">测试项目A的描述内容</div>
                    <div className="text-right font-medium">15.00</div>
                  </div>
                  <div className="py-2 border-b border-gray-100">
                    <div className="font-medium">项目B</div>
                    <div className="text-sm text-gray-600">测试项目B的描述内容</div>
                    <div className="text-right font-medium">22.50</div>
                  </div>
                </div>
                
                <div className="border-l pl-3">
                  <div className="py-2 border-b border-gray-100">
                    <div className="font-medium">项目C</div>
                    <div className="text-sm text-gray-600">测试项目C的描述内容</div>
                    <div className="text-right font-medium">8.75</div>
                  </div>
                  <div className="py-2 border-b border-gray-100">
                    <div className="font-medium">项目D</div>
                    <div className="text-sm text-gray-600">测试项目D的描述内容</div>
                    <div className="text-right font-medium">33.25</div>
                  </div>
                </div>
                
                <div className="border-l pl-3">
                  <div className="py-2 border-b border-gray-100">
                    <div className="font-medium">项目E</div>
                    <div className="text-sm text-gray-600">测试项目E的描述内容</div>
                    <div className="text-right font-medium">12.00</div>
                  </div>
                  <div className="py-2 border-b border-gray-100">
                    <div className="font-medium">项目F</div>
                    <div className="text-sm text-gray-600">测试项目F的描述内容</div>
                    <div className="text-right font-medium">18.50</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-4 border-t border-gray-200 pt-2">
              <div className="font-medium mb-2">备注说明</div>
              <div className="p-2 bg-gray-50 rounded text-sm">
                这是一个用于测试PDF生成功能的模拟文档。无论浏览器处于何种缩放比例，
                生成的PDF都应该保持一致的A5格式（148mm × 210mm）和相同的内容布局。
                此测试验证了我们对html2canvas浏览器缩放兼容性问题的修复。
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-2">
              <div className="grid grid-cols-3 gap-x-4">
                <div className="mb-2">
                  <span className="font-medium">数据项数:</span>
                  <span className="ml-2">6项</span>
                </div>
                <div className="mb-2">
                  <span className="font-medium">总计金额:</span>
                  <span className="ml-2">110.00元</span>
                </div>
                <div className="mb-2 text-right">
                  <span className="font-medium">签名:</span>
                  <span className="ml-2 border-b border-gray-400 inline-block min-w-[100px]">&nbsp;</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={handleDownloadPDF}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            下载PDF (A5格式)
          </button>
          <button
            onClick={handlePrint}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            打印预览
          </button>
        </div>

        <div className="mt-6 text-center text-gray-500 text-sm">
          <p>请在不同浏览器缩放比例下测试此功能</p>
          <p>推荐测试缩放比例: 50%, 75%, 100%, 125%, 150%, 200%</p>
        </div>
      </div>
    </div>
  );
} 