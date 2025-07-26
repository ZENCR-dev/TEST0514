# 支付功能集成开发计划

## 📋 功能概述

支付功能是医师端的核心业务功能，包括账户余额管理、余额支付、Stripe充值等功能。需要确保支付流程的安全性、可靠性和用户体验。

## 🎯 功能需求分析

### 现有代码评估
- ✅ **已有基础**：
  - 基础认证和用户状态管理（useAuth）
  - API客户端配置（apiClient）
  - 处方服务中的支付相关接口
  - 基础UI组件（Button、Modal等）

- ⚠️ **待实现**：
  - 完整的医师账户服务（PractitionerAccountService）
  - 余额支付组件和流程
  - Stripe充值集成
  - 支付状态管理和错误处理
  - 支付成功/失败的UI反馈

## 🏗️ 架构设计

### 1. 服务层架构
```
services/
├── practitionerAccountService.ts    # 🆕 医师账户服务
├── paymentService.ts               # 🆕 支付服务
└── stripeService.ts                # 🆕 Stripe集成服务
```

### 2. 组件架构
```
components/
├── payment/
│   ├── AccountBalance.tsx          # 🆕 账户余额显示
│   ├── BalancePaymentModal.tsx     # 🆕 余额支付弹窗
│   ├── StripeRechargeModal.tsx     # 🆕 Stripe充值弹窗
│   ├── PaymentMethodSelector.tsx   # 🆕 支付方式选择
│   ├── PaymentProcessing.tsx       # 🆕 支付处理中状态
│   └── PaymentResult.tsx           # 🆕 支付结果展示
├── account/
│   ├── AccountDashboard.tsx        # 🆕 账户仪表板
│   ├── TransactionHistory.tsx      # 🆕 交易历史
│   └── AccountSettings.tsx         # 🆕 账户设置
```

### 3. 状态管理
```typescript
// stores/paymentStore.ts
interface PaymentStore {
  // 账户信息
  balance: number;
  availableCredit: number;
  creditLimit: number;
  
  // 支付状态
  isProcessing: boolean;
  currentPayment: PaymentTransaction | null;
  
  // 交易历史
  transactions: Transaction[];
  
  // Actions
  refreshBalance: () => Promise<void>;
  initiatePayment: (prescriptionId: string, method: PaymentMethod) => Promise<void>;
  cancelPayment: () => void;
}
```

## 📦 核心服务实现

### 1. 医师账户服务
```typescript
// services/practitionerAccountService.ts
import { apiClient } from '@/lib/apiClient';
import { ApiResponse } from '@/types/api';

export interface AccountBalance {
  balance: number;
  availableCredit: number;
  creditLimit: number;
  usedCredit: number;
  currency: string;
  lastUpdated: string;
}

export interface Transaction {
  id: string;
  transactionType: 'DEBIT' | 'CREDIT' | 'REFUND';
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  description: string;
  referenceId?: string;
  referenceType?: string;
  createdAt: string;
  status: 'pending' | 'completed' | 'failed';
}

export interface RechargeIntent {
  paymentIntentId: string;
  clientSecret: string;
  amount: number;
  currency: string;
  expiresAt: string;
}

export class PractitionerAccountService {
  // 获取账户余额
  static async getBalance(): Promise<AccountBalance> {
    const response = await apiClient.get<ApiResponse<AccountBalance>>(
      '/practitioner-accounts/balance'
    );
    
    if (!response.data.success) {
      throw new Error(response.data.error?.message || '获取余额失败');
    }
    
    return response.data.data!;
  }

  // 获取交易历史
  static async getTransactionHistory(params: {
    limit?: number;
    offset?: number;
    startDate?: string;
    endDate?: string;
    type?: string;
  } = {}): Promise<{
    transactions: Transaction[];
    total: number;
    hasMore: boolean;
  }> {
    const response = await apiClient.get<ApiResponse<Transaction[]>>(
      '/practitioner-accounts/transactions',
      { params }
    );
    
    return {
      transactions: response.data.data || [],
      total: response.data.meta?.total || 0,
      hasMore: response.data.meta?.hasMore || false
    };
  }

  // 创建充值意图
  static async createRechargeIntent(amount: number, currency: string = 'NZD'): Promise<RechargeIntent> {
    const response = await apiClient.post<ApiResponse<RechargeIntent>>(
      '/practitioner-accounts/recharge',
      { amount, currency }
    );
    
    if (!response.data.success) {
      throw new Error(response.data.error?.message || '创建充值失败');
    }
    
    return response.data.data!;
  }

  // 获取账户详情
  static async getAccountInfo(): Promise<{
    id: string;
    practitionerId: string;
    balance: number;
    creditLimit: number;
    status: string;
    createdAt: string;
  }> {
    const response = await apiClient.get<ApiResponse<any>>(
      '/practitioner-accounts/info'
    );
    
    return response.data.data;
  }

  // 刷新余额（用于支付后更新）
  static async refreshBalance(): Promise<AccountBalance> {
    // 添加短暂延迟以确保后端事务完成
    await new Promise(resolve => setTimeout(resolve, 500));
    return this.getBalance();
  }
}
```

### 2. 支付服务
```typescript
// services/paymentService.ts
import { apiClient } from '@/lib/apiClient';
import { PractitionerAccountService } from './practitionerAccountService';
import { wsService } from './websocketService';

export type PaymentMethod = 'balance' | 'stripe';
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';

export interface PaymentRequest {
  prescriptionId: string;
  amount: number;
  method: PaymentMethod;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  status: PaymentStatus;
  message?: string;
  updatedBalance?: number;
}

export class PaymentService {
  // 发起余额支付
  static async payWithBalance(prescriptionId: string): Promise<PaymentResult> {
    try {
      // 先检查余额
      const balance = await PractitionerAccountService.getBalance();
      
      // 获取处方信息以确定金额
      const prescriptionResponse = await apiClient.get(`/prescriptions/${prescriptionId}`);
      const prescription = prescriptionResponse.data.data;
      
      if (balance.balance < prescription.totalAmount) {
        throw new Error('余额不足');
      }
      
      // 发起支付
      const response = await apiClient.post<ApiResponse<any>>(
        `/prescriptions/${prescriptionId}/pay-with-balance`
      );
      
      if (!response.data.success) {
        throw new Error(response.data.error?.message || '支付失败');
      }
      
      // 刷新余额
      const updatedBalance = await PractitionerAccountService.refreshBalance();
      
      return {
        success: true,
        transactionId: response.data.data.transactionId,
        status: 'completed',
        updatedBalance: updatedBalance.balance
      };
    } catch (error) {
      console.error('余额支付失败:', error);
      return {
        success: false,
        status: 'failed',
        message: error.message || '支付失败，请重试'
      };
    }
  }

  // 发起Stripe支付
  static async payWithStripe(prescriptionId: string): Promise<{
    clientSecret: string;
    paymentIntentId: string;
  }> {
    const response = await apiClient.post<ApiResponse<any>>(
      `/prescriptions/${prescriptionId}/pay-with-stripe`
    );
    
    if (!response.data.success) {
      throw new Error(response.data.error?.message || '创建支付失败');
    }
    
    return {
      clientSecret: response.data.data.clientSecret,
      paymentIntentId: response.data.data.paymentIntentId
    };
  }

  // 确认Stripe支付
  static async confirmStripePayment(
    paymentIntentId: string,
    prescriptionId: string
  ): Promise<PaymentResult> {
    try {
      const response = await apiClient.post<ApiResponse<any>>(
        `/payments/stripe/confirm`,
        { paymentIntentId, prescriptionId }
      );
      
      if (!response.data.success) {
        throw new Error(response.data.error?.message || '确认支付失败');
      }
      
      return {
        success: true,
        transactionId: response.data.data.transactionId,
        status: 'completed'
      };
    } catch (error) {
      return {
        success: false,
        status: 'failed',
        message: error.message || '支付确认失败'
      };
    }
  }

  // 获取支付状态
  static async getPaymentStatus(prescriptionId: string): Promise<{
    status: PaymentStatus;
    transactionId?: string;
    paidAt?: string;
  }> {
    const response = await apiClient.get<ApiResponse<any>>(
      `/prescriptions/${prescriptionId}/payment-status`
    );
    
    return response.data.data;
  }

  // 订阅支付状态更新
  static subscribeToPaymentUpdates(
    prescriptionId: string,
    onUpdate: (status: PaymentStatus) => void
  ): () => void {
    return wsService.subscribe(
      `prescription.${prescriptionId}.payment.updated`,
      (data) => onUpdate(data.status)
    );
  }
}
```

## 💳 核心组件实现

### 1. 账户余额组件
```typescript
// components/payment/AccountBalance.tsx
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet, TrendingUp, CreditCard } from 'lucide-react';
import { useAccountBalance } from '@/hooks/useAccountBalance';
import { formatCurrency } from '@/utils/formatters';

interface AccountBalanceProps {
  onRecharge?: () => void;
  compact?: boolean;
}

export const AccountBalance: React.FC<AccountBalanceProps> = ({ 
  onRecharge,
  compact = false 
}) => {
  const { balance, loading, error, refresh } = useAccountBalance();

  if (loading) {
    return <AccountBalanceSkeleton compact={compact} />;
  }

  if (error) {
    return (
      <Card className="p-4">
        <div className="text-center text-red-600">
          <p>加载余额失败</p>
          <Button variant="link" onClick={refresh} className="mt-2">
            重试
          </Button>
        </div>
      </Card>
    );
  }

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <Wallet className="h-4 w-4 text-gray-600" />
        <span className="text-sm">余额:</span>
        <span className="font-semibold text-green-600">
          {formatCurrency(balance?.balance || 0)}
        </span>
        {balance?.availableCredit > 0 && (
          <span className="text-xs text-gray-500">
            (可用额度: {formatCurrency(balance.availableCredit)})
          </span>
        )}
      </div>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          账户余额
        </h3>
        {onRecharge && (
          <Button variant="outline" size="sm" onClick={onRecharge}>
            <CreditCard className="h-4 w-4 mr-1" />
            充值
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600">当前余额</p>
          <p className="text-2xl font-bold text-green-600">
            {formatCurrency(balance?.balance || 0)}
          </p>
        </div>

        {balance?.creditLimit > 0 && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">信用额度</p>
                <p className="text-lg font-semibold">
                  {formatCurrency(balance.creditLimit)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">可用额度</p>
                <p className="text-lg font-semibold text-blue-600">
                  {formatCurrency(balance.availableCredit)}
                </p>
              </div>
            </div>

            <div className="pt-2">
              <div className="flex justify-between text-sm mb-1">
                <span>额度使用</span>
                <span>{Math.round((balance.usedCredit / balance.creditLimit) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${(balance.usedCredit / balance.creditLimit) * 100}%` }}
                />
              </div>
            </div>
          </>
        )}

        <div className="pt-2 border-t">
          <p className="text-xs text-gray-500">
            最后更新: {new Date(balance?.lastUpdated || Date.now()).toLocaleString()}
          </p>
        </div>
      </div>
    </Card>
  );
};

// 骨架屏组件
const AccountBalanceSkeleton: React.FC<{ compact?: boolean }> = ({ compact }) => {
  if (compact) {
    return <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />;
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
        <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
        <div className="space-y-2">
          <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </Card>
  );
};
```

### 2. 余额支付弹窗
```typescript
// components/payment/BalancePaymentModal.tsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { PaymentService } from '@/services/paymentService';
import { useAccountBalance } from '@/hooks/useAccountBalance';
import { formatCurrency } from '@/utils/formatters';
import { toast } from 'react-hot-toast';

interface BalancePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  prescriptionId: string;
  amount: number;
  onSuccess?: () => void;
}

export const BalancePaymentModal: React.FC<BalancePaymentModalProps> = ({
  isOpen,
  onClose,
  prescriptionId,
  amount,
  onSuccess
}) => {
  const { balance, refresh: refreshBalance } = useAccountBalance();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const insufficientBalance = balance && balance.balance < amount;
  const availableTotal = balance ? balance.balance + balance.availableCredit : 0;
  const canPayWithCredit = !insufficientBalance || availableTotal >= amount;

  const handlePayment = async () => {
    if (!canPayWithCredit) {
      toast.error('余额和信用额度不足');
      return;
    }

    setIsProcessing(true);
    setPaymentStatus('processing');
    setErrorMessage('');

    try {
      const result = await PaymentService.payWithBalance(prescriptionId);
      
      if (result.success) {
        setPaymentStatus('success');
        await refreshBalance();
        toast.success('支付成功');
        
        setTimeout(() => {
          onSuccess?.();
          onClose();
        }, 1500);
      } else {
        setPaymentStatus('failed');
        setErrorMessage(result.message || '支付失败，请重试');
        toast.error(result.message || '支付失败');
      }
    } catch (error) {
      setPaymentStatus('failed');
      setErrorMessage('支付失败，请稍后重试');
      toast.error('支付失败，请稍后重试');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    if (!isProcessing) {
      setPaymentStatus('idle');
      setErrorMessage('');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>余额支付</DialogTitle>
          <DialogDescription>
            请确认使用账户余额支付此处方
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* 支付金额 */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">支付金额</span>
              <span className="text-2xl font-bold">{formatCurrency(amount)}</span>
            </div>
          </div>

          {/* 账户余额信息 */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">账户余额</span>
              <span className={insufficientBalance ? 'text-red-600' : ''}>
                {formatCurrency(balance?.balance || 0)}
              </span>
            </div>
            
            {balance?.creditLimit > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">可用信用额度</span>
                <span className="text-blue-600">
                  {formatCurrency(balance.availableCredit)}
                </span>
              </div>
            )}
            
            <div className="flex justify-between text-sm font-semibold pt-2 border-t">
              <span>可用总额</span>
              <span className={availableTotal < amount ? 'text-red-600' : 'text-green-600'}>
                {formatCurrency(availableTotal)}
              </span>
            </div>
          </div>

          {/* 余额不足提示 */}
          {!canPayWithCredit && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                余额和信用额度不足，请先充值后再支付
              </AlertDescription>
            </Alert>
          )}

          {/* 支付状态提示 */}
          {paymentStatus === 'processing' && (
            <Alert>
              <Loader2 className="h-4 w-4 animate-spin" />
              <AlertDescription>
                正在处理支付，请稍候...
              </AlertDescription>
            </Alert>
          )}

          {paymentStatus === 'success' && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-600">
                支付成功！正在跳转...
              </AlertDescription>
            </Alert>
          )}

          {paymentStatus === 'failed' && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {errorMessage}
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isProcessing}
          >
            取消
          </Button>
          <Button
            onClick={handlePayment}
            disabled={!canPayWithCredit || isProcessing || paymentStatus === 'success'}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                处理中...
              </>
            ) : (
              '确认支付'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
```

### 3. Stripe充值组件
```typescript
// components/payment/StripeRechargeModal.tsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { PractitionerAccountService } from '@/services/practitionerAccountService';
import { toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface StripeRechargeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  defaultAmount?: number;
}

const RechargeForm: React.FC<{
  onSuccess: () => void;
  onClose: () => void;
  defaultAmount?: number;
}> = ({ onSuccess, onClose, defaultAmount = 100 }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [amount, setAmount] = useState(defaultAmount);
  const [isProcessing, setIsProcessing] = useState(false);
  const [customAmount, setCustomAmount] = useState('');
  const [useCustomAmount, setUseCustomAmount] = useState(false);

  const presetAmounts = [50, 100, 200, 500];

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const finalAmount = useCustomAmount ? parseFloat(customAmount) : amount;
    
    if (isNaN(finalAmount) || finalAmount < 10 || finalAmount > 10000) {
      toast.error('请输入有效金额（10-10000）');
      return;
    }

    setIsProcessing(true);

    try {
      // 创建充值意图
      const rechargeIntent = await PractitionerAccountService.createRechargeIntent(finalAmount);
      
      // 确认支付
      const result = await stripe.confirmCardPayment(rechargeIntent.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
          billing_details: {
            // 可以添加账单信息
          },
        },
      });

      if (result.error) {
        toast.error(result.error.message || '支付失败');
      } else {
        toast.success('充值成功！');
        onSuccess();
      }
    } catch (error) {
      console.error('充值失败:', error);
      toast.error('充值失败，请重试');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 预设金额选择 */}
      <div>
        <Label className="text-base font-semibold mb-3 block">选择充值金额</Label>
        <div className="grid grid-cols-4 gap-2">
          {presetAmounts.map((preset) => (
            <Button
              key={preset}
              type="button"
              variant={amount === preset && !useCustomAmount ? 'default' : 'outline'}
              onClick={() => {
                setAmount(preset);
                setUseCustomAmount(false);
              }}
              className="font-semibold"
            >
              ${preset}
            </Button>
          ))}
        </div>
      </div>

      {/* 自定义金额 */}
      <div>
        <Label htmlFor="custom-amount">或输入自定义金额</Label>
        <div className="flex gap-2 mt-2">
          <span className="flex items-center px-3 text-gray-600">$</span>
          <Input
            id="custom-amount"
            type="number"
            placeholder="输入金额"
            value={customAmount}
            onChange={(e) => {
              setCustomAmount(e.target.value);
              setUseCustomAmount(true);
            }}
            onFocus={() => setUseCustomAmount(true)}
            min={10}
            max={10000}
            step={0.01}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">最小 $10，最大 $10,000</p>
      </div>

      {/* 银行卡信息 */}
      <div>
        <Label className="text-base font-semibold mb-3 block">银行卡信息</Label>
        <div className="border rounded-lg p-4 bg-gray-50">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">
          您的支付信息将通过安全加密传输
        </p>
      </div>

      {/* 充值按钮 */}
      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isProcessing}
          className="flex-1"
        >
          取消
        </Button>
        <Button
          type="submit"
          disabled={!stripe || isProcessing}
          className="flex-1"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              处理中...
            </>
          ) : (
            `充值 $${useCustomAmount ? customAmount || '0' : amount}`
          )}
        </Button>
      </div>
    </form>
  );
};

export const StripeRechargeModal: React.FC<StripeRechargeModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  defaultAmount
}) => {
  const handleSuccess = () => {
    onSuccess?.();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>账户充值</DialogTitle>
          <DialogDescription>
            使用信用卡或借记卡为您的账户充值
          </DialogDescription>
        </DialogHeader>

        <Elements stripe={stripePromise}>
          <RechargeForm
            onSuccess={handleSuccess}
            onClose={onClose}
            defaultAmount={defaultAmount}
          />
        </Elements>
      </DialogContent>
    </Dialog>
  );
};
```

### 4. 支付方式选择组件
```typescript
// components/payment/PaymentMethodSelector.tsx
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet, CreditCard, Check } from 'lucide-react';
import { PaymentMethod } from '@/services/paymentService';
import { formatCurrency } from '@/utils/formatters';

interface PaymentMethodSelectorProps {
  amount: number;
  balance: number;
  availableCredit: number;
  onSelect: (method: PaymentMethod) => void;
}

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  amount,
  balance,
  availableCredit,
  onSelect
}) => {
  const totalAvailable = balance + availableCredit;
  const canPayWithBalance = totalAvailable >= amount;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">选择支付方式</h3>
      
      <div className="grid gap-4">
        {/* 余额支付 */}
        <Card
          className={`p-4 cursor-pointer transition-all ${
            canPayWithBalance 
              ? 'hover:border-blue-500 hover:shadow-md' 
              : 'opacity-50 cursor-not-allowed'
          }`}
          onClick={() => canPayWithBalance && onSelect('balance')}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Wallet className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold">账户余额支付</h4>
                <p className="text-sm text-gray-600 mt-1">
                  使用您的账户余额或信用额度支付
                </p>
                <div className="mt-2 space-y-1">
                  <p className="text-sm">
                    当前余额: <span className="font-semibold">{formatCurrency(balance)}</span>
                  </p>
                  {availableCredit > 0 && (
                    <p className="text-sm">
                      可用额度: <span className="font-semibold text-blue-600">{formatCurrency(availableCredit)}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
            {canPayWithBalance && (
              <Check className="h-5 w-5 text-green-600" />
            )}
          </div>
          
          {!canPayWithBalance && (
            <div className="mt-3 p-2 bg-red-50 rounded text-sm text-red-600">
              余额不足，需要充值 {formatCurrency(amount - totalAvailable)}
            </div>
          )}
        </Card>

        {/* Stripe支付 */}
        <Card
          className="p-4 cursor-pointer hover:border-blue-500 hover:shadow-md transition-all"
          onClick={() => onSelect('stripe')}
        >
          <div className="flex items-start gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <CreditCard className="h-5 w-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold">信用卡/借记卡支付</h4>
              <p className="text-sm text-gray-600 mt-1">
                使用Visa、Mastercard等银行卡直接支付
              </p>
              <div className="flex items-center gap-2 mt-2">
                <img src="/images/visa.svg" alt="Visa" className="h-6" />
                <img src="/images/mastercard.svg" alt="Mastercard" className="h-6" />
                <img src="/images/amex.svg" alt="Amex" className="h-6" />
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="pt-4 border-t">
        <div className="flex justify-between items-center text-lg font-semibold">
          <span>支付金额</span>
          <span className="text-2xl">{formatCurrency(amount)}</span>
        </div>
      </div>
    </div>
  );
};
```

## 🪝 自定义Hooks

### 1. 账户余额Hook
```typescript
// hooks/useAccountBalance.ts
import { useState, useEffect, useCallback } from 'react';
import { PractitionerAccountService, AccountBalance } from '@/services/practitionerAccountService';
import { wsService } from '@/services/websocketService';

export const useAccountBalance = (autoRefresh: boolean = true) => {
  const [balance, setBalance] = useState<AccountBalance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await PractitionerAccountService.getBalance();
      setBalance(data);
    } catch (err) {
      setError(err.message || '获取余额失败');
      console.error('获取余额失败:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBalance();

    if (autoRefresh) {
      // 订阅余额更新事件
      const unsubscribe = wsService.subscribe('account.balance.updated', (data) => {
        setBalance(prev => ({
          ...prev,
          ...data,
          lastUpdated: new Date().toISOString()
        }));
      });

      return () => {
        unsubscribe();
      };
    }
  }, [fetchBalance, autoRefresh]);

  return {
    balance,
    loading,
    error,
    refresh: fetchBalance
  };
};
```

### 2. 支付处理Hook
```typescript
// hooks/usePayment.ts
import { useState, useCallback } from 'react';
import { PaymentService, PaymentMethod, PaymentResult } from '@/services/paymentService';
import { loadStripe } from '@stripe/stripe-js';

interface UsePaymentOptions {
  onSuccess?: (result: PaymentResult) => void;
  onError?: (error: Error) => void;
}

export const usePayment = (options: UsePaymentOptions = {}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);

  const processPayment = useCallback(async (
    prescriptionId: string,
    amount: number,
    method: PaymentMethod
  ) => {
    setIsProcessing(true);
    setPaymentResult(null);

    try {
      let result: PaymentResult;

      if (method === 'balance') {
        result = await PaymentService.payWithBalance(prescriptionId);
      } else {
        // Stripe支付流程
        const { clientSecret, paymentIntentId } = await PaymentService.payWithStripe(prescriptionId);
        
        const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
        if (!stripe) throw new Error('Stripe加载失败');

        // 这里需要配合Stripe Elements使用
        // 实际实现时需要传入card element
        const { error } = await stripe.confirmCardPayment(clientSecret);
        
        if (error) {
          throw new Error(error.message);
        }

        result = await PaymentService.confirmStripePayment(paymentIntentId, prescriptionId);
      }

      setPaymentResult(result);
      
      if (result.success) {
        options.onSuccess?.(result);
      } else {
        throw new Error(result.message || '支付失败');
      }

      return result;
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error('支付处理失败');
      options.onError?.(errorObj);
      throw errorObj;
    } finally {
      setIsProcessing(false);
    }
  }, [options]);

  const reset = useCallback(() => {
    setPaymentResult(null);
  }, []);

  return {
    processPayment,
    isProcessing,
    paymentResult,
    reset
  };
};
```

## 🧪 测试方案

### 1. 支付流程集成测试
```typescript
// __tests__/integration/payment-flow.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PaymentFlow } from '@/components/payment/PaymentFlow';
import { PaymentService } from '@/services/paymentService';
import { PractitionerAccountService } from '@/services/practitionerAccountService';

jest.mock('@/services/paymentService');
jest.mock('@/services/practitionerAccountService');

describe('Payment Flow Integration', () => {
  beforeEach(() => {
    // Mock账户余额
    (PractitionerAccountService.getBalance as jest.Mock).mockResolvedValue({
      balance: 1000,
      availableCredit: 500,
      creditLimit: 1000,
      usedCredit: 500
    });
  });

  it('should complete balance payment successfully', async () => {
    const onSuccess = jest.fn();
    
    (PaymentService.payWithBalance as jest.Mock).mockResolvedValue({
      success: true,
      transactionId: 'txn_123',
      status: 'completed'
    });

    render(
      <PaymentFlow
        prescriptionId="rx_123"
        amount={100}
        onSuccess={onSuccess}
      />
    );

    // 选择余额支付
    fireEvent.click(screen.getByText('账户余额支付'));
    
    // 确认支付
    fireEvent.click(screen.getByText('确认支付'));

    await waitFor(() => {
      expect(PaymentService.payWithBalance).toHaveBeenCalledWith('rx_123');
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it('should handle insufficient balance', async () => {
    (PractitionerAccountService.getBalance as jest.Mock).mockResolvedValue({
      balance: 50,
      availableCredit: 0,
      creditLimit: 0,
      usedCredit: 0
    });

    render(
      <PaymentFlow
        prescriptionId="rx_123"
        amount={100}
      />
    );

    // 应该显示余额不足提示
    expect(screen.getByText(/余额不足/)).toBeInTheDocument();
    
    // 余额支付按钮应该被禁用
    const balancePayButton = screen.getByText('账户余额支付').closest('div');
    expect(balancePayButton).toHaveClass('cursor-not-allowed');
  });
});
```

### 2. Stripe支付测试
```typescript
// __tests__/components/StripeRecharge.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { StripeRechargeModal } from '@/components/payment/StripeRechargeModal';

const stripePromise = loadStripe('pk_test_123');

describe('StripeRechargeModal', () => {
  it('should allow amount selection', () => {
    render(
      <Elements stripe={stripePromise}>
        <StripeRechargeModal
          isOpen={true}
          onClose={jest.fn()}
        />
      </Elements>
    );

    // 点击预设金额
    fireEvent.click(screen.getByText('$200'));
    expect(screen.getByText('充值 $200')).toBeInTheDocument();

    // 输入自定义金额
    const customInput = screen.getByPlaceholderText('输入金额');
    fireEvent.change(customInput, { target: { value: '150' } });
    fireEvent.focus(customInput);
    
    expect(screen.getByText('充值 $150')).toBeInTheDocument();
  });
});
```

## 🚀 实施计划

### 第一阶段：服务层开发（1天）
- [ ] 实现PractitionerAccountService
- [ ] 实现PaymentService
- [ ] 配置Stripe SDK
- [ ] 添加WebSocket支付事件

### 第二阶段：组件开发（1.5天）
- [ ] 开发AccountBalance组件
- [ ] 开发BalancePaymentModal组件
- [ ] 开发StripeRechargeModal组件
- [ ] 开发PaymentMethodSelector组件
- [ ] 开发支付状态反馈组件

### 第三阶段：集成和测试（1天）
- [ ] 集成到处方创建流程
- [ ] 集成到处方详情页
- [ ] 创建账户管理页面
- [ ] 编写单元测试
- [ ] 编写集成测试

### 第四阶段：优化和完善（0.5天）
- [ ] 错误处理优化
- [ ] 加载状态优化
- [ ] 支付成功动画
- [ ] 移动端适配

## 📋 安全考虑

### 1. 支付安全
- 所有支付请求必须通过HTTPS
- 敏感信息不在前端存储
- 支付确认需要二次验证
- 实现支付超时机制

### 2. Stripe集成安全
- 使用Stripe Elements避免直接处理卡号
- 不在前端存储任何支付方式信息
- 使用Stripe的3D Secure验证
- 实现webhook签名验证

### 3. 错误处理
- 支付失败自动重试机制
- 详细的错误日志记录
- 用户友好的错误提示
- 支付状态实时同步

## 📊 监控指标

### 1. 性能指标
- 支付接口响应时间 < 2秒
- Stripe加载时间 < 3秒
- 余额查询响应时间 < 500ms

### 2. 业务指标
- 支付成功率 > 95%
- 支付失败原因分布
- 充值转化率
- 平均充值金额

### 3. 用户体验指标
- 支付流程完成率
- 支付方式使用分布
- 错误重试次数
- 用户反馈评分

---

**文档创建**: 2025年1月10日  
**负责人**: 前端开发团队  
**预计完成**: 4天