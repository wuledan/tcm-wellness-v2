# TCM 养生站 — 现状 vs 预期差异分析

**域名**: tcmbody.com
**GitHub**: wuledan/tcm-wellness-v2
**技术栈**: Next.js 16 + Tailwind CSS 4 + Auth.js + Prisma/Neon + DeepSeek V4 Flash + Qwen-VL + Upstash Redis
**调研日期**: 2026-06-11
**调研方式**: 浏览器实测 + 源码审计 + Git log 分析

---

## 已实现且正常工作的 ✅

### 页面 / 路由
- **首页 (`/`)** — 完整 landing page：Hero + 痛点叙述 + Why TCM Food Therapy 对比 + How It Works 四步 + CTA
- **体质测试 (`/quiz`)** — 9道选择题，双语题目，进度跟踪（Question X of 9），AI 分析出结果
- **体质结果 (`/quiz/result`)** — 详细体质卡片（描述、饮食原则、推荐/避免食物、运动、生活方式建议、分享按钮）
- **食物扫描 (`/food-scan`)** — 文本输入 + 图片上传双模式，Quick buttons，AI 分析返回 TCM 属性 + 适合度
- **Learn 页 (`/learn`)** — 9种体质 Quick Reference 卡片（可展开），体质科普文章、症状解读、中西医对照、药食同源文章，4个分类
- **Daily 页 (`/daily`)** — 每日养生贴士（7天循环）、当前节气信息、饮食/生活方式建议、24节气日历网格
- **Dashboard (`/dashboard`)** — 个性化仪表盘：3餐建议、运动建议、生活方式建议、节气提示，AI 生成推荐
- **Profile (`/profile`)** — 体质信息展示 + 身体数据表单（身高/体重/年龄/性别/运动/睡眠）
- **About 页 (`/about`)** — 品牌营销长页面
- **登录页 (`/login`)** — 邮箱登录（MVP 模式）

### 核心功能
- **AI 体质分析** — `/api/quiz/analyze` 调用 DeepSeek V4 Flash，返回体质类型 + 置信度
- **AI 食物分析** — `/api/food/analyze` 两步：Qwen-VL 识别食物 → DeepSeek TCM 分析
- **AI 推荐生成** — `/api/recommend` 按体质+季节生成三餐/运动/生活方式推荐
- **24节气算法** — 天文算法计算（Meeus），准确性高
- **Auth.js 登录** — 邮箱认证，Prisma/Neon 存储用户数据
- **多语言 (i18n)** — 完整支持 EN / ZH / KO / VI，语言切换实时生效
- **Feedback 反馈** — 浮动反馈按钮，星级评分 + 分类，Upstash Redis 存储
- **Admin 后台** — 管理员面板：用户统计、注册趋势图（30天）、体质分布饼图、语言分布、最近注册
- **Admin 反馈管理** — 反馈列表展示

### 数据层
- **Prisma + Neon Postgres** — 用户、会话、QuizAttempt、FoodScan 表
- **Upstash Redis** — 反馈存储
- **500+ 食物数据库** — 9种体质的 cold/cool/neutral/warm/hot 匹配矩阵
- **9种体质完整数据** — 中英文描述、饮食原则、推荐/避免食物、运动、生活方式、症状

### SEO & 运维
- **sitemap.xml** + **robots.txt**
- **Vercel Analytics**
- **Vercel 部署**

---

## 已实现但有问题的 ⚠️

### 1. API Key 硬编码 —— 严重安全风险
- **文件**: `src/app/api/food/analyze/route.ts`、`src/app/api/quiz/analyze/route.ts`、`src/app/api/recommend/route.ts`
- **问题**: 三个 API route 中直接硬编码了 DeepSeek API Key (`sk-f0T5tXizIYzrLDB5L5kDJ0pwpfqdoRNxqE22aopWktYwYEdIFaVHMSuQ10f9ahJC`) 和 Qwen-VL API Key (`sk-16d61d52eba94add8bd6968c8c744df6`)
- **风险**: 源代码公开在 GitHub 上时，API Key 直接泄露。目前代码在 private repo，但仍有安全隐患
- **建议**: 应使用环境变量 `OPENAI_API_KEY` / `QWEN_API_KEY`

### 2. 体质结果需登录才能查看
- 完成 Quiz 9道题后，AI 分析完成直接跳转到 `/login?callbackUrl=%2Fquiz%2Fresult`
- **问题**: 用户匿名完成测试后，被强制要求登录才能看到结果，体验断崖
- **建议**: 应该允许未登录用户看到结果（同时提示登录保存），或把结果存在 localStorage 再提示登录

### 3. 体质数据仅存 localStorage，未从服务端拉取
- `getQuizResult()` 从 `localStorage.getItem("quizResult")` 读取
- **问题**: 登录后 Dashboard/Profile 页面不读取服务器端的 QuizAttempt 记录；换设备登录后数据丢失
- **建议**: 用户登录后应该从服务器拉取最近的 QuizResult

### 4. Profile 页面未做 Auth Guard
- Profile 页面没有检查登录状态，仅依赖 localStorage
- **问题**: 未登录用户访问 Profile 页面也可以看到表单（但没数据），缺少 Redirect 保护
- **建议**: 添加 `useSession()` 认证检查

### 5. Dashboard 显示 "Balanced body type" 但用户未登录
- 在未登录状态下访问 `/daily` 页面，显示 "For your Balanced body type"
- **问题**: 默认使用 "Balanced" 体质，但未提示"请完成测试获得个性化推荐"
- **建议**: 未检测到 quizResult 时，显示 CTA 引导去完成测试

### 6. README 未自定义
- README 仍是 Next.js `create-next-app` 的默认模板
- **问题**: 项目描述、技术栈、启动说明、功能列表全无
- **建议**: 补充项目 README（产品描述 + 技术栈 + 环境变量 + 启动说明）

### 7. 食物扫描页显示 "Results are simulated for MVP demo"
- 页脚有一行小字："Results are simulated for MVP demo. In production, AI vision analysis provides real-time identification."
- **问题**: 实际已经在使用 DeepSeek V4 做 AI 分析，这行免责声明已经过时且自相矛盾
- **建议**: 更新或移除该免责声明

### 8. 免费扫描次数限制（3次/天）未做防刷
- `Today's scans: X / 3 (Free)` 计数器显示在前端
- **问题**: 未看到后端验证逻辑，可能存在篡改风险
- **建议**: 确认限制逻辑在后端是否实现

---

## 未实现 / 缺失的 ❌

### 核心功能缺失

| 功能 | 预期 | 现状 |
|------|------|------|
| **进度追踪** | 长期体重、症状、习惯变化的图表追踪 | 无。Dashboard 只有当前快照 |
| **饮食日记 (Food Diary)** | 每日记录吃过的食物，回看饮食历史 | 无 |
| **症状日记** | 记录每日症状变化，与饮食关联 | 无 |
| **运动日志** | 运动记录 + 与体质推荐的关联 | 无 |
| **TCM 食谱库** | 按体质分类的食谱，步骤、食材、功效 | 无。仅有推荐食物列表 |
| **草本药材数据库** | 中药食材详细说明（性味归经、功效） | 无。仅有千篇一律的文章 |
| **症状自查工具** | 输入症状 → 匹配可能的体质类型 | 无 |
| **体质对比** | 不同体质的特征对比 | 无 |
| **PDF 健康报告** | 可下载的体质分析报告 | 无 |
| **社会化分享** | 分享结果到社交媒体（除基础 clipboard） | 仅在 quiz/result 有基础分享 |

### 用户系统缺失

| 功能 | 预期 | 现状 |
|------|------|------|
| **第三方 OAuth** | Google / GitHub / WeChat 登录 | 仅邮箱登录 |
| **邮件通知** | 每日养生贴士、节气提醒 | 无 |
| **Push 通知** | 浏览器通知提醒 | 无 |
| **密码重置** | 忘记密码流程 | 无（MVP 模式直接登录） |
| **用户设置** | 个人偏好设置 | 无 |

### 商业/运营缺失

| 功能 | 预期 | 现状 |
|------|------|------|
| **付费订阅 / 会员** | 解锁高级功能（无限扫描、深度分析） | 纯免费 |
| **广告变现** | Google AdSense（已有 ads.txt） | 有 ads.txt 但未嵌入广告 |
| **社区 / 论坛** | 用户交流讨论 | 无 |
| **TCM 医师查询** | 按地区搜索中医师 | 无 |
| **购物清单 / 电商** | 推荐食材一键购买 | 无 |

### 技术/运维缺失

| 功能 | 预期 | 现状 |
|------|------|------|
| **PWA** | 可安装到手机桌面、离线访问 | 无 |
| **Open Graph / 社交媒体预览** | `/about` 等页面有 OG 元数据 | 仅有基础 SEO |
| **错误监控** | Sentry 或类似监控 | 无 |
| **CI/CD 测试** | 构建前自动化测试 | 无 |
| **API 文档** | 前后端 API 文档 | 无 |
| **健康检查** | 服务健康监测 | 无 |

---

## 优先级建议

### 🔥 P0 — 马上修复（安全 + 核心体验）

| 优先级 | 项目 | 原因 |
|--------|------|------|
| P0 | **API Key 移至环境变量** | 硬编码的安全风险，私仓也要防误提交 |
| P0 | **匿名用户完成 Quiz 后直接显示结果** | 登录门槛让绝大多数用户流失 |
| P0 | **README 更新** | 当前 Build 前必须补充，属 AGENTS.md 质量门 |

### 🎯 P1 — 下一轮迭代（功能补齐）

| 优先级 | 项目 | 原因 |
|--------|------|------|
| P1 | **服务端 QuizResult 存储 + 拉取** | 解决换设备数据丢失问题 |
| P1 | **Profile 添加 Auth Guard** | 页面安全合规 |
| P1 | **Dashboard/Daily 未做题时的 CTA 引导** | 新人引导 |
| P1 | **移除 "模拟" 免责声明** | 与实际情况矛盾 |
| P1 | **Google AdSense 广告嵌入** | 已有 ads.txt，零成本变现 |
| P1 | **Open Graph / Social Preview** | 社交媒体分享预览 |

### 📅 P2 — 远期规划

| 优先级 | 项目 | 原因 |
|--------|------|------|
| P2 | **饮食日记 + 症状日记** | 核心黏性功能，让用户每天回来 |
| P2 | **PWA 支持** | 移动端安装，提升留存 |
| P2 | **第三方 OAuth 登录** | 降低登录门槛 |
| P2 | **付费订阅体系** | 3次/天免费，付费解锁无限扫描 |
| P2 | **食谱库** | 按体质推荐的具体食谱，增加价值 |
| P2 | **邮件/推送通知** | 每日提醒，提升活跃 |
| P2 | **PDF 健康报告** | 导出分享，增加传播 |
| P2 | **社区论坛** | 用户 UGC，SEO 内容积 |
| P2 | **错误监控 (Sentry)** | 被动发现生产问题 |

---

## 总结

TCM 养生站已经是一个**功能完整的 MVP**，9个页面全部可用，AI 分析（体质 + 食物 + 推荐）真实调用 DeepSeek 和 Qwen 模型，4语言支持完整，有完善的 Admin 后台和反馈系统。

**最大短板是用户留存路径**：匿名用户完成 Quiz 后被强制登录，丢失率高。其次是**安全硬伤**（API Key 硬编码）和**进展追踪缺失**（缺少让用户每天回来的习惯打卡/饮食日志）。

当前 Build 通过 ✅，可以上线正常运营。建议下一轮迭代优先修复 P0 问题，再补 P1 功能。
