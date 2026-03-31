# IPOW 数据库设计文档

## 概述

本数据库设计支持 IPOW 应用的三大核心功能：
1. **3D模型生成** (Multiview) - 从单张人物照片生成多角度视图
2. **虚拟试穿** (Virtual Try-On) - 结合人物和服装照片生成试穿效果
3. **跨平台内容生成** (Cross-Platform Content) - 为不同电商平台生成营销内容

## 技术栈建议

- **数据库**: PostgreSQL (推荐) 或 MySQL
- **ORM**: Prisma (推荐) 或 Drizzle ORM
- **文件存储**: Cloudinary (已集成) 或 S3
- **后端框架**: Next.js API Routes 或 Express

## 数据库架构

### 1. 用户表 (users)

存储用户信息，支持匿名和认证用户。

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(254) UNIQUE,
  username VARCHAR(100),
  avatar_url TEXT,
  is_anonymous BOOLEAN DEFAULT true,
  session_id VARCHAR(255), -- 用于匿名用户追踪
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_session_id ON users(session_id);
```

### 2. Cloudinary 配置表 (cloudinary_configs)

存储用户的 Cloudinary 凭证（如果使用用户自己的账户）。

```sql
CREATE TABLE cloudinary_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  cloud_name VARCHAR(255) NOT NULL,
  upload_preset VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 索引
CREATE INDEX idx_cloudinary_configs_user_id ON cloudinary_configs(user_id);
```

### 3. 处理任务表 (processing_jobs)

记录每次图像处理任务的核心信息。

```sql
CREATE TYPE processing_mode AS ENUM ('multiview', 'tryon', 'crossplatform');
CREATE TYPE processing_status AS ENUM ('pending', 'processing', 'completed', 'failed');

CREATE TABLE processing_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  mode processing_mode NOT NULL,
  status processing_status DEFAULT 'pending',
  
  -- 输入文件（Cloudinary URLs 或本地路径）
  input_person_image TEXT,
  input_garment_image TEXT,
  input_product_image TEXT,
  
  -- 处理参数（JSON 格式）
  options JSONB DEFAULT '{}',
  
  -- 处理元数据
  processing_time_ms INTEGER,
  error_message TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

-- 索引
CREATE INDEX idx_processing_jobs_user_id ON processing_jobs(user_id);
CREATE INDEX idx_processing_jobs_status ON processing_jobs(status);
CREATE INDEX idx_processing_jobs_created_at ON processing_jobs(created_at DESC);
```

### 4. 生成结果表 (generated_results)

存储每次处理生成的所有结果（图片和文案）。

```sql
CREATE TYPE result_type AS ENUM ('image', 'text', 'both');

CREATE TABLE generated_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES processing_jobs(id) ON DELETE CASCADE,
  result_type result_type NOT NULL,
  
  -- 3D 模型视图
  view_angle VARCHAR(50), -- 'front', 'back', 'left', 'right'
  image_url TEXT,
  
  -- 跨平台内容
  platform VARCHAR(50), -- 'xiaohongshu', 'jd', 'pinduoduo', 'amazon', 'shopee', 'social'
  title TEXT,
  description TEXT,
  tags TEXT[], -- 数组存储标签
  recommended_image_url TEXT,
  
  -- 元数据
  metadata JSONB DEFAULT '{}',
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_generated_results_job_id ON generated_results(job_id);
CREATE INDEX idx_generated_results_platform ON generated_results(platform);
CREATE INDEX idx_generated_results_view_angle ON generated_results(view_angle);
```

### 5. Newsletter 订阅表 (newsletter_subscriptions)

```sql
CREATE TABLE newsletter_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(254) UNIQUE NOT NULL,
  ip_address INET,
  user_agent TEXT,
  subscribed_at TIMESTAMP DEFAULT NOW(),
  unsubscribed_at TIMESTAMP,
  is_active BOOLEAN DEFAULT true
);

-- 索引
CREATE INDEX idx_newsletter_email ON newsletter_subscriptions(email);
CREATE INDEX idx_newsletter_active ON newsletter_subscriptions(is_active);
CREATE INDEX idx_newsletter_subscribed_at ON newsletter_subscriptions(subscribed_at DESC);
```

### 6. 使用统计表 (usage_stats) - 可选

用于分析和计费。

```sql
CREATE TABLE usage_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  job_id UUID REFERENCES processing_jobs(id) ON DELETE CASCADE,
  
  -- 统计维度
  date DATE DEFAULT CURRENT_DATE,
  mode processing_mode,
  
  -- 用量指标
  images_uploaded INTEGER DEFAULT 0,
  images_generated INTEGER DEFAULT 0,
  processing_time_ms INTEGER,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_usage_stats_user_id_date ON usage_stats(user_id, date);
CREATE INDEX idx_usage_stats_date ON usage_stats(date);
```

## 数据流示例

### 场景1: 用户使用3D模型生成功能

1. 用户访问网站，创建匿名用户记录（或登录）
2. 上传人物照片 → 创建 `processing_jobs` 记录，存储图片URL
3. 开始处理，状态更新为 `processing`
4. 处理完成，创建4条 `generated_results` 记录（front, back, left, right）
5. 更新 `processing_jobs` 状态为 `completed`，记录处理时间

### 场景2: 用户使用跨平台内容生成

1. 用户上传产品照片
2. 创建 `processing_jobs` 记录，mode='crossplatform'
3. 处理完成后，为6个平台各创建一条 `generated_results` 记录
   - 包含平台名称、营销文案、推荐图片URL、标签

### 场景3: Newsletter 订阅

1. 用户提交邮箱
2. 记录 IP 和 User-Agent（用于安全审计）
3. 创建 `newsletter_subscriptions` 记录

## API 端点设计

### 处理任务相关

```
POST   /api/jobs              # 创建新处理任务
GET    /api/jobs              # 获取用户的任务列表
GET    /api/jobs/:id          # 获取特定任务详情
DELETE /api/jobs/:id          # 删除任务（软删除或硬删除）
```

### 结果相关

```
GET    /api/jobs/:id/results  # 获取任务的所有生成结果
GET    /api/results/:id       # 获取单个结果
```

### Newsletter

```
POST   /api/newsletter/subscribe    # 订阅
POST   /api/newsletter/unsubscribe  # 取消订阅
```

### 用户配置

```
GET    /api/user/config        # 获取用户配置
PUT    /api/user/config        # 更新用户配置（如Cloudinary）
```

## 安全考虑

1. **数据隔离**: 用户只能访问自己的数据
2. **输入验证**: 所有API端点必须验证输入
3. **速率限制**: 对API端点实施速率限制（按用户/IP）
4. **文件安全**: 验证上传文件类型和大小
5. **SQL注入**: 使用参数化查询或ORM
6. **XSS防护**: 存储和显示时对用户输入进行净化

## 扩展性考虑

1. **分表分区**: 按时间对 `processing_jobs` 和 `generated_results` 进行分区
2. **缓存**: 使用Redis缓存频繁访问的数据
3. **CDN**: 生成的结果图片应通过CDN分发
4. **归档策略**: 定期归档旧数据到冷存储
5. **监控**: 记录查询性能，优化慢查询

## 迁移脚本

使用Prisma或Alembic管理数据库迁移，确保版本控制。

示例Prisma Schema:

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id                String           @id @default(cuid())
  email             String?          @unique
  username          String?
  avatarUrl         String?
  isAnonymous       Boolean          @default(true)
  sessionId         String?
  cloudinaryConfig  CloudinaryConfig?
  processingJobs    ProcessingJob[]
  newsletter        NewsletterSubscription?
  createdAt         DateTime         @default(now())
  updatedAt         DateTime         @updatedAt

  @@index([email])
  @@index([sessionId])
}

model CloudinaryConfig {
  id             String   @id @default(cuid())
  userId         String   @unique
  user           User     @relation(fields: [userId], references: [id])
  cloudName      String
  uploadPreset   String
  isActive       Boolean  @default(true)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}

model ProcessingJob {
  id                 String           @id @default(cuid())
  userId             String?
  user               User?            @relation(fields: [userId], references: [id])
  mode               ProcessingMode
  status             ProcessingStatus @default(pending)
  inputPersonImage   String?
  inputGarmentImage  String?
  inputProductImage  String?
  options            Json?
  processingTimeMs   Int?
  errorMessage       String?
  completedAt        DateTime?
  createdAt          DateTime         @default(now())
  updatedAt          DateTime         @updatedAt
  results            GeneratedResult[]

  @@index([userId])
  @@index([status])
  @@index([createdAt])
}

model GeneratedResult {
  id             String   @id @default(cuid())
  jobId          String
  job            ProcessingJob @relation(fields: [jobId], references: [id])
  resultType     ResultType
  viewAngle      String?  // front, back, left, right
  imageUrl       String?
  platform       String?  // xiaohongshu, jd, etc.
  title          String?
  description    String?
  tags           String[]
  recommendedImageUrl String?
  metadata       Json?
  createdAt      DateTime @default(now())

  @@index([jobId])
  @@index([platform])
  @@index([viewAngle])
}

model NewsletterSubscription {
  id              String   @id @default(cuid())
  email           String   @unique
  ipAddress       String?
  userAgent       String?
  subscribedAt    DateTime @default(now())
  unsubscribedAt  DateTime?
  isActive        Boolean  @default(true)
  user            User?    @relation(fields: [userId], references: [id])
  userId          String?

  @@index([email])
  @@index([isActive])
  @@index([subscribedAt])
}

enum ProcessingMode {
  multiview
  tryon
  crossplatform
}

enum ProcessingStatus {
  pending
  processing
  completed
  failed
}

enum ResultType {
  image
  text
  both
}
```

## 实施步骤

1. 设置数据库（PostgreSQL）
2. 安装Prisma：`npm install prisma @prisma/client`
3. 初始化：`npx prisma init`
4. 配置 `prisma/schema.prisma`
5. 生成客户端：`npx prisma generate`
6. 创建迁移：`npx prisma migrate dev --name init`
7. 在应用中使用Prisma Client

## 环境变量

```
DATABASE_URL="postgresql://user:password@localhost:5432/ipow_db"
```

## 后续优化

1. 添加用户认证（NextAuth.js 或 Clerk）
2. 实现API限流（Upstash Redis 或 similar）
3. 添加文件上传直接到Cloudinary的签名端点
4. 实现Webhook处理异步任务
5. 添加搜索功能（使用PostgreSQL全文搜索或Elasticsearch）
6. 数据导出功能（用户可下载自己的数据）