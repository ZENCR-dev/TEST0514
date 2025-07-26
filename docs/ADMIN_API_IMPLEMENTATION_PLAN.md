# 后端管理员API开发计划与进度

本文档用于跟踪和记录为前端测试工具集提供支持的后端API的开发过程。

**最新更新**: 2025年6月22日

**状态**: 计划已审批，开始执行。

---

## 1. 目标

为前端团队提供一个由管理员权限保护的API端点，用于批量创建不同角色的测试账户，以支持多角色联调测试。

## 2. API 规格

- **Method:** `POST`
- **URL:** `/api/v1/users/admin/batch-create`
- **Authentication:** `Bearer Token` (JWT) 必须提供。
- **Authorization:** 调用者必须拥有 `admin` 角色。
- **Request Body:**
  ```json
  {
    "users": [
      {
        "email": "test.practitioner@example.com",
        "password": "password123",
        "role": "practitioner"
      },
      {
        "email": "test.pharmacy@example.com",
        "password": "password123",
        "role": "pharmacy_operator"
      }
    ]
  }
  ```
- **Success Response (`201 Created`):**
  ```json
  {
    "success": true,
    "data": {
      "createdUsers": [
        { "id": "user-id-1", "email": "test.practitioner@example.com", "role": "practitioner" },
        { "id": "user-id-2", "email": "test.pharmacy@example.com", "role": "pharmacy_operator" }
      ],
      "failedUsers": []
    }
  }
  ```

---

## 3. 后端实现清单

| 状态 | 任务 | 负责人 | 预计完成时间 |
| :---: | :--- | :---: | :---: |
| [x] | **1. 创建`AdminController`**: 在 `src/user/` 目录下创建 `admin.controller.ts`。 | Gemini | - |
| [x] | **2. 创建`AdminService`**: 在 `src/user/services/` 目录下创建 `admin.service.ts`。 | Gemini | - |
| [x] | **3. 创建`BatchCreateUsersDto`**: 在 `src/user/dto/` 目录下创建 `batch-create-users.dto.ts`。 | Gemini | - |
| [x] | **4. 实现Controller方法**: 在 `AdminController` 中创建 `batchCreateUsers` 方法，并应用权限守卫和DTO。| Gemini | - |
| [x] | **5. 实现Service逻辑**: 在 `AdminService` 中注入并复用现有服务，实现批量创建和密码哈希逻辑。| Gemini | - |
| [x] | **6. 更新`UserModule`**: 将新的 `AdminController` 和 `AdminService` 注册到 `user.module.ts`。 | Gemini | - |
| [x] | **7. 更新API文档**: 将新端点添加到 `API文档.md`。 | Gemini | - |

---

**下一步**: 所有开发任务已完成。等待前端进行联调测试。 