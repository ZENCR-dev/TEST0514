# 新西兰中医处方平台 - 架构设计文档图文双备份

**文档版本：** 1.02 
**创建日期：** 2025-06-08  
**架构师：** 资深架构师  
**项目：** 新西兰中医处方平台 MVP 1.0

---
## 0. 部署架构图

```mermaid
graph TB
    subgraph "开发环境 (Development)"
        DevFE[前端开发环境<br/>localhost:3000]
        DevBE[后端开发环境<br/>localhost:8000<br/>NestJS]
        DevDB[(本地数据库<br/>Docker PostgreSQL)]
        DevSupabase[Supabase开发项目]
    end
    
    subgraph "测试环境 (Staging)"
        StagingFE[前端测试环境<br/>Vercel Preview<br/>staging-tcm.vercel.app]
        StagingBE[后端测试环境<br/>Render.com<br/>staging-api.tcm.onrender.com]
        StagingSupabase[Supabase测试项目<br/>staging数据库]
        StagingRedis[(Redis Cloud<br/>测试实例)]
    end
    
    subgraph "生产环境 (Production)"
        ProdCDN[CDN<br/>Vercel Global CDN]
        ProdFE[前端生产环境<br/>Vercel<br/>tcm-platform.co.nz]
        
        subgraph "Render.com Production"
            ProdBE[后端生产环境<br/>render.com<br/>api.tcm-platform.co.nz]
            ProdLB[负载均衡器<br/>Render Load Balancer]
            ProdScale[自动扩缩容<br/>2-5 instances]
        end
        
        subgraph "Supabase Production"
            ProdSupabaseDB[(Supabase PostgreSQL<br/>生产数据库<br/>Pro Plan)]
            ProdSupabaseAuth[Supabase Auth<br/>JWT认证]
            ProdSupabaseStorage[Supabase Storage<br/>文件存储]
        end
        
        ProdRedis[(Redis Cloud<br/>生产实例<br/>高可用)]
    end
    
    subgraph "第三方服务"
        Stripe[Stripe API<br/>支付处理]
        SendGrid[SendGrid<br/>邮件服务]
        Maps[Mapbox API<br/>地图服务]
        SMS[SMS服务]
    end
    
    subgraph "监控与日志"
        Sentry[Sentry<br/>错误监控]
        DataDog[DataDog<br/>性能监控]
        LogService[日志聚合服务<br/>Render Logs]
        Uptime[Uptime监控<br/>Pingdom/StatusPage]
    end
    
    subgraph "CI/CD流水线"
        GitHub[GitHub Repository]
        GitHubActions[GitHub Actions<br/>CI/CD]
        DockerHub[Docker Hub<br/>镜像仓库]
    end
    
    subgraph "域名与SSL"
        CloudFlare[CloudFlare<br/>DNS + DDoS防护]
        SSL[SSL证书<br/>Let's Encrypt]
    end
    
    %% 开发环境连接
    DevFE --> DevBE
    DevBE --> DevDB
    DevBE --> DevSupabase
    
    %% 测试环境连接
    StagingFE --> StagingBE
    StagingBE --> StagingSupabase
    StagingBE --> StagingRedis
    
    %% 生产环境连接
    CloudFlare --> ProdCDN
    ProdCDN --> ProdFE
    ProdFE --> ProdLB
    ProdLB --> ProdBE
    ProdBE --> ProdSupabaseDB
    ProdBE --> ProdSupabaseAuth
    ProdBE --> ProdSupabaseStorage
    ProdBE --> ProdRedis
    
    %% 第三方服务连接
    ProdBE --> Stripe
    ProdBE --> SendGrid
    ProdBE --> Maps
    ProdBE --> SMS
    StagingBE --> Stripe
    StagingBE --> SendGrid
    
    %% 监控连接
    ProdBE --> Sentry
    ProdBE --> DataDog
    ProdBE --> LogService
    Uptime --> ProdFE
    Uptime --> ProdBE
    
    %% CI/CD连接
    GitHub --> GitHubActions
    GitHubActions --> DockerHub
    GitHubActions --> ProdBE
    GitHubActions --> StagingBE
    GitHubActions --> ProdFE
    GitHubActions --> StagingFE
    
    %% SSL连接
    SSL --> CloudFlare
    SSL --> ProdFE
    SSL --> ProdBE
    
    %% 样式定义
    classDef devClass fill:#e3f2fd
    classDef stagingClass fill:#fff3e0
    classDef prodClass fill:#e8f5e8
    classDef thirdPartyClass fill:#fce4ec
    classDef monitorClass fill:#f3e5f5
    classDef cicdClass fill:#f1f8e9
    classDef infraClass fill:#ede7f6
    
    class DevFE,DevBE,DevDB,DevSupabase devClass
    class StagingFE,StagingBE,StagingSupabase,StagingRedis stagingClass
    class ProdCDN,ProdFE,ProdBE,ProdLB,ProdScale,ProdSupabaseDB,ProdSupabaseAuth,ProdSupabaseStorage,ProdRedis prodClass
    class Stripe,SendGrid,Maps,SMS thirdPartyClass
    class Sentry,DataDog,LogService,Uptime monitorClass
    class GitHub,GitHubActions,DockerHub cicdClass
    class CloudFlare,SSL infraClass
```
## 1. 系统整体架构拓扑图

### 1.1 图形化表示

```mermaid
graph TB
    %% 用户层
    subgraph "用户层"
        Doctor[医生端]
        Pharmacy[药房端]
        Patient[患者端]
        Admin[管理员端]
    end

    %% 前端层
    subgraph "前端层"
        WebApp[Web应用<br/>React/Next.js]
        MobileApp[移动应用<br/>React Native]
    end

    %% CDN和负载均衡
    CDN[CDN<br/>Vercel/Netlify]
    
    %% API网关层
    subgraph "API层"
        Gateway[API Gateway<br/>NestJS Backend]
    end

    %% 服务层
    subgraph "核心服务层"
        AuthService[用户认证服务<br/>User & Auth Service]
        CoreService[核心业务服务<br/>Core Business Service]
        IntegrationService[外部集成服务<br/>External Integration Service]
        SupportService[支撑服务<br/>Supporting Services]
    end

    %% 数据层
    subgraph "数据层"
        SupabaseDB[(Supabase PostgreSQL<br/>主数据库)]
        SupabaseAuth[Supabase Auth<br/>认证服务]
        SupabaseStorage[Supabase Storage<br/>文件存储]
        Redis[(Redis<br/>缓存层)]
    end

    %% 第三方服务
    subgraph "第三方服务"
        Stripe[Stripe<br/>支付服务]
        SendGrid[SendGrid<br/>邮件服务]
        SMS[SMS服务]
        Maps[地图服务<br/>Mapbox/Google Maps]
    end

    %% 部署环境
    subgraph "部署环境"
        Render[Render.com<br/>Backend部署]
        Monitoring[监控日志<br/>Sentry/DataDog]
    end

    %% 连接关系
    Doctor --> WebApp
    Pharmacy --> WebApp
    Patient --> MobileApp
    Admin --> WebApp

    WebApp --> CDN
    MobileApp --> CDN
    CDN --> Gateway

    Gateway --> AuthService
    Gateway --> CoreService
    Gateway --> IntegrationService
    Gateway --> SupportService

    AuthService --> SupabaseAuth
    AuthService --> SupabaseDB
    
    CoreService --> SupabaseDB
    CoreService --> Redis
    CoreService --> SupabaseStorage

    IntegrationService --> Stripe
    IntegrationService --> SendGrid
    IntegrationService --> SMS
    IntegrationService --> Maps

    SupportService --> SupabaseDB
    SupportService --> SupabaseStorage

    Gateway --> Render
    Render --> Monitoring
```

### 1.2 架构说明

#### 用户层
- **医生端：** 医师使用的处方开具界面
- **药房端：** 药房操作员使用的履约管理界面
- **患者端：** 患者查找药房和查看处方状态
- **管理员端：** 平台管理员使用的后台管理系统

#### 前端层
- **Web应用：** 基于React/Next.js构建，支持医生、药房、管理员使用
- **移动应用：** 基于React Native，主要面向患者使用

#### API层
- **API Gateway：** NestJS Backend作为统一API网关，处理所有业务请求

#### 核心服务层
- **用户认证服务：** 统一用户身份管理和权限控制
- **核心业务服务：** 处方、订单、支付等核心业务逻辑
- **外部集成服务：** 第三方服务集成的统一接口
- **支撑服务：** 药品管理、药房管理、文件处理等支撑功能

#### 数据层
- **Supabase PostgreSQL：** 主数据库，存储所有业务数据
- **Supabase Auth：** 认证服务，管理用户登录和JWT令牌
- **Supabase Storage：** 文件存储服务
- **Redis：** 缓存层，提升系统性能

---
## 4. 服务架构详细图

### 4.1 图形化表示

```mermaid
graph TB
    subgraph "NestJS Backend Application"
        subgraph "API Gateway Layer"
            Gateway[API Gateway<br/>路由、限流、日志]
            Auth[Authentication Guard<br/>JWT验证]
            RBAC[Authorization Guard<br/>权限控制]
        end
        
        subgraph "User & Auth Service"
            UserController[User Controller]
            AuthController[Auth Controller]
            UserService[User Service]
            ProfileService[Profile Service]
            ReferralService[Referral Service]
        end
        
        subgraph "Core Business Service"
            PrescriptionController[Prescription Controller]
            OrderController[Order Controller]
            PaymentController[Payment Controller]
            PrescriptionService[Prescription Service]
            OrderService[Order Service]
            PaymentService[Payment Service]
            StateMachine[Order State Machine]
        end
        
        subgraph "External Integration Service"
            PaymentGateway[Payment Gateway Integration]
            NotificationService[Notification Service]
            GeoService[Geo Location Service]
            EmailService[Email Service]
            SMSService[SMS Service]
        end
        
        subgraph "Supporting Services"
            MedicineController[Medicine Controller]
            PharmacyController[Pharmacy Controller]
            AdminController[Admin Controller]
            ReportController[Report Controller]
            MedicineService[Medicine Service]
            PharmacyService[Pharmacy Service]
            FileService[File Service]
            ReportService[Report Service]
        end
        
        subgraph "Shared Modules"
            DatabaseModule[Database Module<br/>Prisma]
            ConfigModule[Config Module]
            LoggerModule[Logger Module]
            CacheModule[Cache Module]
            ValidationModule[Validation Module]
        end
    end
    
    subgraph "External Services"
        SupabaseDB[(Supabase PostgreSQL)]
        SupabaseAuth[Supabase Auth]
        SupabaseStorage[Supabase Storage]
        Redis[(Redis Cache)]
        Stripe[Stripe API]
        SendGrid[SendGrid API]
        MapService[Map Service API]
    end
    
    %% API Gateway connections
    Gateway --> UserController
    Gateway --> PrescriptionController
    Gateway --> MedicineController
    Gateway --> PharmacyController
    Gateway --> AdminController
    
    Auth --> UserService
    RBAC --> UserService
    
    %% Service connections
    UserService --> DatabaseModule
    UserService --> SupabaseAuth
    
    PrescriptionService --> DatabaseModule
    OrderService --> DatabaseModule
    OrderService --> StateMachine
    PaymentService --> PaymentGateway
    PaymentService --> DatabaseModule
    
    PaymentGateway --> Stripe
    NotificationService --> EmailService
    NotificationService --> SMSService
    EmailService --> SendGrid
    GeoService --> MapService
    
    MedicineService --> DatabaseModule
    PharmacyService --> DatabaseModule
    PharmacyService --> GeoService
    FileService --> SupabaseStorage
    ReportService --> DatabaseModule
    
    DatabaseModule --> SupabaseDB
    CacheModule --> Redis
```

### 4.2 服务架构说明

#### API Gateway Layer（API网关层）
- **API Gateway：** 统一入口，处理路由、限流、日志记录
- **Authentication Guard：** JWT令牌验证，确保请求来源合法
- **Authorization Guard：** 基于角色的权限控制，确保用户只能访问授权资源

#### User & Auth Service（用户认证服务）
- **User Controller：** 处理用户相关的HTTP请求
- **Auth Controller：** 处理认证相关的HTTP请求
- **User Service：** 用户管理核心业务逻辑
- **Profile Service：** 用户档案管理
- **Referral Service：** 医生推荐机制

#### Core Business Service（核心业务服务）
- **Prescription Controller：** 处方管理API
- **Order Controller：** 订单管理API
- **Payment Controller：** 支付管理API
- **Prescription Service：** 处方业务逻辑
- **Order Service：** 订单业务逻辑
- **Payment Service：** 支付业务逻辑
- **State Machine：** 订单状态机管理

#### External Integration Service（外部集成服务）
- **Payment Gateway：** 支付网关集成
- **Notification Service：** 通知服务统一接口
- **Geo Service：** 地理位置服务
- **Email Service：** 邮件服务
- **SMS Service：** 短信服务

#### Supporting Services（支撑服务）
- **Medicine Controller：** 药品管理API
- **Pharmacy Controller：** 药房管理API
- **Admin Controller：** 管理员功能API
- **Report Controller：** 报表统计API
- **Medicine Service：** 药品管理业务逻辑
- **Pharmacy Service：** 药房管理业务逻辑
- **File Service：** 文件管理服务
- **Report Service：** 报表生成服务

#### Shared Modules（共享模块）
- **Database Module：** 数据库连接和ORM管理
- **Config Module：** 配置管理
- **Logger Module：** 日志记录
- **Cache Module：** 缓存管理
- **Validation Module：** 数据验证

---

## 5. 数据库ER图.mermaid

5.1 图形化表示
```mermaid
erDiagram
    users {
        uuid id PK
        string email UK
        string phone
        enum role
        timestamp created_at
        timestamp updated_at
        boolean is_active
        string referral_code UK
        uuid referred_by FK
    }
    
    user_profiles {
        uuid id PK
        uuid user_id FK
        string first_name
        string last_name
        string license_number
        string clinic_name
        text address
        decimal latitude
        decimal longitude
        jsonb preferences
        timestamp created_at
        timestamp updated_at
    }
    
    clinic_accounts {
        uuid id PK
        uuid clinic_user_id FK
        decimal balance
        decimal credit_limit
        decimal used_credit
        string account_status
        timestamp created_at
        timestamp updated_at
    }
    
    medicines {
        uuid id PK
        string name
        string english_name
        string pinyin
        text description
        string category
        decimal cost_price
        decimal suggested_retail_price
        string unit
        jsonb specifications
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }
    
    prescriptions {
        uuid id PK
        uuid doctor_id FK
        string patient_name
        string patient_phone
        string patient_id_number
        text diagnosis
        text notes
        enum status
        decimal total_amount
        uuid template_id FK
        timestamp created_at
        timestamp updated_at
    }
    
    prescription_items {
        uuid id PK
        uuid prescription_id FK
        uuid medicine_id FK
        decimal quantity
        string unit
        decimal unit_price
        decimal total_price
        text usage_instructions
        timestamp created_at
    }
    
    prescription_templates {
        uuid id PK
        uuid doctor_id FK
        string name
        text description
        jsonb template_data
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }
    
    orders {
        uuid id PK
        uuid prescription_id FK
        uuid clinic_account_id FK
        string order_number UK
        enum status
        decimal total_amount
        decimal clinic_cost
        decimal pharmacy_revenue
        string payment_intent_id
        string qr_code_data
        timestamp expires_at
        uuid assigned_pharmacy_id FK
        timestamp created_at
        timestamp updated_at
    }
    
    pharmacies {
        uuid id PK
        uuid user_id FK
        string name
        string license_number
        text address
        decimal latitude
        decimal longitude
        string phone
        string email
        jsonb operating_hours
        text description
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }
    
    pharmacy_medicines {
        uuid id PK
        uuid pharmacy_id FK
        uuid medicine_id FK
        boolean is_available
        decimal stock_quantity
        decimal price
        timestamp last_updated
    }
    
    fulfillment_records {
        uuid id PK
        uuid order_id FK
        uuid pharmacy_id FK
        string evidence_file_url
        text notes
        enum status
        uuid reviewed_by FK
        text review_notes
        timestamp fulfilled_at
        timestamp reviewed_at
        timestamp created_at
    }
    
    transactions {
        uuid id PK
        uuid order_id FK
        uuid clinic_account_id FK
        uuid pharmacy_id FK
        enum transaction_type
        decimal amount
        string description
        string reference_id
        enum status
        timestamp created_at
    }
    
    admin_users {
        uuid id PK
        uuid user_id FK
        enum admin_role
        jsonb permissions
        timestamp created_at
        timestamp updated_at
    }
    
    audit_logs {
        uuid id PK
        uuid user_id FK
        string action
        string resource_type
        uuid resource_id
        jsonb old_values
        jsonb new_values
        string ip_address
        string user_agent
        timestamp created_at
    }
    
    %% Relationships
    users ||--o{ user_profiles : "has profile"
    users ||--o{ clinic_accounts : "has clinic account"
    users ||--o{ prescriptions : "creates prescriptions"
    users ||--o{ prescription_templates : "creates templates"
    users ||--o{ pharmacies : "operates pharmacy"
    users ||--o{ admin_users : "has admin role"
    users ||--o{ users : "refers"
    
    prescriptions ||--o{ prescription_items : "contains items"
    prescriptions ||--|| orders : "generates order"
    prescription_templates ||--o{ prescriptions : "used in"
    
    medicines ||--o{ prescription_items : "prescribed in"
    medicines ||--o{ pharmacy_medicines : "stocked by"
    
    orders ||--o{ fulfillment_records : "fulfilled by"
    orders ||--o{ transactions : "involves"
    
    pharmacies ||--o{ pharmacy_medicines : "stocks"
    pharmacies ||--o{ fulfillment_records : "fulfills"
    pharmacies ||--o{ transactions : "receives payment"
    
    clinic_accounts ||--o{ orders : "pays for" clinic_accounts ||--o{ transactions : "involved in" admin_users ||--o{ fulfillment_records : "reviews" users ||--o{ audit_logs : "generates logs"
```


## 架构师图表修改版本

### 2. 核心业务流程图（修改版）

基于产品经理的反馈，我对核心业务流程图进行了以下关键修改：

```mermaid
sequenceDiagram
    participant D as 医生
    participant P as 患者
    participant PH as 药房
    participant SYS as 平台系统
    participant PAY as 支付系统
    participant CLINIC as 诊所账户

    Note over D,CLINIC: 处方开具阶段
    D->>SYS: 1. 登录并创建处方
    SYS->>D: 返回处方草稿ID
    D->>SYS: 2. 添加药品到处方
    D->>SYS: 3. 提交处方
    SYS->>SYS: 验证处方合规性
    
    Note over SYS,CLINIC: 支付与凭证生成阶段
    SYS->>CLINIC: 4. 检查诊所信用额度/预付款
    alt 余额充足
        SYS->>CLINIC: 扣除相应金额
        SYS->>SYS: 生成支付凭证和二维码
        SYS->>D: 返回处方成功，生成凭证及药房查找引导
        Note over D: 医生通过打印/邮件等方式将凭证交付给患者
    else 余额不足
        SYS->>D: 返回余额不足错误
        D->>CLINIC: 联系诊所充值
    end

    Note over P,PH: 患者获取药房信息并前往
    P->>SYS: 5. (可选) 访问公开药房查找页面
    SYS->>P: 返回药房列表（位置+供应能力）
    P->>P: 选择药房并前往

    Note over PH,SYS: 药房履约阶段
    PH->>SYS: 6. 扫描患者凭证二维码
    SYS->>SYS: 验证凭证有效性和订单信息 (通过P1-P2订单验证API)
    SYS->>PH: 返回处方详情
    PH->>PH: 配药并打包
    PH->>SYS: 7. 上传履约凭证（照片等）
    SYS->>SYS: 更新订单状态为"待审核"

    Note over SYS,PAY: 审核与结算阶段
    loop 管理员审核
        SYS->>SYS: 8. 管理员手动审核履约凭证
        alt 审核通过
            SYS->>PH: 标记订单为"已完成"
            SYS->>SYS: 计算药房应得金额（基于C价）
            SYS->>PAY: 发起对药房的结算支付
            PAY->>PH: 转账给药房
            SYS->>D: 通知处方履约完成
        else 审核拒绝
            SYS->>PH: 要求重新履约或说明
            SYS->>SYS: 订单状态回退
        end
    end

    Note over SYS,SYS: 数据记录与分析
    SYS->>SYS: 9. 记录交易数据
    SYS->>SYS: 更新KPI指标
    SYS->>SYS: 生成财务报表数据
```

#### 主要修改说明：

1. **凭证交付方式**：明确了平台将凭证返回给医生，再由医生通过线下方式交付给患者
2. **患者药房查找**：改为可选的公开页面访问行为，不与订单流程强制绑定
3. **P1-P2验证**：明确标注了订单验证通过P1-P2 API实现
4. **去除患者通知**：移除了平台直接通知患者的步骤

### 3. 订单状态机图（修改版）

基于产品经理的反馈，简化了状态机并融入了UI表现说明：

```mermaid
stateDiagram-v2
    [*] --> DRAFT : 医生创建处方
    
    DRAFT --> PAID : 提交处方且扣款成功
    DRAFT --> PAYMENT_FAILED : 提交处方但扣款失败
    DRAFT --> CANCELLED : 医生取消
    
    PAYMENT_FAILED --> PAID : 诊所充值后重新扣款成功
    PAYMENT_FAILED --> CANCELLED : 放弃处方
    
    PAID --> PENDING_REVIEW : 药房提交履约凭证
    PAID --> EXPIRED : 超时未履约(48小时)
    PAID --> CANCELLED : 患者/医生取消
    
    PENDING_REVIEW --> FULFILLED : 管理员审核通过
    PENDING_REVIEW --> REJECTED : 管理员审核拒绝
    
    REJECTED --> PENDING_REVIEW : 药房重新提交履约凭证
    REJECTED --> CANCELLED : 多次拒绝后取消(最多3次)
    
    FULFILLED --> [*] : 订单完成
    CANCELLED --> [*] : 订单取消
    EXPIRED --> [*] : 订单过期
```

#### 订单状态详细说明（融入UI表现）

| 状态 | UI显示 | 显示样式 | 用户操作 | 状态转换逻辑 | 权限控制 |
|------|--------|----------|----------|--------------|----------|
| **DRAFT** | 草稿 | 灰色标签 | 编辑、删除、提交 | 提交→PAID/PAYMENT_FAILED | 创建者可操作 |
| **PAYMENT_FAILED** | 支付失败 | 红色标签+错误图标 | 重新支付、取消 | 充值后重试→PAID | 创建者+管理员 |
| **PAID** | 已支付 | 绿色标签+二维码图标 | 查看详情、联系药房、生成二维码 | 药房履约→PENDING_REVIEW | 只读，可查看凭证 |
| **PENDING_REVIEW** | 审核中 | 黄色标签+时钟图标 | 管理员:审核 | 审核通过→FULFILLED，拒绝→REJECTED | 管理员可审核 |
| **REJECTED** | 审核拒绝 | 橙色标签+警告图标 | 药房:重新提交凭证 | 重新提交→PENDING_REVIEW | 药房可重新履约 |
| **FULFILLED** | 已完成 | 深绿色标签+完成图标 | 查看详情、下载凭证 | 终态，触发结算 | 只读 |
| **CANCELLED** | 已取消 | 红色标签 | 查看取消原因 | 终态 | 只读 |
| **EXPIRED** | 已过期 | 灰色标签+过期图标 | 查看详情 | 终态 | 只读 |

#### 主要修改说明：

1. **简化状态流转**：移除了`DISPENSING`状态，直接从`PAID`到`PENDING_REVIEW`
2. **精确化支付流程**：`DRAFT`可以直接流转到`PAID`或`PAYMENT_FAILED`，反映同步扣款模式
3. **明确重试流程**：`REJECTED`直接流转到`PENDING_REVIEW`，不再经过中间状态
4. **增加UI表现**：为每个状态定义了具体的UI显示样式、用户操作和权限控制
5. **融入业务规则**：明确了48小时超时机制和最多3次重试的业务规则

### 关键业务规则总结：

1. **同步扣款机制**：医生提交处方时立即进行扣款，成功则直接到PAID状态
2. **凭证生成**：PAID状态下生成二维码凭证，48小时有效期
3. **手动审核**：MVP 1.0采用管理员手动审核，不使用AI
4. **重试限制**：药房最多可以重新提交3次履约凭证
5. **自动结算**：FULFILLED状态触发平台与药房的自动结算流程

这些修改确保了技术实现与产品需求的100%同步，简化了MVP 1.0的复杂度，为后续开发提供了更精确的指导。