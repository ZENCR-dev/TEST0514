/**
 * 中药价格批量调整对话框组件
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert } from '@/components/ui/alert';
import { Medicine } from '@/types/medicine';
import { bulkUpdatePrices } from '@/services/medicineService';
import { formatCurrency } from '@/utils/helpers';

interface MedicinePriceAdjustDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMedicines: Medicine[];
  onAdjustSuccess: () => void;
}

export function MedicinePriceAdjustDialog({
  isOpen,
  onClose,
  selectedMedicines,
  onAdjustSuccess
}: MedicinePriceAdjustDialogProps) {
  const [percentageChange, setPercentageChange] = useState<number>(0);
  const [isAdjusting, setIsAdjusting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [adjustResult, setAdjustResult] = useState<{
    success: number;
    failed: number;
    errors: { id: string; message: string }[];
  } | null>(null);

  // 计算调整后的价格示例
  const getAdjustedPrice = (price: number) => {
    return price * (1 + percentageChange / 100);
  };

  const handlePercentageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setPercentageChange(isNaN(value) ? 0 : value);
  };

  const handleAdjustPrices = async () => {
    if (selectedMedicines.length === 0) return;
    
    setIsAdjusting(true);
    setError(null);

    try {
      const result = await bulkUpdatePrices(
        selectedMedicines.map(med => med.id),
        percentageChange
      );
      
      setAdjustResult(result);
      
      if (result.success > 0) {
        onAdjustSuccess();
      }
    } catch (err: any) {
      setError(`价格调整失败: ${err.message}`);
    } finally {
      setIsAdjusting(false);
    }
  };

  const handleClose = () => {
    // 重置状态
    setPercentageChange(0);
    setError(null);
    setAdjustResult(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>批量调整价格</DialogTitle>
          <DialogDescription>
            批量调整选中的 {selectedMedicines.length} 种中药价格
          </DialogDescription>
        </DialogHeader>

        {!adjustResult ? (
          <>
            {error && (
              <Alert variant="destructive" className="my-4">
                <p>{error}</p>
              </Alert>
            )}

            <div className="py-4 space-y-4">
              <div>
                <Label htmlFor="percentageChange">
                  价格调整百分比 (%)
                </Label>
                <div className="flex items-center mt-1">
                  <Input
                    id="percentageChange"
                    type="number"
                    step="0.1"
                    value={percentageChange.toString()}
                    onChange={handlePercentageChange}
                    className="flex-1"
                  />
                  <span className="ml-2">%</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  正数表示上调价格，负数表示下调价格
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-sm font-medium mb-2">价格调整预览</h3>
                <div className="max-h-40 overflow-y-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          中药名称
                        </th>
                        <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          当前价格
                        </th>
                        <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          调整后价格
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedMedicines.map(medicine => (
                        <tr key={medicine.id}>
                          <td className="px-3 py-2 whitespace-nowrap text-sm">
                            {medicine.chineseName}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-right">
                            {formatCurrency(medicine.basePrice)}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-right">
                            {formatCurrency(getAdjustedPrice(medicine.basePrice))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <p className="text-sm text-gray-500">
                注意：价格调整将立即生效，并可能影响当前的处方价格计算。请确认调整是否合理。
              </p>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={isAdjusting}
              >
                取消
              </Button>
              <Button
                onClick={handleAdjustPrices}
                disabled={isAdjusting || selectedMedicines.length === 0}
              >
                {isAdjusting ? '调整中...' : '确认调整'}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <div className="py-4">
              <div className="flex justify-center items-center mb-4">
                {adjustResult.success > 0 ? (
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
                价格调整结果
              </h3>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-green-50 rounded-md p-4 text-center">
                  <p className="text-sm text-gray-500">调整成功</p>
                  <p className="text-2xl font-bold text-green-600">
                    {adjustResult.success}
                  </p>
                </div>
                <div className="bg-red-50 rounded-md p-4 text-center">
                  <p className="text-sm text-gray-500">调整失败</p>
                  <p className="text-2xl font-bold text-red-600">
                    {adjustResult.failed}
                  </p>
                </div>
              </div>

              {adjustResult.errors.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">错误详情：</h4>
                  <div className="max-h-40 overflow-y-auto bg-gray-50 rounded-md p-2">
                    {adjustResult.errors.map((error, index) => (
                      <div key={index} className="text-sm text-red-600 mb-1">
                        ID: {error.id}: {error.message}
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