# 角色枚举统一说明

## 新角色枚举

- `admin`：管理员
- `practitioner`：医生/执业者
- `pharmacy_operator`：药房操作员
- `patient`：患者（预留，MVP2启用）

## 用途
- 所有前后端接口、鉴权、Mock数据、测试、页面权限判断均使用上述枚举
- 不再存在任何映射或大小写转换

## 前后端一致性
- 后端API响应字段 `role` 仅返回上述小写字符串
- 数据库、契约测试、前端类型定义全部同步

## 典型用法
```ts
// 类型定义
export type UserRole = 'admin' | 'practitioner' | 'pharmacy_operator' | 'patient';

// 权限判断
if (user.role === 'practitioner') { /* 医生专用功能 */ }

// 白名单
const allowedRoles = ['admin', 'pharmacy_operator'];
```

## 历史兼容
- 旧数据已通过一次性迁移自动升级
- 旧文档已标记为DEPRECATED 