# 千岛小程序基础模板 (api 仅内网可支持版)

基于 Taro 4.x + Vue 3 + Vite + Tailwind CSS 的千岛小程序开发模板，提供开箱即用的开发环境和常用工具封装。

## 技术栈

| 技术         | 版本  | 说明            |
| ------------ | ----- | --------------- |
| Taro         | 4.1.5 | 跨端开发框架    |
| Vue          | 3.x   | 前端框架        |
| Vite         | 4.x   | 构建工具        |
| Tailwind CSS | 3.4.x | 原子化 CSS 框架 |
| TypeScript   | -     | 类型支持        |
| pnpm         | -     | 包管理器 (推荐) |

## 核心能力

### 原子化 CSS (Tailwind CSS)

项目集成 Tailwind CSS，支持原子化样式开发：

```vue
<template>
  <view class="flex flex-col items-center justify-center h-screen bg-gray-100">
    <text class="text-2xl font-bold text-gray-800 mb-4">Hello World</text>
    <text class="text-base text-gray-500">欢迎使用千岛小程序</text>
  </view>
</template>
```

**配置文件**:

- `tailwind.config.js` - Tailwind 主配置

### 网络请求

基于 `flyio` 封装，内置以下能力：

- **环境检测**: 集成 `echco-effuse`，自动适配 App/H5/小程序环境
- **Token 管理**: 自动从 URL 参数或本地存储获取并注入 Token

### 环境适配

内置多环境检测工具函数：

```javascript
import { isApp, isH5, isWxMp, isQQMp, isMp, getEnv } from "@/utils";

isApp(); // 是否千岛 App 环境
isH5(); // 是否 H5 环境
isWxMp(); // 是否微信小程序
isQQMp(); // 是否 QQ 小程序
isMp(); // 是否小程序环境
getEnv(); // 获取当前环境 (production/development)
```

## 快速开始

### 环境要求

- Node.js >= 20.0.0
- pnpm (推荐) 或 npm

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
pnpm dev

```

### 构建部署

```bash
# 构建
pnpm build

# 构建并上传到千岛小程序平台
pnpm upload
```

## 项目结构

```
├── config/                  # Taro 配置目录
│   ├── index.js             # 主配置
│   ├── dev.js               # 开发环境配置
│   └── prod.js              # 生产环境配置
├── src/
│   ├── apis/                # API 层
│   │   ├── index.ts         # HTTP 服务封装 & 拦截器
│   │   └── user.ts          # 用户相关 API (示例)
│   ├── constants/           # 常量定义
│   │   └── index.ts         # CLIENT_PACKAGE_ID 等
│   ├── utils/               # 工具函数
│   │   ├── index.js         # 环境检测、UUID、参数解析等
│   │   └── fly.js           # flyio 实例生成
│   ├── pages/               # 页面目录
│   │   └── index/           # 首页
│   ├── app.js               # 应用入口
│   ├── app.config.js        # 应用配置 (路由、窗口等)
│   └── app.css              # 全局样式 (Tailwind 入口)
├── tailwind.config.js       # Tailwind CSS 配置
├── postcss.config.js        # PostCSS 配置
├── project.config.json      # 微信小程序项目配置
├── qdmp.json                # 千岛小程序配置
└── package.json
```

## Tailwind CSS 使用

### 基础用法

直接在模板中使用 Tailwind 类名：

```vue
<template>
  <view class="p-4 bg-white rounded-lg shadow-md">
    <text class="text-lg font-semibold text-primary">标题</text>
    <text class="mt-2 text-sm text-gray-600">描述内容</text>
  </view>
</template>
```

### 自定义主题

在 `tailwind.config.js` 中扩展主题：

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: "#6366f1",
        secondary: "#64748b",
        brand: "#ff6b00",
      },
      spacing: {
        // 添加自定义间距
        18: "4.5rem",
      },
    },
  },
};
```

### 常用类名速查

| 类名                               | 说明      |
| ---------------------------------- | --------- |
| `flex` / `flex-col`                | Flex 布局 |
| `items-center` / `justify-center`  | 居中对齐  |
| `p-4` / `px-4` / `py-4`            | 内边距    |
| `m-4` / `mx-4` / `my-4`            | 外边距    |
| `text-lg` / `text-xl` / `text-2xl` | 字体大小  |
| `font-bold` / `font-semibold`      | 字重      |
| `text-gray-500` / `text-primary`   | 文字颜色  |
| `bg-white` / `bg-gray-100`         | 背景颜色  |
| `rounded-lg` / `rounded-full`      | 圆角      |
| `shadow-md` / `shadow-lg`          | 阴影      |
| `w-full` / `h-screen`              | 宽高      |

## API 使用

### 基础请求

```typescript
import { apiFetch } from "@/apis";

// GET 请求
const data = await apiFetch.get("/api/endpoint", { params });

// POST 请求
const result = await apiFetch.post("/api/endpoint", { body });
```

### 添加新 API

在 `src/apis/` 目录下创建新文件：

```typescript
// src/apis/example.ts
import { apiFetch } from "./index";

export async function getExampleData(id: number) {
  return apiFetch.get("/api/example", { id });
}

export async function createExample(data: object) {
  return apiFetch.post("/api/example", data);
}
```

## 配置说明

### 千岛小程序配置 (qdmp.json)

可以根目录下通过运行 qdmp init -a <yourAppId> 创建 qdmp.json 文件

```json
{
  "name": "小程序名称",
  "appId": "千岛小程序 AppId"
}
```

## 开发规范

### 代码规范

- **ESLint**: 使用 `eslint-config-taro` + `eslint-plugin-vue` 规则
- **Stylelint**: 使用 `stylelint-config-standard` 规则

### Git 提交规范

使用 Conventional Commits 格式，由 `commitlint` + `husky` 自动校验：

```
feat: 新功能
fix: 修复 bug
docs: 文档更新
style: 代码格式 (不影响功能)
refactor: 重构
test: 测试相关
chore: 构建/工具相关
```

### 路径别名

已配置以下路径别名：

```javascript
'@'          -> 'src/'
'@/apis'     -> 'src/apis/'
'@/utils'    -> 'src/utils/'
'@/constants'-> 'src/constants/'
```

## 常见问题

### Q: 如何在 App 中获取 Token？

模板会自动从以下来源获取 Token：

1. App 环境：通过 `effuse.tokenSync("TOKEN")` 获取（effuse 来自 echco-effuse）
2. URL 参数：`?token=xxx`
3. localStorage：`TOKEN` 字段

### Q: 如何添加新页面？

1. 在 `src/pages/` 下创建页面目录和文件
2. 在 `src/app.config.js` 的 `pages` 数组中注册路由

```javascript
export default defineAppConfig({
  pages: [
    "pages/index/index",
    "pages/newPage/index", // 新增
  ],
});
```

### Q: Tailwind 类名不生效？

确保：

1. `src/app.css` 中包含 `@tailwind` 指令
2. `tailwind.config.js` 的 `content` 配置正确
3. 重新运行 `pnpm dev`

## 相关链接

- [Taro 文档](https://taro-docs.jd.com/)
- [Vue 3 文档](https://vuejs.org/)
- [Tailwind CSS 文档](https://tailwindcss.com/)
- [千岛开放平台](https://mp.qiandao.com/)
