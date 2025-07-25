/**
 * QR码显示组件 - DAY 3 Stage 2 核心业务逻辑
 * 处方QR码生成、显示和管理功能
 * 
 * @version 2.1 - Stage 2 Business Logic
 * @date 2025-01-21
 */

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  QrCode,
  Download,
  Share2,
  Copy,
  Printer,
  RefreshCw,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';

import { Prescription } from '@/types/prescription';
import { 
  generatePrescriptionQRCode,
  verifyPrescriptionQRCode
} from '@/services/prescriptionService';

interface QRCodeDisplayProps {
  prescription: Prescription;
  size?: number;
  showControls?: boolean;
  onQRGenerated?: (qrData: { qrCode: string; qrCodeUrl: string }) => void;
}

export function QRCodeDisplay({ 
  prescription, 
  size = 256,
  showControls = true,
  onQRGenerated
}: QRCodeDisplayProps) {
  const [qrData, setQrData] = useState<{ qrCode: string; qrCodeUrl: string } | null>(
    prescription.qrCodeData 
      ? { qrCode: prescription.qrCodeData, qrCodeUrl: prescription.qrCodeData }
      : null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showQRCode, setShowQRCode] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'verifying' | 'valid' | 'invalid'>('idle');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 生成QR码
  const handleGenerateQR = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await generatePrescriptionQRCode(prescription.id, { 
        size,
        includeFields: ['prescriptionId', 'medicines', 'instructions', 'copies'] // 移除patientInfo
      });
      
      setQrData(result);
      onQRGenerated?.(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成QR码失败');
    } finally {
      setLoading(false);
    }
  };

  // 验证QR码
  const handleVerifyQR = async () => {
    if (!qrData) return;
    
    setVerificationStatus('verifying');
    
    try {
      const result = await verifyPrescriptionQRCode({
        qrData: qrData.qrCode,
        verificationType: 'doctor'
      });
      
      setVerificationStatus(result.success ? 'valid' : 'invalid');
    } catch (err) {
      setVerificationStatus('invalid');
    }
  };

  // 复制QR码数据
  const handleCopyQRData = async () => {
    if (!qrData) return;
    
    try {
      await navigator.clipboard.writeText(qrData.qrCode);
      // 这里可以添加成功提示
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  // 下载QR码
  const handleDownloadQR = () => {
    if (!qrData) return;
    
    const link = document.createElement('a');
    link.href = qrData.qrCodeUrl;
    link.download = `prescription-${prescription.prescriptionId || prescription.id}-qr.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 打印QR码
  const handlePrintQR = () => {
    if (!qrData) return;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>处方QR码 - ${prescription.prescriptionId || prescription.id}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              text-align: center; 
              padding: 20px; 
            }
            .qr-container { 
              margin: 20px auto; 
            }
            .prescription-info {
              margin-top: 20px;
              text-align: left;
              max-width: 400px;
              margin-left: auto;
              margin-right: auto;
            }
          </style>
        </head>
        <body>
          <h1>中医处方 QR码</h1>
          <div class="qr-container">
            <img src="${qrData.qrCodeUrl}" alt="处方QR码" style="max-width: 300px;" />
          </div>
          <div class="prescription-info">
            <p><strong>处方编号:</strong> ${prescription.prescriptionId || prescription.id}</p>
            <p><strong>处方类型:</strong> 隐私保护处方</p>
            <p><strong>创建时间:</strong> ${new Date(prescription.createdAt).toLocaleString('zh-CN')}</p>
            <p><strong>医师:</strong> ${prescription.doctorId || '未知'}</p>
            <p><strong>总金额:</strong> ¥${(prescription.totalPrice || 0).toFixed(2)}</p>
          </div>
          <script>
            window.onload = function() {
              window.print();
              window.close();
            }
          </script>
        </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  // 分享QR码
  const handleShareQR = async () => {
    if (!qrData) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `处方QR码 - ${prescription.prescriptionId || prescription.id}`,
          text: `处方 ${prescription.prescriptionId || prescription.id} 的QR码`,
          url: qrData.qrCodeUrl
        });
      } catch (err) {
        // 分享被取消或失败，使用复制作为后备
        handleCopyQRData();
      }
    } else {
      // 浏览器不支持Web Share API，使用复制
      handleCopyQRData();
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5" />
            处方QR码
          </div>
          {verificationStatus !== 'idle' && (
            <Badge 
              variant={verificationStatus === 'valid' ? 'default' : 'destructive'}
              className={
                verificationStatus === 'valid' ? 'bg-green-100 text-green-800' :
                verificationStatus === 'invalid' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }
            >
              {verificationStatus === 'verifying' && <Clock className="w-3 h-3 mr-1" />}
              {verificationStatus === 'valid' && <CheckCircle className="w-3 h-3 mr-1" />}
              {verificationStatus === 'invalid' && <AlertCircle className="w-3 h-3 mr-1" />}
              {verificationStatus === 'verifying' ? '验证中' : 
               verificationStatus === 'valid' ? '有效' : 
               verificationStatus === 'invalid' ? '无效' : ''}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* QR码显示区域 */}
        <div className="text-center">
          {!qrData ? (
            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
              <QrCode className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-gray-600 mb-4">尚未生成QR码</p>
              <Button 
                onClick={handleGenerateQR} 
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    生成中...
                  </>
                ) : (
                  <>
                    <QrCode className="w-4 h-4 mr-2" />
                    生成QR码
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {showQRCode ? (
                <div className="flex justify-center">
                  <Image 
                    src={qrData.qrCodeUrl} 
                    alt="处方QR码"
                    width={size}
                    height={size}
                    className="border rounded-lg shadow-sm"
                  />
                </div>
              ) : (
                <div 
                  className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg"
                  style={{ width: size, height: size, margin: '0 auto' }}
                >
                  <div className="text-center text-gray-500">
                    <EyeOff className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm">QR码已隐藏</p>
                  </div>
                </div>
              )}
              
              {/* 处方基本信息 */}
              <div className="bg-gray-50 p-3 rounded-lg text-left text-sm">
                <p><span className="font-medium">处方编号:</span> {prescription.prescriptionId || prescription.id}</p>
                <p><span className="font-medium">处方类型:</span> 隐私保护处方</p>
                <p><span className="font-medium">药品数量:</span> {prescription.medicines.length}种</p>
                <p><span className="font-medium">总金额:</span> ¥{(prescription.totalPrice || 0).toFixed(2)}</p>
              </div>
            </div>
          )}
        </div>

        {/* 错误提示 */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* 控制按钮 */}
        {showControls && qrData && (
          <div className="space-y-3">
            {/* 主要操作 */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowQRCode(!showQRCode)}
                className="flex items-center gap-2"
              >
                {showQRCode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showQRCode ? '隐藏' : '显示'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleVerifyQR}
                disabled={verificationStatus === 'verifying'}
                className="flex items-center gap-2"
              >
                {verificationStatus === 'verifying' ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle className="w-4 h-4" />
                )}
                验证
              </Button>
            </div>

            {/* 次要操作 */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadQR}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                下载
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrintQR}
                className="flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                打印
              </Button>
            </div>

            {/* 分享和复制 */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleShareQR}
                className="flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                分享
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyQRData}
                className="flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                复制
              </Button>
            </div>

            {/* 重新生成 */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleGenerateQR}
              disabled={loading}
              className="w-full flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              重新生成
            </Button>
          </div>
        )}

        {/* QR码信息说明 */}
        {qrData && (
          <div className="text-xs text-gray-500 text-center">
            <p>此QR码包含完整的处方信息，药房可扫码获取处方详情</p>
            <p>QR码生成时间: {new Date().toLocaleString('zh-CN')}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 