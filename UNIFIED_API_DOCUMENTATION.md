# 新西兰中医药电子处方平台 - 统一API文档

**文档版本**: v3.3  
**创建日期**: 2025年7月12日  
**最后更新**: 2025年7月12日  
**状态**: 生产就绪 ✅  
**数据库架构版本**: MVP 2.3+ 完成架构优化 (Stage 3.2 并发测试完成)

## 🚨 重要变更通知

### Stage 3.2 并发测试完成 + MVP 2.0架构优化完结 (2025年7月12日)
- **完成**: Stage 3.2 并发测试实施，8个并发场景验证
- **性能**: API响应时间<200ms，高负载<500ms，符合企业级标准
- **测试覆盖**: 95.23%语句覆盖率，超过90%目标要求
- **架构状态**: ✅ MVP 2.0架构优化正式完结，系统生产就绪

### 隐私合规升级 (2025年7月12日)
- **完成**: patientInfo字段已从数据库中完全移除
- **修改**: 处方API结构全面更新，统一字段命名
- **字段标准化**: amounts → copies (帖数)
- **影响**: 前端集成需要更新字段名称

---

## 📖 文档说明

这是项目唯一的权威API文档，所有后端功能、模块、组件的开发和修改都必须在此文档中体现。配套的修改日志记录所有API变更时间线。

### 基础信息

- **基础URL**: `http://localhost:4000`
- **API版本**: v1
- **API前缀**: `/api/v1`
- **内容类型**: `application/json`
- **Swagger文档**: `http://localhost:4000/api/docs`

### 认证方式

```http
Authorization: Bearer <jwt_token>
```

### 标准响应格式

**成功响应**:
```json
{
  "success": true,
  "data": { ... },
  "message": "操作成功",
  "meta": {
    "timestamp": "2025-07-12T03:50:31.000Z",
    "pagination": {
      "total": 100,
      "page": 1,
      "limit": 20,
      "totalPages": 5
    }
  }
}
```

**错误响应**:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "请求参数无效",
    "details": { ... }
  },
  "meta": {
    "timestamp": "2025-07-12T03:50:31.000Z"
  }
}
```

---

## 🔐 认证模块 (Auth)

### 用户登录
```http
POST /api/v1/auth/login
```

**请求体**:
```json
{
  "email": "doctor@test.com",
  "password": "doctor123"
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user_123",
      "email": "doctor@test.com",
      "role": "practitioner",
      "profile": {
        "fullName": "张医生",
        "licenseNumber": "DOC123"
      }
    }
  },
  "message": "登录成功"
}
```

### 刷新Token
```http
POST /api/v1/auth/refresh
Authorization: Bearer <refresh_token>
```

### 获取用户信息
```http
GET /api/v1/auth/profile
Authorization: Bearer <jwt_token>
```

---

## 🏥 处方管理模块 (Prescriptions) - 隐私合规版

**基础URL**: `/api/v1/prescriptions`

### 创建处方 (隐私合规)
```http
POST /api/v1/prescriptions
Authorization: Bearer <jwt_token>
```

**请求体 (无患者信息)**:
```json
{
  "medicines": [
    {
      "medicineId": "med_123",
      "weight": 15
    }
  ],
  "copies": 7,
  "notes": "处方整体备注"
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "id": "prescription_123",
    "prescriptionId": "RX-2025-001",
    "doctorId": "doctor_456",
    "medicines": [
      {
        "medicineId": "med_123",
        "pinyinName": "guizhi",
        "englishName": "Ramulus Cinnamomi"
        "chineseName": "桂枝",
        "weight": 15,
        "unitPrice": 12.50,
        "unit": "g"
      }
    ],
    "copies": 7,
    "grossWeight": 105,
    "totalPrice": 187.50,
    "status": "DRAFT",
    "notes": "处方整体备注",
    "createdAt": "2025-07-12T03:50:31.000Z",
    "updatedAt": "2025-07-12T03:50:31.000Z"
  },
  "message": "处方创建成功"
}
```

### 获取处方列表
```http
GET /api/v1/prescriptions?page=1&limit=20
Authorization: Bearer <jwt_token>
```

### 获取处方详情
```http
GET /api/v1/prescriptions/{id}
Authorization: Bearer <jwt_token>
```

### 更新处方
```http
PATCH /api/v1/prescriptions/{id}
Authorization: Bearer <jwt_token>
```

### 删除处方
```http
DELETE /api/v1/prescriptions/{id}
Authorization: Bearer <jwt_token>
```

### 开具处方 (生成QR码)
```http
POST /api/v1/prescriptions/{id}/issue
Authorization: Bearer <jwt_token>
```

### 验证处方
```http
POST /api/v1/prescriptions/verify
```

**请求体**:
```json
{
  "qrCodeString": "QR码字符串"
}
```

### 更新处方状态
```http
PATCH /api/v1/prescriptions/{id}/status
Authorization: Bearer <jwt_token>
```

### 获取处方分类统计
```http
GET /api/v1/prescriptions/categories/summary
Authorization: Bearer <jwt_token>
```

### 处方支付 - 余额支付
```http
POST /api/v1/prescriptions/{id}/pay-with-balance
Authorization: Bearer <jwt_token>
```
**说明**: 医师使用账户余额支付处方费用，扣除PractitionerAccount.balance

### 处方支付 - Stripe支付  
```http
POST /api/v1/prescriptions/{id}/pay-with-stripe
Authorization: Bearer <jwt_token>
```
**说明**: 医师使用Stripe信用卡支付处方费用，支付成功后更新余额

### 查询支付状态
```http
GET /api/v1/prescriptions/{id}/payment-status
Authorization: Bearer <jwt_token>
```

---

## 💊 药品管理模块 (Medicines)

### 搜索药品
```http
GET /api/v1/medicines/search?q=桂枝&page=1&limit=20
```

### 获取药品列表
```http
GET /api/v1/medicines?category=其他中药&page=1&limit=50
```

### 获取药品详情
```http
GET /api/v1/medicines/{id}
```

**注意**: 非登录用户的药品数据通过前端Mock数据提供，无需后端API支持

---

## 🏪 药房模块 (Pharmacy)

**基础URL**: `/api/v1/pharmacy`  
**权限要求**: `pharmacy_operator`

### 账户管理

#### 获取余额
```http
GET /api/v1/pharmacy/account/balance
Authorization: Bearer <jwt_token>
```

#### 申请提现
```http
POST /api/v1/pharmacy/account/withdraw
Authorization: Bearer <jwt_token>
```

**请求体**:
```json
{
  "amount": 500.00,
  "bankAccount": "12-3456-7890123-45",
  "notes": "提现备注"
}
```

#### 查询交易记录
```http
GET /api/v1/pharmacy/account/transactions?type=CREDIT&startDate=2025-01-01
Authorization: Bearer <jwt_token>
```

### 价格清单管理 (基于PharmacyPriceList表格)

#### 上传价格清单
```http
POST /api/v1/pharmacy/price-lists
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

#### 获取当前生效价格清单
```http
GET /api/v1/pharmacy/price-lists/current
Authorization: Bearer <jwt_token>
```

#### 查询价格清单历史
```http
GET /api/v1/pharmacy/price-lists/history?status=active
Authorization: Bearer <jwt_token>
```

**说明**: 使用现有PharmacyPriceList表格，每家药房可上传版本化价格清单，需平台管理员审批生效

### 处方扫描

#### 扫描处方
```http
POST /api/v1/pharmacy/prescriptions/scan
Authorization: Bearer <jwt_token>
```

**请求体**:
```json
{
  "qrCodeString": "处方QR码字符串"
}
```

#### 查询已扫描处方
```http
GET /api/v1/pharmacy/prescriptions/scanned?status=pending
Authorization: Bearer <jwt_token>
```

### 配药履约 (基于FulfillmentProof表格，关联Prescription)

#### 上传履约凭证
```http
POST /api/v1/pharmacy/fulfillments
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data
```

**请求体**:
```
prescriptionId: string (必填 - 处方ID，不再使用orderId)
actualWeight: number (必填)
packagePhoto: File (必填 - 药包照片)
scalePhoto: File (必填 - 电子秤照片)
notes: string (可选)
```

#### 查询履约记录
```http
GET /api/v1/pharmacy/fulfillments?status=pending
Authorization: Bearer <jwt_token>
```

#### 获取履约记录详情
```http
GET /api/v1/pharmacy/fulfillments/{id}
Authorization: Bearer <jwt_token>
```

**说明**: 使用FulfillmentProof表格，履约记录直接与处方(Prescription)关联，Order表格已废弃，采用Prescription为核心的架构

### 采购订单 (基于PurchaseOrder表格，关联Prescription)

#### 查询采购订单
```http
GET /api/v1/pharmacy/purchase-orders?status=pending_review
Authorization: Bearer <jwt_token>
```

#### 获取采购订单详情
```http
GET /api/v1/pharmacy/purchase-orders/{id}
Authorization: Bearer <jwt_token>
```

#### 获取可提现的采购订单
```http
GET /api/v1/pharmacy/purchase-orders/withdrawable
Authorization: Bearer <jwt_token>
```

**说明**: PurchaseOrder表格包含orderId字段，但在以Prescription为核心的架构下，应通过FulfillmentProof关联到处方。需要确认是否添加prescriptionId字段

---

## 👤 医师账户模块 (基于PractitionerAccount表格)

### 获取账户余额
```http
GET /api/v1/practitioner-accounts/balance
Authorization: Bearer <jwt_token>
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "balance": 150.50,
    "availableCredit": 100.00,
    "creditLimit": 500.00,
    "usedCredit": 0.00,
    "currency": "NZD"
  },
  "message": "账户余额获取成功"
}
```

### 获取账户信息
```http
GET /api/v1/practitioner-accounts/info
Authorization: Bearer <jwt_token>
```

### 账户充值 (Stripe)
```http
POST /api/v1/practitioner-accounts/recharge
Authorization: Bearer <jwt_token>
```

**请求体**:
```json
{
  "amount": 100.00,
  "currency": "NZD"
}
```

### 查询交易记录
```http
GET /api/v1/practitioner-accounts/transactions?limit=20&offset=0
Authorization: Bearer <jwt_token>
```

**说明**: 使用实际的PractitionerAccount表格和 `/api/v1/practitioner-accounts/` 路由，支持余额查询、Stripe充值和交易历史

---

## 💳 支付模块 (Payments)

### Stripe Webhook (系统内部)
```http
POST /api/v1/payments/webhook
Content-Type: application/json
```

---

## 📊 数据模型定义

### 处方模型 (隐私合规版，Prescription为核心架构)
```typescript
interface Prescription {
  id: string;                    // 系统内部ID
  prescriptionId: string;        // 业务ID：RX-YYYYMMDD-序号
  doctorId: string;             // 医师ID
  copies: number;               // 帖数 (1-30范围)
  grossWeight: number;          // 总克重 (medicines[].weight * copies 的总和)
  totalPrice: number;           // 总价格（医师支付，即netPrice）
  status: 'DRAFT' | 'PAID' | 'FULFILLED' | 'COMPLETED';
  notes?: string;               // 处方整体备注
  medicines: PrescriptionMedicine[];
  createdAt: Date;
  updatedAt: Date;
  // 注意：无患者个人信息字段（隐私合规）
  // 注意：Order表格已废弃，直接使用Prescription为核心
}

interface PrescriptionMedicine {
  medicineId: string;
  englishName: string;
  pinyinName: string;
  chineseName: string;
  weight: number;           // 单味药克重
  basePrice: number;        // 单价
  unit: string;            // 单位（通常为"克"）
  // 注意：totalPrice在medicines层级已移除，计算逻辑在处方层级
  // 注意：notes字段移至处方层级，不在单味药层级
}
```

### 药品模型
```typescript
interface Medicine {
  id: string;
  name: string;
  chineseName: string;
  englishName: string;
  pinyinName: string;
  sku: string;
  category: string;
  basePrice: number;
  unit: string;
  description?: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}
```

### 用户模型
```typescript
interface User {
  id: string;
  email: string;
  role: 'practitioner' | 'pharmacy_operator' | 'admin';
  profile: {
    fullName: string;
    licenseNumber?: string;
    phone?: string;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 🚨 错误代码表

| 错误代码 | HTTP状态码 | 描述 |
|---------|-----------|------|
| VALIDATION_ERROR | 400 | 请求参数验证失败 |
| UNAUTHORIZED | 401 | 未授权访问 |
| FORBIDDEN | 403 | 权限不足 |
| NOT_FOUND | 404 | 资源不存在 |
| CONFLICT | 409 | 资源冲突 |
| INSUFFICIENT_BALANCE | 400 | 余额不足 |
| PRESCRIPTION_NOT_FOUND | 404 | 处方不存在 |
| MEDICINE_NOT_FOUND | 404 | 药品不存在 |
| INVALID_QR_CODE | 400 | 无效的QR码 |
| PAYMENT_FAILED | 400 | 支付失败 |

---

## 📝 开发规范

### API设计原则
1. **RESTful设计**: 遵循REST架构原则
2. **版本控制**: 使用URL版本控制 (`/api/v1`)
3. **标准响应**: 统一使用标准响应格式
4. **错误处理**: 一致的错误响应结构
5. **文档优先**: API设计必须先更新文档

### 数据验证
1. **输入验证**: 所有API输入必须验证
2. **类型安全**: 使用TypeScript类型定义
3. **数据格式**: 统一日期时间格式 (ISO 8601)
4. **隐私保护**: 不得包含患者个人信息

### 安全要求
1. **身份认证**: JWT token认证
2. **权限控制**: 基于角色的访问控制
3. **数据加密**: 敏感数据传输加密
4. **审计日志**: 重要操作记录日志

---

## 🔄 API版本历史

### v3.2 (2025年7月12日) - 架构优化和数据模型修正 🏗️
- **架构转换**: 从Order为核心转向Prescription为核心架构
- **字段优化**: 移除处方创建请求体中的冗余notes字段
- **响应体调整**: medicines中移除notes和additionalNotes，totalAmount改为totalPrice
- **数据模型更新**: 添加grossWeight和notes字段到处方模型
- **API路由修正**: 更新医师账户模块为正确的/practitioner-accounts/路由
- **药房模块**: 废弃PharmacyInventory，统一使用PharmacyPriceList
- **履约关联**: 配药履约直接关联Prescription而非废弃的Order
- **支付说明**: 明确处方支付API的业务用途
- **公开API**: 移除公开药品API，改用前端Mock数据

### v3.1 (2025年7月12日) - 字段标准化和登录修复
- **字段标准化**: amounts → copies (帖数)
- **登录修复**: 修正API文档示例凭证和响应格式
- **用户密码**: 重置测试用户密码，确保登录功能正常

### v3.0 (2025年7月12日) - 隐私合规版
- 移除所有患者个人信息字段
- 处方API结构重构
- 数据库模式更新
- 所有相关测试更新

### v2.4 (2025年1月9日) - 药房端完成
- 新增药房端完整API
- 处方扫码验证功能
- 履约凭证管理
- 采购订单系统

### v2.2 (2025年1月9日) - 医师端增强
- 实时性能监控
- WebSocket事件标准化
- 公共药品API
- 支付系统集成

### v2.1 (2025年1月9日) - 基础版本
- 处方管理CRUD
- 用户认证系统
- 医师账户管理
- API响应标准化

---

**文档维护**: 此文档由后端开发团队维护，所有API变更必须在此处记录并更新版本号。