import React, { useState, useCallback, useRef, useEffect } from 'react';
import { withAuth } from '@/components/auth/withAuth';
import { PharmacyLayout } from '@/layouts/PharmacyLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Scan, Search, AlertTriangle, CheckCircle, XCircle, Info, Calculator, DollarSign, FileText, Download, Printer } from 'lucide-react';
import { QrScanner } from '@/components/pharmacy';
import { CameraSelector } from '@/components/pharmacy/CameraSelector';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Html5QrcodeResult } from 'html5-qrcode';
import { parseQrText, isPossiblePrescriptionQR } from '@/utils/qrParser';
import { calculatePrescription, formatPrice, type PrescriptionCalculationResult } from '@/utils/prescriptionCalculator';
import { PrescriptionParseStatus } from '@/types/prescription';
import { generateInvoiceData } from '@/utils/invoiceGenerator';
import { InvoiceContent } from '@/components/invoice/InvoiceContent';
import { InvoiceData } from '@/types/invoice';
import { generateStandardPDF, generatePrintHTML } from '@/utils/pdfGenerator';
import { initializeRecommendedCameraId } from '@/utils/cameraUtils';
import { Toaster } from '@/components/ui/toaster';

function ScanPage() {
  const [prescriptionId, setPrescriptionId] = useState('');
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [selectedCameraId, setSelectedCameraId] = useState<string>('');
  const [cameraInitialized, setCameraInitialized] = useState(false);
  const [isClient, setIsClient] = useState(false); // 客户端渲染检查
  
  // 新增状态：处方解析和计算结果
  const [parseStatus, setParseStatus] = useState<PrescriptionParseStatus>('idle');
  const [parseError, setParseError] = useState<string | null>(null);
  const [calculationResult, setCalculationResult] = useState<PrescriptionCalculationResult | null>(null);

  // 报价单相关状态
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const [invoiceGenerating, setInvoiceGenerating] = useState(false);
  const invoiceContentRef = useRef<HTMLDivElement>(null);

  // 客户端渲染检查
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 初始化推荐摄像头
  useEffect(() => {
    // 确保只在客户端环境中运行
    if (!isClient) return;
    
    const initCamera = async () => {
      try {
        const recommendedId = await initializeRecommendedCameraId();
        if (recommendedId) {
          setSelectedCameraId(recommendedId);
          setCameraInitialized(true);
          console.log('[ScanPage] Initialized with recommended camera:', recommendedId);
        } else {
          console.warn('[ScanPage] No recommended camera found');
          setCameraInitialized(true); // 仍然标记为已初始化，让用户手动选择
        }
      } catch (error) {
        console.error('[ScanPage] Error initializing camera:', error);
        setCameraInitialized(true); // 即使出错也标记为已初始化
      }
    };

    initCamera();
  }, [isClient]);

  // 处理QR码解析和计算
  const processPrescriptionQR = useCallback((qrText: string) => {
    setParseStatus('parsing');
    setParseError(null);
    setCalculationResult(null);

    // 1. 快速检查是否可能是处方QR码
    if (!isPossiblePrescriptionQR(qrText)) {
      setParseStatus('error');
      setParseError('扫描的内容不是有效的处方二维码');
      return;
    }

    // 2. 解析QR码内容
    const parseResult = parseQrText(qrText);
    if (!parseResult.success) {
      setParseStatus('error');
      setParseError(parseResult.error || '解析处方数据失败');
      return;
    }

    // 3. 计算处方价格
    try {
      const calculation = calculatePrescription(parseResult.data!);
      setCalculationResult(calculation);
      setParseStatus('success');
      
      if (!calculation.success) {
        setParseError(calculation.error || '计算处方价格时发生错误');
      }
    } catch (error) {
      console.error('[Prescription Calculation] Error:', error);
      setParseStatus('error');
      setParseError('计算处方价格时发生未知错误');
    }
  }, []);

  const handleManualSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!prescriptionId.trim()) return;
    
    // 清除之前的状态
    setScannedData(null);
    setScanError(null);
    setParseError(null);
    setCalculationResult(null);
    
    // 尝试将输入作为QR码文本处理
    setScannedData(prescriptionId);
    processPrescriptionQR(prescriptionId);
  }, [prescriptionId, processPrescriptionQR]);

  // 开始扫描的处理函数
  const handleStartScanning = useCallback(() => {
    // 彻底重置所有相关状态
    setShowScanner(true);
    setScannedData(null);
    setScanError(null);
    setParseError(null);
    setCalculationResult(null);
    setParseStatus('idle');
    
    console.log('[ScanPage] Starting scan with camera:', selectedCameraId);
  }, [selectedCameraId]);

  // 停止扫描的处理函数
  const handleStopScanning = useCallback(() => {
    setShowScanner(false);
    setScanError(null);
    console.log('[ScanPage] Stopping scan');
  }, []);

  const handleScanSuccess = useCallback((decodedText: string, decodedResult: Html5QrcodeResult) => {
    console.log("Scan successful:", decodedText, decodedResult);
    
    // 立即设置扫描结果并关闭扫描器
    setScannedData(decodedText);
    setScanError(null); // 清除任何之前的错误
    setShowScanner(false);
    
    // 开始解析和计算处方
    processPrescriptionQR(decodedText);
  }, [processPrescriptionQR]);

  const handleScanError = useCallback((errorMessage: any) => {
    let errorStringToTest = '';
    if (typeof errorMessage === 'string') {
      errorStringToTest = errorMessage;
    } else if (errorMessage && typeof errorMessage.message === 'string') {
      errorStringToTest = errorMessage.message;
    }

    // 忽略常见的非关键扫描错误
    if (errorStringToTest.includes('NotFoundException') || 
        errorStringToTest.includes('No MultiFormat Readers were able to detect the code')) {
      console.warn(`[SCANNER] QR code not found in current frame or a parse error occurred for the frame. Scanner is still active. Message: ${errorStringToTest}`);
      return; 
    }

    // 特别处理Canvas/视频流相关错误
    if (errorStringToTest.includes('getImageData') ||
        errorStringToTest.includes('source width is 0') ||
        errorStringToTest.includes('IndexSizeError') ||
        errorStringToTest.includes('Canvas') ||
        errorStringToTest.toLowerCase().includes('video')) {
      console.warn('[SCANNER] Canvas/Video stream error, attempting recovery:', errorStringToTest);
      
      // 设置更友好的错误信息
      setScanError("摄像头初始化中，请稍候重试。如果问题持续，请检查摄像头权限设置。");
      
      // 自动重试机制
      setTimeout(() => {
        if (showScanner) {
          console.log('[SCANNER] Auto-retrying scan after canvas error');
          setScanError(null); // 清除错误信息，让用户可以重试
        }
      }, 3000);
      
      return;
    }

    console.error("[SCANNER] A more critical scan error occurred:", errorMessage);
    let displayError = "扫描失败，请重试。";

    const lowerErrorString = errorStringToTest.toLowerCase();
    if (lowerErrorString.includes('notallowederror') || 
        lowerErrorString.includes('permission denied') || 
        (errorMessage && errorMessage.name === 'NotAllowedError')) {
      displayError = "无法访问摄像头。请检查浏览器权限设置并允许访问摄像头。确保通过HTTPS访问页面。";
    } else if (errorMessage && errorMessage.name === 'NotFoundError') {
        displayError = "未找到可用的摄像头设备。";
    } else if (errorMessage && errorMessage.name === 'NotReadableError') {
        displayError = "摄像头当前无法访问，可能已被其他应用占用或存在硬件问题。";
    } else if (lowerErrorString.includes('overconstrained') || 
               lowerErrorString.includes('constraint')) {
        displayError = "摄像头配置不兼容。请尝试选择其他摄像头或重新启动浏览器。";
    }
    
    setScanError(displayError);
    setScannedData(null);
  }, [showScanner]);

  // 生成报价单
  const handleGenerateInvoice = useCallback(() => {
    if (!calculationResult || !calculationResult.success) {
      alert('请先扫描或解析有效的处方');
      return;
    }

    setInvoiceGenerating(true);
    try {
      // 将calculationResult中的medicineDetails转换为PrescriptionItem格式
      const prescriptionItems = calculationResult.originalItems.map((item, index) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        copies: calculationResult.copies,
        instructions: calculationResult.instructions
      }));

             // 生成报价单数据
       const invoice = generateInvoiceData(
         prescriptionItems,
         15, // 默认处方费15元
         calculationResult.prescriptionId || `backup-${Date.now()}`, // 使用QR码中的真实处方ID
         '测试药房' // 可以从用户信息或配置中获取
       );

      setInvoiceData(invoice);
      setShowInvoiceModal(true);
    } catch (error) {
      console.error('生成报价单失败:', error);
      alert('生成报价单失败，请重试');
    } finally {
      setInvoiceGenerating(false);
    }
  }, [calculationResult]);

  // 下载报价单PDF
  const handleDownloadInvoicePDF = useCallback(async () => {
    if (!invoiceContentRef.current) {
      alert('报价单内容未准备好');
      return;
    }

    try {
      await generateStandardPDF(invoiceContentRef.current, {
        filename: `invoice-${invoiceData?.id || Date.now()}.pdf`,
        format: 'a4',
        quality: 2,
        margin: 15
      });
    } catch (error) {
      console.error('生成PDF失败:', error);
      alert('PDF生成失败，请重试');
    }
  }, [invoiceData]);

  // 打印报价单
  const handlePrintInvoice = useCallback(async () => {
    if (!invoiceContentRef.current) {
      alert('报价单内容未准备好');
      return;
    }

    try {
      const printHTML = await generatePrintHTML(invoiceContentRef.current, {
        title: `报价单 - ${invoiceData?.id}`,
        format: 'a4'
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
  }, [invoiceData]);

  return (
    <PharmacyLayout title="扫描处方 - 药房管理">
      <div>
        <h1 className="text-2xl font-bold mb-6">扫描/查询处方</h1>
        
        <div className="space-y-8">
          <div className="bg-card p-6 rounded-lg border">
            <div className="flex items-center mb-4">
              <Scan className="h-8 w-8 mr-3 text-primary" />
              <h2 className="text-xl font-semibold">处方二维码扫描</h2>
            </div>
            
            {!showScanner && (
              <>
                <Button 
                  onClick={handleStartScanning}
                  className="w-full sm:w-auto"
                  disabled={!cameraInitialized}
                >
                  <Scan className="mr-2 h-4 w-4" /> 
                  {cameraInitialized ? '开始扫描' : '正在初始化摄像头...'}
                </Button>
                
                <Alert variant="default" className="mt-4 bg-muted/50">
                  <Info className="h-4 w-4" />
                  <AlertTitle>扫描提示</AlertTitle>
                  <AlertDescription className="text-sm">
                    <ul className="list-disc pl-5 space-y-1">
                      <li>请确保处方二维码清晰可见</li>
                      <li>将二维码对准扫描框中央</li>
                      <li>保持手机稳定，适当调整设备与二维码的距离，直至系统能够识别</li>
                      <li>环境光线充足时扫描效果更佳</li>
                    </ul>
                  </AlertDescription>
                </Alert>
              </>
            )}

            <div style={{ display: showScanner ? 'block' : 'none' }}>
              {/* 摄像头选择器 */}
              <div className="mb-4">
                <CameraSelector
                  onCameraSelect={setSelectedCameraId}
                  selectedCameraId={selectedCameraId}
                  disabled={!showScanner}
                  autoSelectOnLoad={false} // 不要自动选择，因为我们已经在页面级别初始化了
                />
              </div>
              
              <QrScanner 
                isActive={showScanner}
                onScanSuccess={handleScanSuccess} 
                onScanFailure={handleScanError} 
                verbose={true}
                cameraId={selectedCameraId}
              />
              <Button 
                variant="destructive" 
                onClick={handleStopScanning} 
                className="w-full sm:w-auto mt-4"
              >
                <XCircle className="h-4 w-4 mr-2" /> 取消扫描
              </Button>
            </div>

            {scanError && (
              <Alert variant="destructive" className="mt-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>扫描错误</AlertTitle>
                <AlertDescription>{scanError}</AlertDescription>
              </Alert>
            )}
            {scannedData && (
              <Alert variant="default" className="mt-4">
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>扫描成功</AlertTitle>
                <AlertDescription>
                  识别到的内容: <pre className="whitespace-pre-wrap bg-muted p-2 rounded-md text-xs">{scannedData}</pre>
                </AlertDescription>
              </Alert>
            )}

            {/* 处方解析状态显示 */}
            {parseStatus === 'parsing' && (
              <Alert variant="default" className="mt-4">
                <Calculator className="h-4 w-4" />
                <AlertTitle>正在解析处方</AlertTitle>
                <AlertDescription>正在解析处方内容并计算价格...</AlertDescription>
              </Alert>
            )}

            {parseError && (
              <Alert variant="destructive" className="mt-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>解析错误</AlertTitle>
                <AlertDescription>{parseError}</AlertDescription>
              </Alert>
            )}
          </div>
          
          <div className="bg-card p-6 rounded-lg border">
            <div className="flex items-center mb-4">
                <Search className="h-8 w-8 mr-3 text-primary" />
                <h2 className="text-xl font-semibold">手动输入QR码内容</h2>
            </div>
            <form onSubmit={handleManualSearch} className="flex flex-col sm:flex-row gap-2">
              <Input
                type="text"
                placeholder="输入处方QR码JSON内容或处方ID"
                value={prescriptionId}
                onChange={(e) => setPrescriptionId(e.target.value)}
                className="flex-grow"
              />
              <Button type="submit" disabled={!prescriptionId.trim()} className="w-full sm:w-auto">
                <Search className="h-4 w-4 mr-2" />
                解析处方
              </Button>
            </form>
          </div>

          {/* 处方计算结果显示 */}
          {calculationResult && parseStatus === 'success' && (
            <div className="bg-card p-6 rounded-lg border">
              <div className="flex items-center mb-4">
                <DollarSign className="h-8 w-8 mr-3 text-primary" />
                <h2 className="text-xl font-semibold">处方价格计算结果</h2>
              </div>

              {/* 基本信息 */}
              <div className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <span className="font-medium text-gray-600">处方编号:</span>
                    <span className="ml-2 text-lg font-semibold text-blue-600">{calculationResult.prescriptionId}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">帖数:</span>
                    <span className="ml-2 text-lg font-semibold">{calculationResult.copies} 帖</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">药品种类:</span>
                    <span className="ml-2 text-lg font-semibold">{calculationResult.medicineDetails.length} 种</span>
                  </div>
                </div>
                <div>
                  <span className="font-medium text-gray-600">用法说明:</span>
                  <p className="mt-1 text-sm bg-muted p-2 rounded">{calculationResult.instructions}</p>
                </div>
              </div>

              {/* 药品详情 */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">药品明细</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-muted">
                        <th className="border border-gray-300 px-3 py-2 text-left">药品名称</th>
                        <th className="border border-gray-300 px-3 py-2 text-right">用量(克)</th>
                        <th className="border border-gray-300 px-3 py-2 text-right">零售价</th>
                        <th className="border border-gray-300 px-3 py-2 text-right">成本价</th>
                        <th className="border border-gray-300 px-3 py-2 text-right">状态</th>
                      </tr>
                    </thead>
                    <tbody>
                      {calculationResult.medicineDetails.map((medicine, index) => {
                        const originalItem = calculationResult.originalItems[index];
                        const quantity = originalItem?.quantity || 0;
                        
                        return (
                          <tr key={medicine.id || index} className={!medicine.found ? 'bg-red-50' : ''}>
                            <td className="border border-gray-300 px-3 py-2">
                              {medicine.chineseName || originalItem?.name || '未知药品'}
                              {!medicine.found && <span className="text-red-500 text-xs ml-2">(未找到)</span>}
                            </td>
                            <td className="border border-gray-300 px-3 py-2 text-right">
                              {quantity > 0 ? `${quantity}g` : '-'}
                            </td>
                            <td className="border border-gray-300 px-3 py-2 text-right">
                              {medicine.found ? formatPrice(medicine.pricePerGram, 'NZ$') : '-'}
                            </td>
                            <td className="border border-gray-300 px-3 py-2 text-right">
                              {medicine.found ? formatPrice(medicine.costPrice, 'NZ$') : '-'}
                            </td>
                            <td className="border border-gray-300 px-3 py-2 text-right">
                              {medicine.found ? 
                                <span className="text-green-600 text-sm">✓ 可供应</span> : 
                                <span className="text-red-600 text-sm">✗ 缺货</span>
                              }
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 价格汇总 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">单剂价格</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>零售价:</span>
                      <span className="font-medium">{formatPrice(calculationResult.singleDoseRetailTotal, 'NZ$')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>成本价:</span>
                      <span className="font-medium">{formatPrice(calculationResult.singleDoseCostTotal, 'NZ$')}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">总价 ({calculationResult.copies} 帖)</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>零售总价:</span>
                      <span className="font-bold text-lg">{formatPrice(calculationResult.totalRetailPrice, 'NZ$')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>成本总价:</span>
                      <span className="font-bold text-lg text-green-600">{formatPrice(calculationResult.totalCostPrice, 'NZ$')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 未找到的药品警告 */}
              {calculationResult.notFoundMedicines.length > 0 && (
                <Alert variant="destructive" className="mt-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>部分药品缺货</AlertTitle>
                  <AlertDescription>
                    以下药品在库存中未找到: {calculationResult.notFoundMedicines.join(', ')}
                  </AlertDescription>
                </Alert>
              )}

              {/* 操作按钮 */}
              <div className="flex flex-col sm:flex-row gap-2 mt-6">
                <Button 
                  className="flex-1"
                  onClick={handleGenerateInvoice}
                  disabled={invoiceGenerating || !calculationResult?.success}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  {invoiceGenerating ? '生成中...' : '生成报价单'}
                </Button>
                <Button variant="outline" className="flex-1">
                  打印处方详情
                </Button>
                <Button variant="outline" className="flex-1">
                  导出Excel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 报价单模态框 */}
      {showInvoiceModal && invoiceData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">报价单预览</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowInvoiceModal(false)}
              >
                <XCircle className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex-1 overflow-auto p-4">
              <div ref={invoiceContentRef}>
                <InvoiceContent invoice={invoiceData} />
              </div>
            </div>
            
            <div className="flex justify-end gap-2 p-4 border-t">
              <Button variant="outline" onClick={handlePrintInvoice}>
                <Printer className="h-4 w-4 mr-2" />
                打印
              </Button>
              <Button onClick={handleDownloadInvoicePDF}>
                <Download className="h-4 w-4 mr-2" />
                下载PDF
              </Button>
              <Button variant="outline" onClick={() => setShowInvoiceModal(false)}>
                关闭
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Toast组件 */}
      <Toaster />
    </PharmacyLayout>
  );
}

export default withAuth(ScanPage, { allowedRoles: ['pharmacy'] }); 