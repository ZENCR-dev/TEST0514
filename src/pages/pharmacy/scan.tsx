import React, { useState, useCallback, useEffect } from 'react';
import { withAuth } from '@/components/auth/withAuth';
import { PharmacyLayout } from '@/layouts/PharmacyLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Scan, Search, AlertTriangle, CheckCircle, XCircle, Info, Monitor, Smartphone, Camera, Zap } from 'lucide-react';
import { QrScanner } from '@/components/pharmacy';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Html5QrcodeResult } from 'html5-qrcode';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// 设备类型检测
const isMobileDevice = () => {
  // 检查是否为移动设备
  const userAgent = typeof window !== 'undefined' ? navigator.userAgent : '';
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
};

function ScanPage() {
  const [prescriptionId, setPrescriptionId] = useState('');
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [processingResult, setProcessingResult] = useState<boolean>(false);

  // 检测设备类型
  useEffect(() => {
    setIsMobile(isMobileDevice());
  }, []);

  const handleManualSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!prescriptionId.trim()) return;
    setScannedData(null);
    setScanError(null);
    setProcessingResult(true);
    
    // 模拟API请求延迟
    setTimeout(() => {
      setProcessingResult(false);
      alert(`将查询处方ID: ${prescriptionId}\n这是一个模拟功能，实际开发中将从后端获取处方信息。`);
    }, 800);
  }, [prescriptionId]);

  const handleScanSuccess = useCallback((decodedText: string, decodedResult: Html5QrcodeResult) => {
    console.log("扫描成功:", decodedText);
    setProcessingResult(true);
    
    // 模拟处理延迟
    setTimeout(() => {
      setScannedData(decodedText);
      setScanError(null);
      setShowScanner(false);
      setProcessingResult(false);
    }, 500);
  }, []);

  const handleScanError = useCallback((errorMessage: any) => {
    let errorStringToTest = '';
    if (typeof errorMessage === 'string') {
      errorStringToTest = errorMessage;
    } else if (errorMessage && typeof errorMessage.message === 'string') {
      errorStringToTest = errorMessage.message;
    }

    if (errorStringToTest.includes('NotFoundException') || 
        errorStringToTest.includes('No MultiFormat Readers were able to detect the code')) {
      console.warn(`[SCANNER] 当前帧未找到二维码或格式解析错误。扫描仍在继续。错误信息: ${errorStringToTest}`);
      return; 
    }

    console.error("[SCANNER] 发生扫描错误:", errorMessage);
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
    }
    
    setScanError(displayError);
    setScannedData(null);
    setProcessingResult(false);
  }, []);

  return (
    <PharmacyLayout title="扫描处方 - 药房管理">
      <div>
        <h1 className="text-2xl font-bold mb-6">扫描/查询处方</h1>
        
        <div className="space-y-8">
          <div className="bg-card p-6 rounded-lg border">
            <div className="flex items-center mb-4">
              <Camera className="h-8 w-8 mr-3 text-primary" />
              <h2 className="text-xl font-semibold">处方二维码扫描</h2>
            </div>
            
            {!showScanner ? (
              <>
                <Button 
                  onClick={() => {
                    setShowScanner(true);
                    setScannedData(null);
                    setScanError(null);
                  }}
                  className="w-full sm:w-auto"
                >
                  <Scan className="mr-2 h-4 w-4" /> 开始扫描
                </Button>
                
                <Alert variant="default" className="mt-4 bg-muted/50">
                  <Info className="h-4 w-4" />
                  <AlertTitle>扫描提示</AlertTitle>
                  <AlertDescription className="text-sm">
                    <Tabs defaultValue={isMobile ? "mobile" : "desktop"}>
                      <TabsList className="mb-2">
                        <TabsTrigger value="mobile" className="flex items-center">
                          <Smartphone className="h-4 w-4 mr-1" /> 移动设备
                        </TabsTrigger>
                        <TabsTrigger value="desktop" className="flex items-center">
                          <Monitor className="h-4 w-4 mr-1" /> 电脑
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value="mobile">
                        <ul className="list-disc pl-5 space-y-1">
                          <li>请确保处方二维码清晰可见</li>
                          <li>将二维码对准扫描框中央</li>
                          <li>保持手机稳定，距离二维码约10-20厘米</li>
                          <li>环境光线充足时扫描效果更佳</li>
                          <li>如遇扫描困难，可尝试手动输入处方ID</li>
                        </ul>
                      </TabsContent>
                      <TabsContent value="desktop">
                        <ul className="list-disc pl-5 space-y-1">
                          <li><strong>重要：</strong>将二维码<strong>靠近</strong>摄像头（约5-15厘米）</li>
                          <li>确保二维码对准扫描框中央</li>
                          <li>对于低分辨率摄像头，尽量保持二维码与摄像头垂直</li>
                          <li>环境光线充足但避免强光直射</li>
                          <li>扫描过程中会有分页提示，请注意查看</li>
                          <li>如果扫描不成功，可尝试调整距离或角度</li>
                        </ul>
                      </TabsContent>
                    </Tabs>
                  </AlertDescription>
                </Alert>
              </>
            ) : (
              <>
                <div className="mb-2">
                  <div className="flex items-center">
                    <Zap className="h-4 w-4 text-amber-500 mr-2" />
                    <p className="text-sm text-amber-500 font-medium">
                      {isMobile ? "正在使用移动设备摄像头" : "正在使用电脑摄像头"}
                    </p>
                  </div>
                </div>
                
                <QrScanner 
                  isActive={showScanner}
                  onScanSuccess={handleScanSuccess} 
                  onScanFailure={handleScanError} 
                  verbose={true}
                />
                
                <Button 
                  variant="destructive" 
                  onClick={() => {
                    setShowScanner(false);
                    // 添加延迟，确保扫描器有时间完全停止和释放资源
                    setTimeout(() => {
                      setScanError(null);
                    }, 300);
                  }} 
                  className="w-full sm:w-auto mt-4"
                >
                  <XCircle className="h-4 w-4 mr-2" /> 取消扫描
                </Button>
              </>
            )}

            {scanError && (
              <Alert variant="destructive" className="mt-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>扫描错误</AlertTitle>
                <AlertDescription>{scanError}</AlertDescription>
              </Alert>
            )}
            
            {processingResult && (
              <Alert variant="default" className="mt-4 animate-pulse">
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                <AlertTitle>处理中</AlertTitle>
                <AlertDescription>正在处理扫描结果，请稍候...</AlertDescription>
              </Alert>
            )}
            
            {scannedData && !processingResult && (
              <Alert variant="default" className="mt-4 border-green-500 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <AlertTitle className="text-green-700">扫描成功</AlertTitle>
                <AlertDescription>
                  <div className="mt-2 p-3 bg-white rounded-md border border-green-200">
                    <p className="text-xs text-muted-foreground mb-1">识别到的内容:</p>
                    <pre className="whitespace-pre-wrap bg-muted p-2 rounded-md text-sm overflow-auto max-h-24">{scannedData}</pre>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </div>
          
          <div className="bg-card p-6 rounded-lg border">
            <div className="flex items-center mb-4">
                <Search className="h-8 w-8 mr-3 text-primary" />
                <h2 className="text-xl font-semibold">手动输入处方ID</h2>
            </div>
            <form onSubmit={handleManualSearch} className="flex flex-col sm:flex-row gap-2">
              <Input
                type="text"
                placeholder="输入处方ID，例如: RX-12345"
                value={prescriptionId}
                onChange={(e) => setPrescriptionId(e.target.value)}
                className="flex-grow"
              />
              <Button 
                type="submit" 
                disabled={!prescriptionId.trim() || processingResult}
                className="w-full sm:w-auto"
              >
                {processingResult ? (
                  <>
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    处理中...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    查询处方
                  </>
                )}
              </Button>
            </form>
            
            <p className="text-xs text-muted-foreground mt-3">
              如果无法扫描二维码，您可以手动输入处方ID。处方ID通常印在处方单的顶部或底部，格式为&ldquo;RX-&rdquo;后跟数字。
            </p>
          </div>
        </div>
      </div>
    </PharmacyLayout>
  );
}

export default withAuth(ScanPage, { allowedRoles: ['pharmacy'] }); 