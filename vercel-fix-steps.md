# Vercel构建问题修复步骤

## 问题描述

Vercel构建时出现了TypeScript类型错误：
```
[19:15:18.864] ./src/components/admin/medicines/MedicineDetailDialog.tsx:59:50
[19:15:18.865] Type error: Property 'stock' does not exist on type 'Medicine'.
```

## 诊断结果

经过检查，我们发现：
1. Medicine类型定义中已包含`stock`字段
2. MedicineDetailDialog组件中正确使用了`medicine.stock`
3. 本地文件显示编码问题（包含中文的地方显示为乱码），这可能导致Vercel在处理时无法正确读取类型定义
4. Vercel可能在使用缓存的旧类型定义，未能正确反映最新的变更

## 解决方案（依优先级排序）

### 方案1：添加Vercel环境变量以跳过构建缓存（推荐）

1. 登录Vercel控制台
2. 进入项目设置 -> Environment Variables
3. 添加以下环境变量：
   - 名称: `VERCEL_FORCE_NO_BUILD_CACHE`
   - 值: `1`
4. 点击"Save"保存环境变量
5. 回到"Deployments"页面
6. 点击"Redeploy"按钮重新部署项目

### 方案2：使用redeploy选项手动跳过缓存

1. 在Vercel仪表板中找到失败的部署
2. 点击部署右上角的"..."菜单
3. 选择"Redeploy"
4. 在弹出的窗口中，取消勾选"Use existing Build Cache"选项
5. 点击"Redeploy"按钮

### 方案3：修复编码问题并增强代码健壮性

如果上述方法仍然不能解决问题，可能需要处理编码问题：

1. 确保所有文件使用UTF-8编码保存
2. 修改MedicineDetailDialog.tsx组件，增加额外的空值检查：
   ```tsx
   <div className="text-sm">{medicine?.stock ?? '-'} {medicine?.stock ? '克' : ''}</div>
   ```

3. 同时修改Medicine类型定义，确保字段定义更明确：
   ```tsx
   export interface Medicine {
     // ... 其他字段
     stock?: number | null;        // 库存量（克）
     properties?: string | null;   // 药性（与property字段兼容）
     // ... 其他字段
   }
   ```

## 长期解决方案

为避免类似问题再次发生，建议：

1. 添加TypeScript构建检查到CI流程，确保类型正确
2. 清理任何包含非ASCII字符的注释，使用英文注释或仅保留必要的中文
3. 确保所有团队成员使用相同的编码设置和编辑器配置
4. 考虑在项目中使用ESLint来强制执行代码风格和类型规范 