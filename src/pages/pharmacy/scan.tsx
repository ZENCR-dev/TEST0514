import React, { useState } from 'react';
import { withAuth } from '@/components/auth/withAuth';
import { PharmacyLayout } from '@/layouts/PharmacyLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Scan, Search, AlertTriangle, CheckCircle } from 'lucide-react';
import { QrScanner } from '@/components/pharmacy';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

function ScanPage() {
  const [prescriptionId, setPrescriptionId] = useState('');
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const [showScanner, setShowScanner] = useState(false);

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prescriptionId.trim()) return;
    setScannedData(null);
    setScanError(null);
    alert(`将查询处方ID: ${prescriptionId}\n这是一个模拟功能，实际开发中将从后端获取处方信息。`);
  };

  const handleScanSuccess = (decodedText: string) => {
    console.log("Scan successful:", decodedText);
    setScannedData(decodedText);
    setScanError(null);
    setShowScanner(false);
  };

  const handleScanError = (errorMessage: any) => {
    // console.error("Scan error object:", errorMessage); // Log the full error object for deeper inspection

    // More specific check for the NotFoundException from html5-qrcode
    if (typeof errorMessage === 'string' && errorMessage.includes('NotFoundException')) {
      // This error can be frequent if no QR code is in view. Log it but don't show a disruptive UI error.
      console.warn("QR code not found in current frame. Scanner is still active.");
      // Optionally, you could set a very subtle UI hint that it's actively scanning but not finding anything yet.
      // For now, we will not set a major error state for this specific, common case.
      return; 
    }

    console.error("Scan error reported to user:", errorMessage);
    let displayError = "扫描失败，请重试。";

    if (typeof errorMessage === 'string') {
      if (errorMessage.toLowerCase().includes('notallowederror')) {
        displayError = "无法访问摄像头。请检查浏览器权限设置并允许访问摄像头。确保通过HTTPS访问页面。";
      } else {
        // displayError = `扫描错误: ${errorMessage}`; // Avoid showing raw technical error strings directly
        console.warn(`Raw error message string: ${errorMessage}`);
      }
    } else if (errorMessage && (errorMessage.name === 'NotAllowedError' || errorMessage.message?.toLowerCase().includes('permission denied'))) {
      displayError = "无法访问摄像头。请检查浏览器权限设置并允许访问摄像头。确保通过HTTPS访问页面。";
    } else if (errorMessage && typeof errorMessage.message === 'string') {
      // displayError = `扫描错误: ${errorMessage.message}`;
      console.warn(`Error object message: ${errorMessage.message}`);
    }
    
    setScanError(displayError);
    setScannedData(null);
    // setShowScanner(false); // Consider if scanner should be hidden on other errors too
  };

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

            {showScanner && (
              <div>
                <p className="text-sm text-muted-foreground mb-4">
                  请将处方二维码置于摄像头扫描框内。
                </p>
                <QrScanner 
                  onScanSuccess={handleScanSuccess} 
                  onScanFailure={handleScanError} 
                  verbose={true}
                />
                <Button 
                  variant="outline" 
                  onClick={() => setShowScanner(false)} 
                  className="w-full sm:w-auto mt-4"
                >
                  取消扫描
                </Button>
              </div>
            )}

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