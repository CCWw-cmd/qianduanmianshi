# GitHub Pages 部署指南

## 部署步骤

### 1. 在GitHub上创建新仓库
1. 访问 https://github.com/new
2. 创建名为 `interview` 的仓库（仓库名必须与配置文件中的 `base: '/interview/'` 一致）

### 2. 连接到远程仓库并推送代码

```bash
# 添加远程仓库
git remote add origin https://github.com/你的用户名/interview.git

# 添加所有文件
git add .

# 提交更改
git commit -m "initial commit"

# 推送到GitHub
git branch -M main
git push -u origin main
```

### 3. 配置GitHub Pages设置
1. 进入你的仓库页面
2. 点击 "Settings" → "Pages"
3. 在 "Source" 部分选择 "GitHub Actions"

### 4. 自动部署
推送代码后，GitHub Actions会自动：
1. 安装依赖
2. 构建VitePress项目
3. 部署到GitHub Pages

### 5. 访问你的网站
部署完成后，访问：https://[你的用户名].github.io/interview/

## 自定义配置

如果你修改了仓库名称，需要更新以下文件：

1. **`docs/.vitepress/config.mjs`** 中的 `base` 路径：
   ```javascript
   base: process.env.NODE_ENV === 'production' ? '/新仓库名/' : '/',
   ```

2. **`.github/workflows/deploy.yml`** 中的仓库URL

## 注意事项

1. **首次部署**：可能需要几分钟才能生效
2. **强制HTTPS**：GitHub Pages会自动启用HTTPS
3. **自定义域名**：可以在GitHub Pages设置中添加自定义域名

## 故障排除

### 常见问题

1. **404错误**：确保仓库名与`base`路径配置一致
2. **构建失败**：检查GitHub Actions日志
3. **样式丢失**：确认所有资源路径正确

### 手动重新部署
在GitHub仓库页面：
1. 点击 "Actions" 标签
2. 选择 "Deploy to GitHub Pages" 工作流
3. 点击 "Run workflow" → "Run workflow"