# 塔罗占卜 · Tarot Whisper

一个面向 Z 世代的塔罗牌占卜网页应用。暗黑神秘风视觉，基于问答驱动的三张牌占卜体验。

## 功能

- **两种牌阵**：过去-现在-未来 / 身-心-灵，用户自由选择
- **问答驱动**：5 批问题 × 4 个选项，引导用户进入占卜状态
- **进度回溯**：问答过程中可随时返回修改答案
- **洗牌动画**：全屏卡牌飞旋动画，增强仪式感
- **3D 卡牌翻转**：CSS 3D 视角的卡牌翻转效果
- **完整解读**：每张牌的正/逆位含义 + 关键词 + 详细释义
- **历史记录**：localStorage 存储，可随时回顾历史占卜
- **中英文切换**：全界面中英文双语支持
- **图片导出**：将占卜结果保存为 PNG 图片

## 技术栈

- 纯 HTML + CSS + JavaScript (ES6 Modules)
- CSS Custom Properties 主题系统
- Canvas 星空的背景
- CSS 3D 动画（卡牌翻转）
- html2canvas（图片导出）
- localStorage（数据持久化）

## 使用

直接打开 `index.html` 即可使用（需通过 HTTP 服务器，因为使用了 ES6 Modules）。

本地开发：

```bash
# Python
python -m http.server 8080

# Node.js (npx)
npx serve .
```

## 部署到 GitHub Pages

1. 在 GitHub 创建仓库
2. 将本目录所有文件推送到仓库
3. 仓库 Settings → Pages → 选择 main 分支根目录
4. 访问 `https://<你的用户名>.github.io/<仓库名>/`

## 项目结构

```
tarot/
├── index.html          # 主入口
├── css/
│   ├── base.css        # 变量、重置、字体、星空
│   ├── components.css  # 按钮、卡牌、导航、弹窗
│   └── animations.css  # 动画 keyframes
├── js/
│   ├── app.js          # 核心逻辑、路由、渲染
│   ├── data.js         # 78 张塔罗牌数据、牌阵、问题
│   ├── card-engine.js  # 抽牌算法
│   ├── i18n.js         # 中英文字典
│   └── storage.js      # 本地存储、图片导出
└── README.md
```

## 自定义

### 修改问题

编辑 `js/data.js` 中的 `QUESTIONS` 数组，每批问题包含 `questionZh`、`questionEn` 和 4 个 `options`。

### 修改卡牌释义

编辑 `js/data.js` 中的 `CARDS` 数组，每张牌包含中英文的正位和逆位释义。

### 修改主题色

编辑 `css/base.css` 中的 `:root` 变量。
