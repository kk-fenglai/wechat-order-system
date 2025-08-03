# GitHub推送教程

## 概述

本教程将帮助您将微信公众号订单管理系统推送到GitHub，为后续的Vercel部署做准备。

## 第一步：安装Git

### Windows用户

1. **下载Git**
   - 访问：https://git-scm.com/download/win
   - 下载Windows版本的Git安装包

2. **安装Git**
   - 运行下载的安装包
   - 按照默认设置安装即可
   - 安装完成后重启命令提示符或PowerShell

3. **验证安装**
   ```bash
   git --version
   ```
   如果显示版本号，说明安装成功。

### macOS用户

1. **使用Homebrew安装**
   ```bash
   brew install git
   ```

2. **或使用Xcode Command Line Tools**
   ```bash
   xcode-select --install
   ```

### Linux用户

1. **Ubuntu/Debian**
   ```bash
   sudo apt-get update
   sudo apt-get install git
   ```

2. **CentOS/RHEL**
   ```bash
   sudo yum install git
   ```

## 第二步：配置Git

### 设置用户信息

```bash
git config --global user.name "您的GitHub用户名"
git config --global user.email "您的邮箱地址"
```

例如：
```bash
git config --global user.name "davin123"
git config --global user.email "davin@example.com"
```

### 验证配置

```bash
git config --list
```

## 第三步：创建GitHub仓库

### 方法一：通过GitHub网站创建

1. **登录GitHub**
   - 访问：https://github.com/
   - 使用您的账号登录

2. **创建新仓库**
   - 点击右上角的"+"号
   - 选择"New repository"

3. **配置仓库信息**
   - **Repository name**: `wechat-order-system`
   - **Description**: `微信公众号订单管理系统 - 中法集运业务`
   - **Visibility**: 选择"Public"（公开）或"Private"（私有）
   - **不要勾选** "Add a README file"（我们会从本地推送）
   - **不要勾选** "Add .gitignore"
   - **不要勾选** "Choose a license"

4. **创建仓库**
   - 点击"Create repository"

### 方法二：通过GitHub CLI创建（可选）

如果您安装了GitHub CLI：
```bash
gh repo create wechat-order-system --public --description "微信公众号订单管理系统 - 中法集运业务"
```

## 第四步：初始化本地Git仓库

### 进入项目目录

```bash
cd C:\Users\lenovo\Desktop\微信公众号
```

### 初始化Git仓库

```bash
git init
```

### 添加文件到暂存区

```bash
git add .
```

### 提交更改

```bash
git commit -m "Initial commit: 微信公众号订单管理系统"
```

## 第五步：连接远程仓库

### 添加远程仓库

```bash
git remote add origin https://github.com/您的用户名/wechat-order-system.git
```

例如：
```bash
git remote add origin https://github.com/davin123/wechat-order-system.git
```

### 验证远程仓库

```bash
git remote -v
```

应该显示类似：
```
origin  https://github.com/您的用户名/wechat-order-system.git (fetch)
origin  https://github.com/您的用户名/wechat-order-system.git (push)
```

## 第六步：推送到GitHub

### 设置默认分支

```bash
git branch -M main
```

### 推送到GitHub

```bash
git push -u origin main
```

### 输入认证信息

如果提示输入用户名和密码：
- **Username**: 您的GitHub用户名
- **Password**: 使用Personal Access Token（不是GitHub密码）

## 第七步：创建Personal Access Token

### 生成Token

1. **访问GitHub设置**
   - 登录GitHub
   - 点击右上角头像
   - 选择"Settings"

2. **创建Token**
   - 左侧菜单选择"Developer settings"
   - 选择"Personal access tokens"
   - 选择"Tokens (classic)"
   - 点击"Generate new token"
   - 选择"Generate new token (classic)"

3. **配置Token**
   - **Note**: `wechat-order-system-token`
   - **Expiration**: 选择"90 days"或"Custom"
   - **Scopes**: 勾选"repo"（完整的仓库访问权限）

4. **生成Token**
   - 点击"Generate token"
   - **重要**: 复制并保存Token，它只会显示一次！

### 使用Token

当Git提示输入密码时，使用这个Token而不是GitHub密码。

## 第八步：验证推送结果

### 检查GitHub仓库

1. **访问您的仓库**
   - 打开：`https://github.com/您的用户名/wechat-order-system`
   - 确认所有文件都已上传

2. **检查文件结构**
   应该看到以下文件和文件夹：
   ```
   ├── README.md
   ├── package.json
   ├── server.js
   ├── vercel.json
   ├── public/
   ├── src/
   ├── config/
   ├── docs/
   └── cloudfunctions/
   ```

## 第九步：后续更新

### 日常开发流程

1. **修改代码后**
   ```bash
   git add .
   git commit -m "描述您的更改"
   git push
   ```

2. **查看状态**
   ```bash
   git status
   ```

3. **查看提交历史**
   ```bash
   git log --oneline
   ```

## 常见问题解决

### 1. 推送失败 - 认证错误

**问题**: `fatal: Authentication failed`

**解决方案**:
1. 确认使用Personal Access Token而不是GitHub密码
2. 重新生成Token
3. 使用Git Credential Manager：
   ```bash
   git config --global credential.helper manager
   ```

### 2. 推送失败 - 远程仓库已存在

**问题**: `fatal: remote origin already exists`

**解决方案**:
```bash
git remote remove origin
git remote add origin https://github.com/您的用户名/wechat-order-system.git
```

### 3. 推送失败 - 分支冲突

**问题**: `error: failed to push some refs`

**解决方案**:
```bash
git pull origin main
git push origin main
```

### 4. 文件被忽略

**问题**: 某些文件没有上传

**解决方案**:
1. 检查`.gitignore`文件
2. 强制添加被忽略的文件：
   ```bash
   git add -f 文件名
   ```

## 安全建议

### 1. 保护敏感信息

- 不要将`.env`文件推送到GitHub
- 确保`.gitignore`包含敏感文件
- 使用环境变量存储密钥

### 2. 定期更新Token

- Token有90天有效期
- 定期生成新的Token
- 删除过期的Token

### 3. 仓库权限

- 私有仓库更安全
- 限制协作者权限
- 定期审查访问权限

## 下一步

推送成功后，您可以：

1. **通过Vercel控制台部署**
   - 访问：https://vercel.com/dashboard
   - 导入GitHub仓库
   - 配置环境变量
   - 部署项目

2. **配置微信公众号**
   - 使用Vercel部署URL
   - 配置服务器地址
   - 测试功能

## 总结

通过本教程，您已经成功：
- ✅ 安装了Git
- ✅ 配置了Git用户信息
- ✅ 创建了GitHub仓库
- ✅ 推送了项目代码
- ✅ 了解了后续更新流程

现在您的项目已经安全地存储在GitHub上，可以继续进行Vercel部署了！ 