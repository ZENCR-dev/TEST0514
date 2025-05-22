import React, { useState, useCallback } from 'react';
import { withAuth } from '@/components/auth/withAuth';
import { PharmacyLayout } from '@/layouts/PharmacyLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Scan, Search, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { QrScanner } from '@/components/pharmacy';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Html5QrcodeResult } from 'html5-qrcode';

function ScanPage() {
  const [prescriptionId, setPrescriptionId] = useState('');
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const [showScanner, setShowScanner] = useState(false);

  const handleManualSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!prescriptionId.trim()) return;
    setScannedData(null);
    setScanError(null);
    alert(`将查询处方ID: ${prescriptionId}\n这是一个模拟功能，实际开发中将从后端获取处方信息。`);
  }, [prescriptionId]);

  const handleScanSuccess = useCallback((decodedText: string, decodedResult: Html5QrcodeResult) => {
    console.log("Scan successful:", decodedText, decodedResult);
    setScannedData(decodedText);
    setScanError(null);
    setShowScanner(false);
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
      console.warn(`[SCANNER] QR code not found in current frame or a parse error occurred for the frame. Scanner is still active. Message: ${errorStringToTest}`);
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
    }
    
    setScanError(displayError);
    setScannedData(null);
  }, []);

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
            )}

            <div style={{ display: showScanner ? 'block' : 'none' }}>
              <p className="text-sm text-muted-foreground mb-4">
                请将处方二维码置于摄像头扫描框内。
              </p>
              <QrScanner 
                isActive={showScanner}
                onScanSuccess={handleScanSuccess} 
                onScanFailure={handleScanError} 
                verbose={true}
              />
              <Button 
                variant="destructive" 
                onClick={() => setShowScanner(false)} 
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
                  识别到的内容: <pre className="whitespace-pre-wrap bg-muted p-2 rounded-md">{scannedData}</pre>
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
              <Button type="submit" disabled={!prescriptionId.trim()} className="w-full sm:w-auto">
                <Search className="h-4 w-4 mr-2" />
                查询处方
              </Button>
            </form>
          </div>
        </div>
      </div>
    </PharmacyLayout>
  );
}

export default withAuth(ScanPage, { allowedRoles: ['pharmacy'] }); 