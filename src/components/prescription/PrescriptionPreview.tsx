import React, { useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { PrescriptionItem } from '@/store/prescriptionStore';
import TestVersionBanner from "@/components/common/TestVersionBanner";

interface PrescriptionPreviewProps {
  items: PrescriptionItem[];
  copies: number;
  instructions: string;
  onClose: () => void;
  onComplete?: () => void;
  language?: "cn" | "en";
}

export const PrescriptionPreview: React.FC<PrescriptionPreviewProps> = ({
  items,
  copies,
  instructions,
  onClose,
  onComplete,
  language = "cn",
}) => {
  const prescriptionRef = useRef<HTMLDivElement>(null);
  const [prescriptionId] = useState(`RX${Date.now().toString().substr(-8)}`);
  const currentDate = new Date();
  const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
  
  // 计算处方有效期（默认30天）
  const expiryDate = new Date(currentDate);
  expiryDate.setDate(expiryDate.getDate() + 30);
  const formattedExpiryDate = `${expiryDate.getDate()}/${expiryDate.getMonth() + 1}/${expiryDate.getFullYear()}`;
  
  // 生成处方数据的JSON字符串
  const prescriptionData = JSON.stringify({
    items: items.map(item => ({
      id: item.medicine.id,
      name: item.medicine.chineseName,
      quantity: item.quantity
      // 规范: 如果二维码内容未来需要包含价格信息(如item.medicine.pricePerGram)，
      // 也应考虑其模拟性质，以及是否需要在解析端特殊处理或提示。
    })),
    copies,
    instructions
  });
  
  // 下载PDF
  const handleDownloadPDF = async () => {
    if (!prescriptionRef.current) return;
    
    const canvas = await html2canvas(prescriptionRef.current, {
      scale: 2,
      useCORS: true,
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a5'
    });
    
    const imgWidth = 148; // A5 width in mm
    const imgHeight = canvas.height * imgWidth / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    
    // 使用处方编号+日期作为文件名
    const fileName = `${prescriptionId}_${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}.pdf`;
    pdf.save(fileName);
  };
  
  // 打印处方单
  const handlePrint = async () => {
    if (!prescriptionRef.current) return;
    
    const canvas = await html2canvas(prescriptionRef.current, {
      scale: 2,
      useCORS: true,
    });
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    const imgData = canvas.toDataURL('image/png');
    
    printWindow.document.write(`
      <html>
        <head>
          <title>处方单打印</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 20px;
              display: flex;
              justify-content: center;
            }
            .print-container {
              width: 100%;
              max-width: 595px; /* A4宽度 */
            }
            img {
              width: 100%;
              height: auto;
            }
            @media print {
              @page {
                size: auto;
                margin: 0;
              }
              body {
                padding: 0;
                margin: 0.5cm;
              }
              .print-container {
                width: 100%;
                max-width: none;
              }
              .no-print {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            <div class="no-print" style="text-align: center; margin-bottom: 20px;">
              <button onclick="window.print()" style="padding: 8px 16px; background: #4a90e2; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 10px;">
                打印
              </button>
              <button onclick="window.close()" style="padding: 8px 16px; background: #e2e8f0; color: #1a202c; border: none; border-radius: 4px; cursor: pointer;">
                关闭
              </button>
            </div>
            <img src="${imgData}" alt="处方单" />
          </div>
          <script>
            window.onload = function() {
              // 自动打印会在某些浏览器中被阻止，改为手动点击打印按钮
            }
          </script>
        </body>
      </html>
    `);
    
    printWindow.document.close();
  };
  
  // 将药品列表分成三部分的辅助函数
  const groupItems = (items: PrescriptionItem[], groupCount: number) => {
    const result: PrescriptionItem[][] = [];
    const itemsPerGroup = Math.ceil(items.length / groupCount);
    
    for (let i = 0; i < groupCount; i++) {
      const start = i * itemsPerGroup;
      const end = Math.min(start + itemsPerGroup, items.length);
      if (start < items.length) {
        result.push(items.slice(start, end));
      } else {
        result.push([]);
      }
    }
    
    return result;
  };
  
  // 分成三组药品
  const itemGroups = groupItems(items, 3);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto flex flex-col">
        <div className="sticky top-0 bg-white p-4 border-b z-10">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">处方单预览</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="p-4 flex-grow overflow-y-auto">
          <div id="prescription-preview" ref={prescriptionRef} className="bg-white border rounded mb-4 p-6">
            <TestVersionBanner position="inline" language={language} className="mb-4" />

            <div className="flex justify-between items-start mb-4">
              <div className="text-left">
                <h1 className="text-xl font-bold">新西兰中医药处方单</h1>
                <p className="text-gray-500 text-sm">New Zealand TCM Prescription</p>
              </div>
              
              <div className="border rounded p-2 bg-white text-center">
                <QRCodeSVG value={prescriptionData} size={80} />
                <div className="text-xs mt-1">扫描获取处方</div>
              </div>
            </div>
            
            <div className="mb-4 border-t border-gray-200 pt-2">
              <div className="grid grid-cols-2 gap-x-4">
                <div className="mb-2">
                  <span className="font-medium">开方日期:</span>
                  <span className="ml-2">{formattedDate}</span>
                </div>
                <div className="mb-2">
                  <span className="font-medium">处方编号:</span>
                  <span className="ml-2">{prescriptionId}</span>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-2 mt-2 mb-3">
                <div className="grid grid-cols-3 gap-x-4">
                  <div className="mb-2">
                    <span className="font-medium">患者姓名:</span>
                    <span className="ml-2 border-b border-gray-400 inline-block min-w-[80px]">&nbsp;</span>
                  </div>
                  <div className="mb-2">
                    <span className="font-medium">性别:</span>
                    <span className="ml-2 border-b border-gray-400 inline-block min-w-[50px]">&nbsp;</span>
                  </div>
                  <div className="mb-2">
                    <span className="font-medium">年龄:</span>
                    <span className="ml-2 border-b border-gray-400 inline-block min-w-[50px]">&nbsp;</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-4 border-t border-gray-200 pt-2">
              <div className="font-medium mb-2">处方药品</div>
              <div className="flex justify-between gap-3">
                {itemGroups.map((group, groupIndex) => (
                  <div key={groupIndex} className="flex-1 border-l pl-3 first:border-l-0 first:pl-0">
                    {group.map((item) => (
                      <div key={item.id} className="py-2 border-b border-gray-100">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">
                              {item.medicine.chineseName}
                              <span className="text-xs text-gray-500 ml-1">({item.medicine.pinyinName})</span>
                            </div>
                            <div className="text-xs text-gray-500">{item.medicine.englishName}</div>
                            {/* 
                              规范: 未来如果在此处显示药品单价 (item.medicine.pricePerGram) 
                              或基于数量计算的单个药品总价时，必须在其旁边添加模拟标注。
                              示例：
                              <div className="text-sm text-gray-500">
                                {language === 'cn' ? '单价:' : 'Price:'} 
                                ¥{item.medicine.pricePerGram.toFixed(2)}/g
                                <span className="ml-1 text-xs text-gray-400">
                                  {language === 'cn' ? '(模拟)' : '(Simulated)'}
                                </span>
                              </div>
                              <div className="text-sm text-gray-500">
                                {language === 'cn' ? '小计:' : 'Subtotal:'} 
                                ¥{(item.medicine.pricePerGram * item.quantity).toFixed(2)}
                                <span className="ml-1 text-xs text-gray-400">
                                  {language === 'cn' ? '(模拟)' : '(Simulated)'}
                                </span>
                              </div>
                            */}
                          </div>
                          <div className="text-lg font-medium">{item.quantity}g</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mb-4 border-t border-gray-200 pt-2">
              <div className="font-medium mb-2">用法/医嘱</div>
              <div className="p-2 bg-gray-50 rounded text-sm">
                {instructions}
              </div>
            </div>
            
            {/* 
              规范: 未来如果在此处底部区域（例如，在"用法/医嘱"之后，但在"处方帖数"之前或附近）
              显示处方药品小计、处方费、总计等价格信息时，
              必须在每个价格旁边添加相应的模拟标注，并考虑使用 {language} prop 进行本地化。
              示例：
              <div className="mt-4 border-t pt-2 text-right">
                <p className="text-sm">
                  {language === 'cn' ? '药品小计: ' : 'Medications Subtotal: '}
                  ¥{calculatedSubtotal.toFixed(2) // 假设 calculatedSubtotal 已计算得出}
                  <span className="ml-1 text-xs text-gray-400">
                    {language === 'cn' ? '(模拟)' : '(Simulated)'}
                  </span>
                </p>
                <p className="text-sm">
                  {language === 'cn' ? '处方费: ' : 'Prescription Fee: '}
                  ¥{prescriptionFee.toFixed(2) // 假设 prescriptionFee 已定义}
                  <span className="ml-1 text-xs text-gray-400">
                    {language === 'cn' ? '(模拟)' : '(Simulated)'}
                  </span>
                </p>
                <p className="text-base font-bold">
                  {language === 'cn' ? '总计: ' : 'Grand Total: '}
                  ¥{grandTotal.toFixed(2) // 假设 grandTotal 已计算得出}
                  <span className="ml-1 text-xs text-gray-400">
                    {language === 'cn' ? '(模拟)' : '(Simulated)'}
                  </span>
                </p>
              </div>
            */}

            <div className="border-t border-gray-200 pt-2">
              <div className="grid grid-cols-3 gap-x-4">
                <div className="mb-2">
                  <span className="font-medium">处方帖数:</span>
                  <span className="ml-2">{copies}</span>
                </div>
                <div className="mb-2">
                  <span className="font-medium">有效日期至:</span>
                  <span className="ml-2">{formattedExpiryDate}</span>
                </div>
                <div className="mb-2 text-right">
                  <span className="font-medium">医师签名:</span>
                  <span className="ml-2 border-b border-gray-400 inline-block min-w-[100px]">&nbsp;</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="sticky bottom-0 bg-white p-4 border-t z-10">
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={handlePrint}
            >
              打印
            </button>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={handleDownloadPDF}
            >
              保存PDF
            </button>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-yellow-500 rounded-md shadow-sm text-sm font-medium text-yellow-700 bg-yellow-50 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              onClick={onClose}
            >
              返回修改
            </button>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              onClick={onComplete}
            >
              完成
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 