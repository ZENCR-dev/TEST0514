/**
 * 中药批量导入对话框组件
 */
import React, { useState } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { importMedicines } from '@/services/medicineService';

interface MedicineImportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: () => void;
}

export function MedicineImportDialog({
  isOpen,
  onClose,
  onImportSuccess
}: MedicineImportDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [importResult, setImportResult] = useState<{
    success: number;
    failed: number;
    errors: { index: number; message: string }[];
  } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    setErrorMessage(null);
  };

  // 解析CSV格式文件
  const parseCSV = (content: string) => {
    // 简单的CSV解析，分割行和列
    const lines = content.split(/\r?\n/).filter(line => line.trim() !== '');
    const headers = lines[0].split(',').map(header => header.trim());
    
    // 创建字段名映射
    const fieldMap: Record<string, string> = {
      '中文名': 'chineseName',
      '英文名': 'englishName',
      '拼音名': 'pinyinName',
      '价格': 'pricePerGram',
      '库存': 'stock',
      '药性': 'property',
      '分类': 'category',
      '状态': 'isActive',
      '描述': 'description'
    };
    
    // 映射表头到字段名
    const mappedHeaders = headers.map(header => fieldMap[header] || header);
    
    return lines.slice(1).map(line => {
      const values = line.split(',').map(val => val.trim());
      const medicine: any = {};
      
      mappedHeaders.forEach((header, index) => {
        if (values[index] !== undefined) {
          // 处理数值和布尔值
          if (header === 'pricePerGram' || header === 'stock') {
            medicine[header] = parseFloat(values[index]);
          } else if (header === 'isActive') {
            medicine[header] = values[index].toLowerCase() === 'true' || values[index] === '1';
          } else {
            medicine[header] = values[index];
          }
        }
      });
      
      return medicine;
    });
  };
  
  // 解析MD格式文件
  const parseMD = (content: string) => {
    // 查找表格部分
    const tableRegex = /\|.*\|/g;
    const tableLines = content.match(tableRegex);
    
    if (!tableLines || tableLines.length < 2) {
      throw new Error('无法识别Markdown表格格式');
    }
    
    // 获取表头（第一行）
    const headerLine = tableLines[0];
    const headers = headerLine.split('|')
      .filter(cell => cell.trim() !== '')
      .map(cell => cell.trim());
    
    // 创建字段名映射
    const fieldMap: Record<string, string> = {
      '中文名': 'chineseName',
      '英文名': 'englishName',
      '拼音名': 'pinyinName',
      '价格': 'pricePerGram',
      '库存': 'stock',
      '药性': 'property',
      '分类': 'category',
      '状态': 'isActive',
      '描述': 'description'
    };
    
    // 映射表头到字段名
    const mappedHeaders = headers.map(header => fieldMap[header] || header);
    
    // 跳过表头和分隔行，处理数据行
    return tableLines.slice(2).map(line => {
      const cells = line.split('|')
        .filter(cell => cell.trim() !== '')
        .map(cell => cell.trim());
      
      const medicine: any = {};
      
      mappedHeaders.forEach((header, index) => {
        if (cells[index] !== undefined) {
          // 处理数值和布尔值
          if (header === 'pricePerGram' || header === 'stock') {
            medicine[header] = parseFloat(cells[index]);
          } else if (header === 'isActive') {
            medicine[header] = cells[index].toLowerCase() === 'true' || cells[index] === '1';
          } else {
            medicine[header] = cells[index];
          }
        }
      });
      
      return medicine;
    });
  };

  const handleImport = async () => {
    if (!file) {
      setErrorMessage('请先选择文件');
      return;
    }

    // 检查文件类型
    const fileType = file.type;
    const fileName = file.name.toLowerCase();
    
    // 检查文件格式是否支持
    const isJSON = fileType === 'application/json' || fileName.endsWith('.json');
    const isCSV = fileType === 'text/csv' || fileName.endsWith('.csv');
    const isMD = fileType === 'text/markdown' || fileName.endsWith('.md') || fileName.endsWith('.markdown');
    
    if (!isJSON && !isCSV && !isMD) {
      setErrorMessage('只支持JSON、CSV和MD格式的文件');
      return;
    }

    setIsUploading(true);
    setErrorMessage(null);

    try {
      // 读取文件内容
      const fileReader = new FileReader();
      fileReader.onload = async (event) => {
        try {
          const content = event.target?.result as string;
          let medicines;
          
          // 根据文件类型解析内容
          if (isJSON) {
            medicines = JSON.parse(content);
            if (!Array.isArray(medicines)) {
              throw new Error('JSON文件格式不正确，应为中药数组');
            }
          } else if (isCSV) {
            medicines = parseCSV(content);
          } else if (isMD) {
            medicines = parseMD(content);
          } else {
            throw new Error('不支持的文件格式');
          }

          // 调用导入API
          const result = await importMedicines(medicines);
          setImportResult(result);

          if (result.success > 0) {
            // 如果有成功导入的中药，调用成功回调
            onImportSuccess();
          }
        } catch (err: any) {
          setErrorMessage(`解析文件失败: ${err.message}`);
        } finally {
          setIsUploading(false);
        }
      };

      fileReader.onerror = () => {
        setErrorMessage('读取文件失败');
        setIsUploading(false);
      };

      fileReader.readAsText(file);
    } catch (err: any) {
      setErrorMessage(`导入失败: ${err.message}`);
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    // 重置状态
    setFile(null);
    setErrorMessage(null);
    setImportResult(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>批量导入中药</DialogTitle>
          <DialogDescription>
            上传JSON、CSV或MD格式的中药数据文件进行批量导入
          </DialogDescription>
        </DialogHeader>

        {!importResult ? (
          <>
            {errorMessage && (
              <Alert variant="destructive" className="my-4">
                <p>{errorMessage}</p>
              </Alert>
            )}

            <div className="space-y-4 py-4">
              <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                <input
                  type="file"
                  accept=".json,.csv,.md,.markdown"
                  onChange={handleFileChange}
                  className="hidden"
                  id="medicine-import-file"
                  disabled={isUploading}
                />
                <label
                  htmlFor="medicine-import-file"
                  className="cursor-pointer text-blue-600 hover:text-blue-500"
                >
                  {file ? (
                    <span>{file.name}</span>
                  ) : (
                    <span>选择文件</span>
                  )}
                </label>
                <p className="mt-2 text-sm text-gray-500">
                  支持JSON、CSV和MD格式，文件大小不超过10MB
                </p>
              </div>

              <div className="bg-gray-50 rounded-md p-4">
                <h3 className="text-sm font-medium text-gray-900">文件格式说明</h3>
                <ul className="mt-2 text-sm text-gray-500 list-disc pl-5 space-y-1">
                  <li>JSON格式：中药对象数组</li>
                  <li>CSV格式：首行为表头，使用逗号分隔</li>
                  <li>MD格式：Markdown表格，包含表头行</li>
                  <li>每个中药必须包含：中文名、英文名、拼音名</li>
                  <li>价格和库存为必填的数字字段</li>
                  <li>所有名称不能与系统中已有的重复</li>
                </ul>
                
                <div className="mt-3">
                  <h4 className="text-xs font-medium text-gray-800 mb-1">JSON格式示例：</h4>
                  <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                    {`[
  {
    "chineseName": "示例中药1",
    "englishName": "Example Medicine 1",
    "pinyinName": "shiliyaocai1",
    "pricePerGram": 5.0,
    "stock": 1000
  }
]`}
                  </pre>
                </div>
                
                <div className="mt-2">
                  <h4 className="text-xs font-medium text-gray-800 mb-1">CSV格式示例：</h4>
                  <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                    {`中文名,英文名,拼音名,价格,库存,药性,分类
示例中药1,Example Medicine 1,shiliyaocai1,5.0,1000,温,补气`}
                  </pre>
                </div>
                
                <div className="mt-2">
                  <h4 className="text-xs font-medium text-gray-800 mb-1">MD格式示例：</h4>
                  <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                    {`| 中文名 | 英文名 | 拼音名 | 价格 | 库存 | 药性 | 分类 |
| ------ | ------ | ------ | ---- | ---- | ---- | ---- |
| 示例中药1 | Example Medicine 1 | shiliyaocai1 | 5.0 | 1000 | 温 | 补气 |`}
                  </pre>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={isUploading}
              >
                取消
              </Button>
              <Button
                onClick={handleImport}
                disabled={!file || isUploading}
              >
                {isUploading ? '导入中...' : '开始导入'}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <div className="py-4">
              <div className="flex justify-center items-center mb-4">
                {importResult.success > 0 ? (
                  <div className="bg-green-100 text-green-800 p-3 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                ) : (
                  <div className="bg-red-100 text-red-800 p-3 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                )}
              </div>

              <h3 className="text-lg font-medium text-center mb-4">
                导入结果
              </h3>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-green-50 rounded-md p-4 text-center">
                  <p className="text-sm text-gray-500">成功导入</p>
                  <p className="text-2xl font-bold text-green-600">
                    {importResult.success}
                  </p>
                </div>
                <div className="bg-red-50 rounded-md p-4 text-center">
                  <p className="text-sm text-gray-500">导入失败</p>
                  <p className="text-2xl font-bold text-red-600">
                    {importResult.failed}
                  </p>
                </div>
              </div>

              {importResult.errors.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">错误详情：</h4>
                  <div className="max-h-40 overflow-y-auto bg-gray-50 rounded-md p-2">
                    {importResult.errors.map((error, index) => (
                      <div key={index} className="text-sm text-red-600 mb-1">
                        第 {error.index + 1} 项: {error.message}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button onClick={handleClose}>
                关闭
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
} 