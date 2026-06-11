# TCM 养生站 — 修复排期执行计划

**版本**: v1.0 | **制定日期**: 2026-06-11 | **预计工期**: 4 天

---

## Phase 0: P0 紧急修复（2 天）

### Task 0.1 — API Key 移动到环境变量

**文件**: 3 个 route 文件
- `src/app/api/food/analyze/route.ts` — 硬编码 QWEN_API_KEY + DS_API_KEY
- `src/app/api/quiz/analyze/route.ts` — 硬编码 DeepSeek API_KEY
- `src/app/api/recommend/route.ts` — 硬编码 DeepSeek API_KEY

**方案**:
1. 在 `.env.local.example` 添加 `QWEN_API_KEY` 变量名
2. 三个 route 改为 `process.env.QWEN_API_KEY` / `process.env.OPENAI_API_KEY`
3. 在 Vercel Dashboard 更新 Environment Variables

**工作量**: 15 min (代码改动) + 5 min (Vercel 配置) = **20 min**
**风险**: 无（纯重构）

---

### Task 0.2 — Quiz 完成后直接显示结果（匿名用户可看）

**当前流程缺陷**:
1. Quiz 页面调用 `/api/quiz/analyze`
2. API 需要 auth session（虽然非必需）
3. AI 结果返回 → 存 localStorage → push `/quiz/result`
4. 但如果 API 返回非 200，fallback 到本地 `calculateQuizResult`
5. **实测中 API 返回 502**（可能因为 auth 或 API key 不一致）

**修复方案**:

**A. 确保 API 正常返回（高优）**
- 确保 `/api/quiz/analyze` 不需要 session 也能正常工作
- 确认 API key 在 Vercel 环境变量中存在
- 添加合理的错误处理（当前现有 `catch` 块已处理部分）

**B. 添加本地 fallback 保障**
- `calculateQuizResult()` 已经存在，但它用的是 `constitution_value` 字符串做匹配
- 确保本地算法能够正确给出体质结果

**C. 认证流程优化**
- 结果页显示结果 + 同时显示 "登录保存结果" 按钮
- 登录后从 localStorage 同步到服务器

**工作量**: 半天（含测试）
**文件修改**: `src/app/quiz/page.tsx`、`src/app/quiz/result/page.tsx`

---

## Phase 1: 核心体验优化（1 天）

### Task 1.1 — 服务端 QuizResult 持久化

**当前问题**: 结果仅存 localStorage，换设备丢失

**方案**:
1. QuizResult 成功后，尝试 POST 到 `/api/quiz/save` 新 route
2. Profile/Dashboard 页面增加服务器端数据加载（优先于 localStorage）
3. 登录后在后台自动同步 localStorage → 服务器

**文件修改**:
- 新增 `src/app/api/quiz/save/route.ts`
- 修改 `src/app/dashboard/page.tsx` — 添加服务器端数据源
- 修改 `src/app/profile/page.tsx` — 添加服务器端数据源

**工作量**: 0.5 天

---

### Task 1.2 — Profile 添加 Auth Guard

**方案**: 在 Profile 页面添加 `useSession()` + 未登录时 `router.push("/login?callbackUrl=/profile")`

**文件**: `src/app/profile/page.tsx`
**工作量**: 15 min

---

### Task 1.3 — Dashboard/Daily 未做题引导

**方案**: 在 `/daily` 页面检测 `getQuizResult()` 为空时，显示 banner "完成体质测试获取个性化建议 → /quiz"

**文件**: `src/app/daily/page.tsx`
**工作量**: 30 min

---

### Task 1.4 — 移除过时免责声明 + 更新 README

**方案**:
- Food-scan 页面移除 "Results are simulated for MVP demo" 文本
- README 替换为项目真实描述（产品简介 + 技术栈 + 环境变量 + 启动说明）

**文件**: `src/app/food-scan/page.tsx`、`README.md`
**工作量**: 20 min

---

## Phase 2: 运营/增长功能（1 天）

### Task 2.1 — Google AdSense 广告嵌入

**已有条件**: `public/ads.txt` 已存在

**方案**: 在 `layout.tsx` 中添加 AdSense 脚本 + 在合适位置嵌入广告单元

**文件**: `src/app/layout.tsx`
**工作量**: 30 min

---

### Task 2.2 — Open Graph / Social Preview

**方案**: 在 `layout.tsx` 中添加完整的 OG 元标签（title, description, image, url, type）

**文件**: `src/app/layout.tsx`
**工作量**: 15 min

---

### Task 2.3 — 食物扫描 3次/天 后端防刷

**方案**:
1. 确认后端是否实现了扫描次数限制
2. 如未实现，使用 Upstash Redis 按 user/IP 统计每日扫描次数
3. 在 food/analyze route 中校验

**文件**: `src/app/api/food/analyze/route.ts`
**工作量**: 1 小时

---

## 执行总览

| 阶段 | 任务 | 工时 | 依赖 | 交付物 |
|------|------|------|------|--------|
| **P0** | 0.1 API Key 环境变量 | 20min | 无 | 安全修复 |
| **P0** | 0.2 Quiz 匿名结果 | 4h | 0.1 | 体验修复 |
| **P1** | 1.1 服务端持久化 | 4h | 0.1 | 功能补全 |
| **P1** | 1.2 Profile Auth Guard | 15min | 无 | 安全修复 |
| **P1** | 1.3 未做题引导 | 30min | 无 | 体验优化 |
| **P1** | 1.4 移除旧声明+README | 20min | 无 | 文档修复 |
| **P2** | 2.1 AdSense 嵌入 | 30min | 无 | 变现 |
| **P2** | 2.2 OG 标签 | 15min | 无 | SEO |
| **P2** | 2.3 扫描防刷 | 1h | 无 | 安全 |

**总工时**: 约 11 小时（2-3 个工作日）

---

## 开发方式建议

```
Phase 0 → 由 Claude Code 直接执行
  0.1 -> sessions_spawn: "claude --permission-mode bypassPermissions" 改 3 个 route 文件
  0.2 -> sessions_spawn: 修复 quiz 流程 + 确保 API 可用

Phase 1 → 由 Claude Code 分 3 个 sub-agent 并行执行
  1.1 -> sessions_spawn: 服务端持久化
  1.2+1.3+1.4 -> sessions_spawn: 体验优化（小任务合并）

Phase 2 → 由 Claude Code 执行
  2.1+2.2+2.3 -> sessions_spawn: 运营功能（合并）
```

每次执行后 `npm run build` 确保 0 errors，然后 `git commit`。
