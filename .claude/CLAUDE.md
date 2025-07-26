# CLAUDE.md - MVP Development Progress

## 📋 Current Status

**Last Updated**: 2025-07-22  
**Current Phase**: MVP1.9 Guest Mode Development Planning  
**Development Branch**: Grey-test-July (pending creation)  

---

## 🎯 MVP1.9 Guest Mode Development Plan

### Project Overview
Transform MVP2.2's Mock environment module into Guest Mode for gray testing, providing standalone frontend prescription generation tools.

### TDD Strategy Implementation

#### Core Testing Philosophy
- **Test-First Development**: Write comprehensive test specifications before implementation
- **Coverage-Driven**: Ensure >85% test coverage across all modules
- **Behavioral Testing**: Focus on user behavior and business logic validation
- **Integration Testing**: Validate end-to-end Guest mode workflows

---

## 🏗️ RIPER Mode Declaration Requirement 
YOU MUST BEGIN EVERY SINGLE RESPONSE WITH YOUR CURRENT MODE IN BRACKETS. NO EXCEPTIONS.       
Format: [MODE: MODE_NAME]                                    

Available Modes:                 
- **RESEARCH**: Information gathering and deep understanding 
- **INNOVATE**: Brainstorming potential approaches 
- **PLAN**: Creating exhaustive technical specification 
- **EXECUTE**: Implementing EXACTLY what was planned 
- **REVIEW**: Ruthlessly validate implementation against plan 

---

## 🎯 Project Context            
- **Project**: 新西兰中医药电子处方平台 MVP 2.0 
- **Tech Stack**: Next.js 13+, React 18, TypeScript, Tailwind CSS, Zustand                    
- **Current Phase**: MVP1.9 Guest Mode Development Planning 
- **Architecture**: Prescription-centered architecture (已从Order-centered迁移)               

---

## 📋 四层任务管理体系 (Task Hierarchy System)

**层级1: PRPs（项目级基石文档）**
- **指定文档**: `docs/MVP1.9-PRD-Guest-Mode.md`
- **特征**: 改动频次低，影响范围广
- **功能**: 项目总体需求和阶段划分，每个阶段映射到不同的层级2 Checklist
- **维护方式**: 单一文档记录项目级里程碑和螺旋式开发阶段
- **当前阶段**: MVP1.9 Guest Mode Development

**层级2: Checklist（阶段级基石文档）**
- **指定文档**: `docs/MVP1.9-SOP-Implementation.md`
- **伴生文档**: `@docs/MVP1.9-Checklist.md`（推荐创建）
- **特征**: 改动频率低，影响范围中等
- **功能**: 阶段性任务序列和里程碑管理，基于RIPER工作流
- **维护方式**: 单一文档或伴生文档记录Phase级任务清单
- **当前焦点**: Guest Mode TDD Development

**层级3: 进度日志（阶段级记录文档）**
- **指定文档**: `@PROGRESS_MVP2.0.md`
- **特征**: 改动频率高，不影响项目实体
- **功能**: 记录开发进展和会话成果
- **维护方式**: 单一文档记录执行进度和成果指标
- **当前状态**: 转向Guest Mode开发，TDD策略实施

**层级4: Todos（临时工具）**
- **生成方式**: CLI或IDE内置todowrite自动生成
- **特征**: 最低级别临时性工具，执行完即废弃
- **功能**: 基于上述三层分析生成的具体执行步骤
- **来源**: 分析任务树和开发要求临时生成
- **执行**: 严格遵照执行，不允许偏离

### 任务管理工作流

**任务起始流程:**
1. 检查 `docs/MVP1.9-PRD-Guest-Mode.md` 确定当前项目阶段
2. 查阅 `docs/MVP1.9-SOP-Implementation.md` 获取阶段性任务序列
3. 查看 `@PROGRESS_MVP2.0.md` 了解已完成任务和当前状态
4. 基于任务树分析生成当前Todos

**任务执行流程:**
1. 严格按照生成的Todos执行
2. 每完成一组Todos进行一次日志记录
3. 日志中必须定位该Todos来自任务树的哪一层级
4. 更新进度状态和下一步计划

**任务结束流程:**
1. 验证Todos完成情况
2. 更新相应层级的文档状态
3. 记录成果和遇到的问题
4. 为下一轮任务做准备

### 层级关系和定位方法
- **PRPs → Checklist**: 项目目标分解为阶段任务
- **Checklist → Progress Logs**: 阶段任务转化为具体进度
- **Progress Logs → Todos**: 当前状态生成执行步骤
- **Todos → Progress Logs**: 执行结果反馈到进度记录

---

## ⚡ MVP Project Specific Rules                             

### TCM Platform Development Standards  
- **Prescription-Centered Architecture**: All features revolve around prescription entity     
- **Privacy Compliance**: No patient information storage, anonymous processing only 
- **Payment Integration**: Support both balance payment and Stripe recharge 
- **Role-Based Access**: practitioner, pharmacy_operator, admin, patient roles                
- **API Compatibility**: Maintain v3.2 API standard with unified response format              

### Development Workflow         
1. **Always check current project status** in PROGRESS_MVP2.0.md
2. **Follow RIPER mode declarations** for all development tasks 
3. **Use appropriate personas** for domain-specific work 
4. **Maintain test coverage** - current target: 85%+ for Guest mode modules 
5. **Document all changes** in progress tracking files       

### Quality Standards            
- **TypeScript Strict Mode**: All code must pass strict type checking 
- **Test Coverage**: Minimum 85% for Guest mode features, 95% for core modules 
- **Code Review**: Use RIPER methodology for all changes 
- **Security**: Guest mode security validation for route protection        

---

## 🏗️ Core Configuration         
@include shared/superclaude-core.yml#Core_Philosophy 
@include shared/superclaude-core.yml#Evidence_Based_Standards  
@include shared/superclaude-core.yml#Token_Economy           

## 🧠 Cognitive Personas (13 Available)  
@include shared/superclaude-personas.yml#All_Personas 

## ⚡ SuperClaude Commands (19 Available) 
@include shared/superclaude-commands.yml#All_Commands        

### Development Commands (3)     
- `/build` - Project builder with stack templates 
- `/dev-setup` - Development environment setup 
- `/test` - Testing framework and execution                  

### Analysis & Improvement Commands (5)  
- `/analyze` - Code and system analysis 
- `/review` - AI-powered code review with evidence 
- `/troubleshoot` - Debugging and issue resolution 
- `/improve` - Enhancement and optimization 
- `/explain` - Documentation and explanations                

### Operations Commands (6)      
- `/deploy` - Application deployment planning 
- `/scan` - Security and validation audits 
- `/migrate` - Database and code migrations 
- `/estimate` - Project estimation and planning 
- `/cleanup` - Project maintenance tasks 
- `/git` - Git workflow management                           

### Design & Workflow Commands (5)  
- `/design` - System architecture planning 
- `/spawn` - Parallel task execution      
- `/document` - Documentation creation   
- `/load` - Project context loading     
- `/task` - Task management and tracking                     

## 🚩 Universal Flags (Available on ALL Commands)             

### Thinking Depth Control       
- `--think`: Multi-file analysis with expanded context (~4K tokens) 
- `--think-hard`: Architecture-level depth analysis (~10K tokens) 
- `--ultrathink`: Critical system analysis with maximum depth (~32K tokens) 

### MCP Server Control           
- `--c7`: Enable Context7 documentation lookup 
- `--seq`: Enable Sequential thinking analysis 
- `--magic`: Enable Magic UI component generation 
- `--pup`: Enable Puppeteer browser automation               

## 🔧 SuperClaude Commands and Personas

### Universal Persona Flags (Available on ALL Commands)  
- `--persona-architect`: System design and architecture thinking  
- `--persona-frontend`: UX/UI focused development approach 
- `--persona-backend`: Server systems and API development 
- `--persona-security`: Security-first analysis approach 
- `--persona-analyzer`: Root cause analysis and debugging 
- `--persona-qa`: Quality assurance and testing focus 
- `--persona-performance`: Optimization and performance tuning 
- `--persona-refactorer`: Code quality and maintainability 
- `--persona-mentor`: Knowledge sharing and documentation    

### MVP Project Specific Personas      
- `--persona-tcm-expert`: Traditional Chinese Medicine prescription logic 
- `--persona-payment-specialist`: Stripe and balance payment systems 
- `--persona-api-integrator`: Frontend-backend integration specialist 
- `--persona-test-engineer`: Jest and E2E testing optimization 

---

## 📝 Example Workflows                                      

### TDD Guest Mode Development         
```bash                          
[MODE: RESEARCH] Load project context and analyze Guest mode requirements
[MODE: PLAN] Create comprehensive test specifications for Guest mode
[MODE: EXECUTE] Implement tests first, then implementation
[MODE: REVIEW] Validate implementation against test specifications
```

### API Integration                                       
```bash
[MODE: RESEARCH] Analyze integration points for Guest mode
[MODE: INNOVATE] Design Guest mode API interaction patterns  
[MODE: PLAN] Create integration test specifications
[MODE: EXECUTE] Implement Guest mode API integration
[MODE: REVIEW] Validate Guest mode API functionality
```

---

## 🔄 GitHub同步开发进度管理

### Checkpoint Restore核心原则
- **精简提交**: 每次commit内容简短聚焦
- **命令行优先**: 全部使用git命令行工具实现
- **进度同步**: 实现跨设备开发状态恢复

### 标准Git工作流

#### 开发检查点创建
```bash
# 快速状态检查
git status --short

# 添加变更文件
git add .

# 精简提交格式
git commit -m "feat: [功能简述]" 
git commit -m "fix: [问题简述]"
git commit -m "docs: [文档更新]"
git commit -m "refactor: [重构内容]"

# 推送检查点
git push origin [branch-name]
```

#### 检查点恢复流程
```bash
# 拉取最新状态
git fetch origin

# 恢复到最新检查点
git reset --hard origin/[branch-name]

# 查看最近3次检查点
git log --oneline -3

# 恢复到特定检查点
git reset --hard [commit-hash]
```

#### 分支同步策略
```bash
# 创建功能分支
git checkout -b feature/[简短描述]

# 定期同步主分支
git fetch origin main
git rebase origin/main

# 合并到主分支
git checkout main
git merge --no-ff feature/[简短描述]
git push origin main
```

### 提交消息规范
- **feat**: 新功能 (≤50字符)
- **fix**: 错误修复 (≤50字符)  
- **docs**: 文档更新 (≤50字符)
- **style**: 代码格式 (≤50字符)
- **refactor**: 代码重构 (≤50字符)
- **test**: 测试相关 (≤50字符)
- **chore**: 构建/工具 (≤50字符)

---

**SuperClaude v2.0.1 for MVP TCM Platform | TDD methodology | RIPER workflow integration | Guest Mode Development**