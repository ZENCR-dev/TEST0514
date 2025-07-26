# API 文档目录

## 📚 最新API文档

### 主要文档

1. **[UNIFIED_API_DOCUMENTATION.md](./UNIFIED_API_DOCUMENTATION.md)** - 统一API文档
   - **版本**: v3.3 (最新隐私合规版)
   - **状态**: 生产就绪 ✅
   - **更新**: 2025-07-12
   - **说明**: 这是项目的权威API文档，包含所有后端API接口定义

2. **[API_CHANGELOG.md](./API_CHANGELOG.md)** - API变更日志
   - **说明**: 记录所有API相关的修改、新增、删除操作时间线
   - **最新**: v3.3 Stage 4 API文档同步完成
   - **用途**: 追踪API演进历史，了解版本间差异

## 🔄 版本历史

### v3.3 - 隐私合规升级 (2025-07-12)
- ✅ **隐私合规**: 完全移除患者个人信息字段
- ✅ **字段标准化**: amounts→copies, quantity→weight, totalAmount→totalPrice
- ✅ **架构简化**: 移除Order表格依赖，以Prescription为核心
- ✅ **文档同步**: Swagger文档与实现100%一致

### v3.2 - 架构优化 (2025-07-11)
- 移除clinic依赖，基于practitioner直接关联
- 患者信息字段精简，保留必要字段
- 并发性能优化，响应时间<200ms

## 🛠️ 使用指南

### 开发者集成

1. **API基础信息**
   - 基础URL: `http://localhost:4000`
   - API前缀: `/api/v1`
   - Swagger文档: `http://localhost:4000/api/docs`

2. **认证方式**
   ```http
   Authorization: Bearer <jwt_token>
   ```

3. **内容类型**
   ```http
   Content-Type: application/json
   ```

### 前端集成注意事项

1. **字段映射**（API v3.3）
   - 使用 `copies` 替代 `amounts`（帖数）
   - 使用 `weight` 替代 `quantity`（克重）
   - 使用 `totalPrice` 替代 `totalAmount`（总价）

2. **隐私合规**
   - 前端不应期望接收患者个人信息
   - 处方API不包含患者姓名、电话等字段
   - 使用处方ID作为唯一标识

3. **错误处理**
   - 统一错误响应格式
   - 包含错误代码、消息和详细信息
   - 支持国际化错误消息

## 📞 技术支持

- **API问题**: 查看 [API_CHANGELOG.md](./API_CHANGELOG.md)
- **集成问题**: 参考 [UNIFIED_API_DOCUMENTATION.md](./UNIFIED_API_DOCUMENTATION.md)
- **版本升级**: 遵循变更日志中的迁移指南

---

**最后更新**: 2025-07-12  
**维护者**: TCM Platform Development Team 