import React, { useState } from 'react';
import { withAuth } from '@/components/auth/withAuth';
import { PharmacyLayout } from '@/layouts/PharmacyLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Scan, Search } from 'lucide-react';

function ScanPage() {
  const [prescriptionId, setPrescriptionId] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = () => {
    // 模拟扫描功能
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      alert('这是一个模拟功能，实际开发中将使用设备摄像头扫描二维码。');
    }, 1500);
  };

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prescriptionId.trim()) return;
    
    // 模拟处方查询
    alert(`将查询处方ID: ${prescriptionId}\n这是一个模拟功能，实际开发中将从后端获取处方信息。`);
  };

  return (
    <PharmacyLayout title="扫描处方 - 药房管理">
      <div>
        <h1 className="text-2xl font-bold mb-6">扫描处方</h1>
        
        <div className="space-y-8">
          <div className="bg-muted p-6 rounded-lg border border-dashed border-muted-foreground/50 text-center">
            <div className="mb-4">
              <Scan className="h-12 w-12 mx-auto text-muted-foreground" />
            </div>
            <h2 className="text-lg font-medium mb-2">扫描处方二维码</h2>
            <p className="text-sm text-muted-foreground mb-4">
              使用设备摄像头扫描处方单上的二维码，快速查看处方详情
            </p>
            <Button 
              onClick={handleScan} 
              disabled={isScanning}
              className="w-full sm:w-auto"
            >
              {isScanning ? '扫描中...' : '开始扫描'}
            </Button>
          </div>
          
          <div>
            <h2 className="text-lg font-medium mb-4">手动输入处方ID</h2>
            <form onSubmit={handleManualSearch} className="flex gap-2">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="输入处方ID，例如: RX-12345"
                  value={prescriptionId}
                  onChange={(e) => setPrescriptionId(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={!prescriptionId.trim()}>
                <Search className="h-4 w-4 mr-2" />
                查询
              </Button>
            </form>
          </div>
        </div>
      </div>
    </PharmacyLayout>
  );
}

export default withAuth(ScanPage, { allowedRoles: ['pharmacy'] }); 