import React from 'react';
import { InvoiceData } from '@/types/invoice';

interface InvoiceContentProps {
  invoice: InvoiceData;
}

export function InvoiceContent({ invoice }: InvoiceContentProps) {
  return (
    <div className="bg-white p-6 border rounded">
      <div className="flex justify-between items-start mb-6">
        <div className="text-left">
          <h1 className="text-2xl font-bold">报价单</h1>
          <p className="text-gray-600 text-sm">Invoice</p>
        </div>

        <div className="text-right text-sm">
          <p><span className="font-medium">报价单编号:</span> {invoice.id}</p>
          <p><span className="font-medium">生成日期:</span> {invoice.date}</p>
          {invoice.prescriptionId && <p><span className="font-medium">关联处方ID:</span> {invoice.prescriptionId}</p>}
          <p><span className="font-medium">药房名称:</span> {invoice.pharmacyName}</p>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">药材详情</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">药品名称</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">数量 (克)</th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">零售价/克</th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">成本价/克 (60%)</th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">批发价/克 (75%)</th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">小计 (成本价)</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {invoice.items.map((item, index) => (
              <tr key={index}>
                <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 text-right">{item.retailPricePerGram.toFixed(2)}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 text-right">{item.costPricePerGram.toFixed(2)}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 text-right">{item.wholesalePricePerGram.toFixed(2)}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 text-right">{item.subtotalCost.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end">
        <div className="w-1/3">
          <div className="text-sm font-medium text-gray-700 mb-2">
            <p className="flex justify-between"><span>药材总成本:</span><span>{invoice.items.reduce((sum, item) => sum + item.subtotalCost, 0).toFixed(2)}</span></p>
            <p className="flex justify-between"><span>处方费:</span><span>{invoice.prescriptionFee.toFixed(2)}</span></p>
          </div>
          <div className="border-t border-gray-300 pt-2 text-lg font-bold text-right">
            <p className="flex justify-between"><span>总计成本:</span><span>{invoice.totalCost.toFixed(2)}</span></p>
          </div>
        </div>
      </div>

      {/* 可以添加其他部分，例如备注、签名等 */}
    </div>
  );
} 