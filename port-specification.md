# 前后端端口规范文档

## 概述

本文档定义了新西兰中医药电子处方平台的前后端服务端口分配规范，旨在避免端口冲突和跨域问题。

## 端口分配规则

### 前端服务端口范围：3000-3009
- **3000**: 主前端开发服务器（默认）
- **3001-3009**: 备用前端端口（当3000被占用时自动分配）

### 后端服务端口范围：4000-4009
- **4000**: 主后端API服务器（默认）
- **4001**: WebSocket/Socket.IO服务
- **4002-4009**: 备用后端端口（微服务、测试等）

## 环境配置

### 开发环境

#### 前端配置 (.env.local)
```bash
# API连接配置
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
NEXT_PUBLIC_WS_URL=http://localhost:4001
NEXT_PUBLIC_WS_PATH=/ws/orchestration

# 前端服务端口（可选，默认3000）
PORT=3000
```

#### 后端配置 (.env)
```bash
# 后端服务端口
PORT=4000
WS_PORT=4001

# CORS配置
CORS_ORIGIN=http://localhost:3000,http://localhost:3001,http://localhost:3002,http://localhost:3003,http://localhost:3004,http://localhost:3005,http://localhost:3006,http://localhost:3007,http://localhost:3008,http://localhost:3009
```

### 生产环境

#### 前端配置
```bash
NEXT_PUBLIC_API_URL=https://api.tcm-prescription.nz/api/v1
NEXT_PUBLIC_WS_URL=wss://api.tcm-prescription.nz
NEXT_PUBLIC_WS_PATH=/ws/orchestration
```

#### 后端配置
```bash
PORT=4000
WS_PORT=4001
CORS_ORIGIN=https://tcm-prescription.nz,https://www.tcm-prescription.nz
```

## 端口使用指南

### 前端开发者

1. **启动前端服务**
   ```bash
   npm run dev  # 默认使用3000端口
   # 或指定端口
   PORT=3001 npm run dev
   ```

2. **配置API连接**
   ```typescript
   // src/lib/apiClient.ts
   const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
   ```

3. **配置WebSocket连接**
   ```typescript
   // src/hooks/useOrchestrationEvents.ts
   const socketUrl = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:4001';
   const socketPath = process.env.NEXT_PUBLIC_WS_PATH || '/ws/orchestration';
   ```

### 后端开发者

1. **启动后端服务**
   ```bash
   npm run start:dev  # 使用环境变量中的端口配置
   ```

2. **NestJS主应用配置**
   ```typescript
   // main.ts
   const port = process.env.PORT || 4000;
   await app.listen(port);
   ```

3. **WebSocket Gateway配置**
   ```typescript
   // orchestration.gateway.ts
   @WebSocketGateway({
     port: process.env.WS_PORT || 4001,
     path: '/ws/orchestration',
     cors: {
       origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000']
     }
   })
   ```

## 常见问题处理

### 端口被占用

1. **检查端口占用（Windows）**
   ```bash
   netstat -ano | findstr :3000
   netstat -ano | findstr :4000
   ```

2. **检查端口占用（Mac/Linux）**
   ```bash
   lsof -i :3000
   lsof -i :4000
   ```

3. **释放端口（Windows）**
   ```bash
   # 查找进程ID后
   taskkill /PID <进程ID> /F
   ```

4. **释放端口（Mac/Linux）**
   ```bash
   kill -9 <进程ID>
   ```

### 跨域问题

1. **确保后端CORS配置包含前端URL**
2. **检查请求头是否正确**
3. **验证环境变量是否生效**

### WebSocket连接问题

1. **确认WebSocket服务端口（4001）正常启动**
2. **检查防火墙设置**
3. **验证Socket.IO版本兼容性**

## 迁移指南

### 从旧端口配置迁移

1. **更新所有硬编码的端口引用**
   - 3000 → 3000（前端保持不变）
   - 3001 → 4000（后端API）
   - ws://localhost:3001 → ws://localhost:4001（WebSocket）

2. **更新环境配置文件**
3. **更新文档和测试脚本**
4. **通知团队成员更新本地配置**

## 测试验证

### 前端验证
```bash
# 访问前端
curl http://localhost:3000

# 测试API连接
curl http://localhost:4000/api/v1/health
```

### 后端验证
```bash
# 测试API
curl http://localhost:4000/api/v1/medicines

# 测试WebSocket（使用wscat）
wscat -c ws://localhost:4001/ws/orchestration
```

## 版本历史

- **v1.0** (2024-06-24): 初始版本，定义端口分配规范
  - 前端：3000-3009
  - 后端：4000-4009

## 注意事项

1. **生产环境应使用反向代理**，而非直接暴露端口
2. **开发环境端口配置应与生产环境分离**
3. **定期检查端口使用情况**，避免冲突
4. **更新防火墙规则**以允许新的端口范围 