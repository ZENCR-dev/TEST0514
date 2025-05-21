import React, { useState } from 'react';
import { withAuth } from '@/components/auth/withAuth';
import { PharmacyLayout } from '@/layouts/PharmacyLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, FileText, Filter } from 'lucide-react';

function PrescriptionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // 模拟处方数据
  const mockPrescriptions = [
    { id: 'RX-12345', patientName: '张三', doctor: '李医生', date: '2023-05-10', status: '待处理' },
    { id: 'RX-12346', patientName: '李四', doctor: '王医生', date: '2023-05-11', status: '已完成' },
    { id: 'RX-12347', patientName: '王五', doctor: '张医生', date: '2023-05-12', status: '处理中' }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    
    // 模拟搜索延迟
    setTimeout(() => {
      setIsSearching(false);
    }, 800);
  };

  return (
    <PharmacyLayout title="处方查询 - 药房管理">
      <div>
        <h1 className="text-2xl font-bold mb-6">处方查询</h1>
        
        <div className="mb-6">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="搜索处方ID、患者姓名或医生姓名"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={isSearching}>
              <Search className="h-4 w-4 mr-2" />
              {isSearching ? '搜索中...' : '搜索'}
            </Button>
            <Button type="button" variant="outline" title="筛选">
              <Filter className="h-4 w-4" />
            </Button>
          </form>
        </div>
        
        <div className="border rounded-md overflow-hidden">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">处方ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">患者姓名</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">医生</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">日期</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">状态</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-border">
              {mockPrescriptions.map((prescription) => (
                <tr key={prescription.id} className="hover:bg-muted/50">
                  <td className="px-4 py-3 text-sm font-medium">{prescription.id}</td>
                  <td className="px-4 py-3 text-sm">{prescription.patientName}</td>
                  <td className="px-4 py-3 text-sm">{prescription.doctor}</td>
                  <td className="px-4 py-3 text-sm">{prescription.date}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                      prescription.status === '待处理' ? 'bg-yellow-100 text-yellow-800' :
                      prescription.status === '处理中' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {prescription.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-right">
                    <Button variant="ghost" size="sm">
                      <FileText className="h-4 w-4 mr-1" />
                      查看
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 text-center text-sm text-muted-foreground">
          显示 1-3 条，共 3 条记录
        </div>
      </div>
    </PharmacyLayout>
  );
}

export default withAuth(PrescriptionsPage, { allowedRoles: ['pharmacy'] }); 