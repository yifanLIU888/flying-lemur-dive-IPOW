/**
 * API 客户端 - 用于与后端API通信
 * 注意：这些函数需要在后端API端点实现后才能工作
 */

import { db } from './db'

// ============ 用户相关 ============

export const userApi = {
  // 获取或创建匿名用户
  getOrCreateAnonymous: async (sessionId: string) => {
    'use server'
    return await db.user.upsert({
      where: { sessionId },
      update: { updatedAt: new Date() },
      create: {
        sessionId,
        isAnonymous: true,
        username: `user_${sessionId.slice(0, 8)}`
      }
    })
  },

  // 获取用户配置
  getUserConfig: async (userId: string) => {
    'use server'
    return await db.cloudinaryConfig.findUnique({
      where: { userId }
    })
  },

  // 保存用户配置
  saveUserConfig: async (userId: string, config: { cloudName: string; uploadPreset: string }) => {
    'use server'
    return await db.cloudinaryConfig.upsert({
      where: { userId },
      update: config,
      create: { userId, ...config, isActive: true }
    })
  }
}

// ============ 处理任务相关 ============

export const jobApi = {
  // 创建新任务
  createJob: async (data: {
    userId?: string
    mode: 'multiview' | 'tryon' | 'crossplatform'
    inputPersonImage?: string
    inputGarmentImage?: string
    inputProductImage?: string
    options?: Record<string, any>
  }) => {
    'use server'
    return await db.processingJob.create({
      data: {
        userId: data.userId,
        mode: data.mode,
        inputPersonImage: data.inputPersonImage,
        inputGarmentImage: data.inputGarmentImage,
        inputProductImage: data.inputProductImage,
        options: data.options || {}
      }
    })
  },

  // 更新任务状态
  updateJobStatus: async (jobId: string, status: 'pending' | 'processing' | 'completed' | 'failed', errorMessage?: string) => {
    'use server'
    const updateData: any = { status, updatedAt: new Date() }
    if (status === 'completed') {
      updateData.completedAt = new Date()
    }
    if (errorMessage) {
      updateData.errorMessage = errorMessage
    }
    return await db.processingJob.update({
      where: { id: jobId },
      data: updateData
    })
  },

  // 记录处理时间
  recordProcessingTime: async (jobId: string, processingTimeMs: number) => {
    'use server'
    return await db.processingJob.update({
      where: { id: jobId },
      data: { processingTimeMs }
    })
  },

  // 获取用户的所有任务
  getUserJobs: async (userId: string, limit: number = 20) => {
    'use server'
    return await db.processingJob.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit
    })
  },

  // 获取单个任务（包含结果）
  getJobWithResults: async (jobId: string) => {
    'use server'
    return await db.processingJob.findUnique({
      where: { id: jobId },
      include: { results: true }
    })
  }
}

// ============ 生成结果相关 ============

export const resultApi = {
  // 批量创建结果
  createResults: async (jobId: string, results: Array<{
    resultType: 'image' | 'text' | 'both'
    viewAngle?: string
    imageUrl?: string
    platform?: string
    title?: string
    description?: string
    tags?: string[]
    recommendedImageUrl?: string
    metadata?: Record<string, any>
  }>) => {
    'use server'
    return await db.generatedResult.createMany({
      data: results.map(r => ({
        jobId,
        resultType: r.resultType,
        viewAngle: r.viewAngle,
        imageUrl: r.imageUrl,
        platform: r.platform,
        title: r.title,
        description: r.description,
        tags: r.tags || [],
        recommendedImageUrl: r.recommendedImageUrl,
        metadata: r.metadata || {}
      }))
    })
  },

  // 获取任务的所有结果
  getJobResults: async (jobId: string) => {
    'use server'
    return await db.generatedResult.findMany({
      where: { jobId }
    })
  }
}

// ============ Newsletter 相关 ============

export const newsletterApi = {
  // 订阅
  subscribe: async (email: string, ipAddress?: string, userAgent?: string) => {
    'use server'
    return await db.newsletterSubscription.upsert({
      where: { email },
      update: { 
        isActive: true,
        subscribedAt: new Date(),
        unsubscribedAt: null,
        ipAddress,
        userAgent
      },
      create: {
        email,
        ipAddress,
        userAgent,
        isActive: true,
        subscribedAt: new Date()
      }
    })
  },

  // 取消订阅
  unsubscribe: async (email: string) => {
    'use server'
    return await db.newsletterSubscription.update({
      where: { email },
      data: { isActive: false, unsubscribedAt: new Date() }
    })
  },

  // 检查订阅状态
  checkSubscription: async (email: string) => {
    'use server'
    return await db.newsletterSubscription.findUnique({
      where: { email },
      select: { isActive: true, subscribedAt: true }
    })
  }
}