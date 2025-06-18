import { Router } from 'express'
import { prisma } from '../lib/prisma'
import { authenticateToken } from '../middleware/auth'
import { z } from 'zod'

const router = Router()

// 시나리오 생성 스키마
const createScenarioSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().optional(),
  mapId: z.string(),
  mapName: z.string(),
  isPublic: z.boolean().default(false),
  ourTeam: z.array(z.object({
    agentName: z.string(),
    agentRole: z.string(),
    position: z.number()
  })),
  enemyTeam: z.array(z.object({
    agentName: z.string(),
    agentRole: z.string(),
    position: z.number()
  }))
})

// 시나리오 목록 조회
router.get('/', async (req: any, res) => {
  try {
    const { page = 1, limit = 10, search = '', isPublic } = req.query
    
    let where: any = {}
    
    // 인증된 사용자인 경우 프라이빗 시나리오도 포함
    if (req.headers.authorization) {
      try {
        const jwt = require('jsonwebtoken')
        const token = req.headers.authorization.replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')
        
        where = {
          OR: [
            { authorId: decoded.id },
            { isPublic: true }
          ]
        }
      } catch (error) {
        where = { isPublic: true }
      }
    } else {
      where = { isPublic: true }
    }
    
    if (search) {
      where.title = { contains: search }
    }
    
    if (isPublic !== undefined) {
      where.isPublic = isPublic === 'true'
    }

    const scenarios = await prisma.scenario.findMany({
      where,
      include: {
        author: {
          select: { id: true, username: true, avatar: true }
        },
        teams: true,
        timeline: true,
        mapObjects: true,
        _count: {
          select: { shares: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit)
    })
    
    const total = await prisma.scenario.count({ where })
    
    res.json({
      scenarios,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    })
  } catch (error) {
    console.error('Error fetching scenarios:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// 특정 시나리오 조회
router.get('/:id', async (req: any, res) => {
  try {
    let where: any = { id: req.params.id }
    
    // 인증된 사용자인 경우 권한 확인
    if (req.headers.authorization) {
      try {
        const jwt = require('jsonwebtoken')
        const token = req.headers.authorization.replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')
        
        where = {
          id: req.params.id,
          OR: [
            { authorId: decoded.id },
            { isPublic: true },
            { shares: { some: { userId: decoded.id } } }
          ]
        }
      } catch (error) {
        where = { id: req.params.id, isPublic: true }
      }
    } else {
      where = { id: req.params.id, isPublic: true }
    }

    const scenario = await prisma.scenario.findFirst({
      where,
      include: {
        author: {
          select: { id: true, username: true, avatar: true }
        },
        teams: {
          include: {
            playerActions: {
              orderBy: { timestamp: 'asc' }
            }
          }
        },
        timeline: {
          include: {
            events: {
              orderBy: { timestamp: 'asc' }
            }
          }
        },
        mapObjects: {
          orderBy: { startTime: 'asc' }
        },
        shares: {
          include: {
            user: {
              select: { id: true, username: true, avatar: true }
            }
          }
        }
      }
    })
    
    if (!scenario) {
      return res.status(404).json({ error: '시나리오를 찾을 수 없습니다.' })
    }

    res.json(scenario)
  } catch (error) {
    console.error('Error fetching scenario:', error)
    res.status(500).json({ error: '시나리오를 가져오는데 실패했습니다.' })
  }
})

// 시나리오 생성 (인증 필요)
router.post('/', authenticateToken, async (req: any, res) => {
  try {
    const validatedData = createScenarioSchema.parse(req.body)
    
    const scenario = await prisma.scenario.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        mapId: validatedData.mapId,
        mapName: validatedData.mapName,
        isPublic: validatedData.isPublic,
        authorId: req.user.id,
        teams: {
          create: [
            ...validatedData.ourTeam.map(team => ({
              teamType: 'our' as const,
              agentName: team.agentName,
              agentRole: team.agentRole,
              position: team.position
            })),
            ...validatedData.enemyTeam.map(team => ({
              teamType: 'enemy' as const,
              agentName: team.agentName,
              agentRole: team.agentRole,
              position: team.position
            }))
          ]
        }
      },
      include: {
        author: {
          select: { id: true, username: true, avatar: true }
        },
        teams: true
      }
    })

    res.status(201).json(scenario)
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: '입력 데이터가 올바르지 않습니다.', details: error.errors })
    }
    console.error('Error creating scenario:', error)
    res.status(500).json({ error: '시나리오 생성에 실패했습니다.' })
  }
})

// 시나리오 수정 (인증 필요)
router.put('/:id', authenticateToken, async (req: any, res) => {
  try {
    const { title, description, isPublic } = req.body

    // 작성자 권한 확인
    const existingScenario = await prisma.scenario.findFirst({
      where: {
        id: req.params.id,
        authorId: req.user.id
      }
    })

    if (!existingScenario) {
      return res.status(404).json({ error: '시나리오를 찾을 수 없거나 수정 권한이 없습니다.' })
    }

    const scenario = await prisma.scenario.update({
      where: { id: req.params.id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(isPublic !== undefined && { isPublic })
      },
      include: {
        author: {
          select: { id: true, username: true, avatar: true }
        },
        teams: true
      }
    })

    res.json(scenario)
  } catch (error) {
    console.error('Error updating scenario:', error)
    res.status(500).json({ error: '시나리오 수정에 실패했습니다.' })
  }
})

// 시나리오 삭제 (인증 필요)
router.delete('/:id', authenticateToken, async (req: any, res) => {
  try {
    // 작성자 권한 확인
    const existingScenario = await prisma.scenario.findFirst({
      where: {
        id: req.params.id,
        authorId: req.user.id
      }
    })

    if (!existingScenario) {
      return res.status(404).json({ error: '시나리오를 찾을 수 없거나 삭제 권한이 없습니다.' })
    }

    await prisma.scenario.delete({
      where: { id: req.params.id }
    })

    res.json({ message: '시나리오가 삭제되었습니다.' })
  } catch (error) {
    console.error('Error deleting scenario:', error)
    res.status(500).json({ error: '시나리오 삭제에 실패했습니다.' })
  }
})

// 타임라인 업데이트 (인증 필요)
router.put('/:id/timeline', authenticateToken, async (req: any, res) => {
  try {
    const { duration, rounds, events } = req.body

    // 작성자 권한 확인
    const existingScenario = await prisma.scenario.findFirst({
      where: {
        id: req.params.id,
        authorId: req.user.id
      }
    })

    if (!existingScenario) {
      return res.status(404).json({ error: '시나리오를 찾을 수 없거나 수정 권한이 없습니다.' })
    }

    const timeline = await prisma.timeline.upsert({
      where: { scenarioId: req.params.id },
      create: {
        scenarioId: req.params.id,
        duration,
        rounds,
        events: {
          create: events.map((event: any) => ({
            timestamp: event.timestamp,
            eventType: event.eventType,
            description: event.description,
            data: JSON.stringify(event.data)
          }))
        }
      },
      update: {
        duration,
        rounds,
        events: {
          deleteMany: {},
          create: events.map((event: any) => ({
            timestamp: event.timestamp,
            eventType: event.eventType,
            description: event.description,
            data: JSON.stringify(event.data)
          }))
        }
      },
      include: {
        events: {
          orderBy: { timestamp: 'asc' }
        }
      }
    })

    res.json(timeline)
  } catch (error) {
    console.error('Error updating timeline:', error)
    res.status(500).json({ error: '타임라인 업데이트에 실패했습니다.' })
  }
})

// 맵 오브젝트 업데이트 (인증 필요)
router.put('/:id/map-objects', authenticateToken, async (req: any, res) => {
  try {
    const { objects } = req.body

    // 작성자 권한 확인
    const existingScenario = await prisma.scenario.findFirst({
      where: {
        id: req.params.id,
        authorId: req.user.id
      }
    })

    if (!existingScenario) {
      return res.status(404).json({ error: '시나리오를 찾을 수 없거나 수정 권한이 없습니다.' })
    }

    // 기존 맵 오브젝트 삭제 후 새로 생성
    await prisma.mapObject.deleteMany({
      where: { scenarioId: req.params.id }
    })

    const mapObjects = await prisma.mapObject.createMany({
      data: objects.map((obj: any) => ({
        scenarioId: req.params.id,
        objectType: obj.objectType,
        objectName: obj.objectName,
        positionX: obj.positionX,
        positionY: obj.positionY,
        width: obj.width,
        height: obj.height,
        radius: obj.radius,
        color: obj.color,
        opacity: obj.opacity,
        startTime: obj.startTime,
        endTime: obj.endTime,
        duration: obj.duration,
        data: obj.data ? JSON.stringify(obj.data) : null
      }))
    })

    const updatedObjects = await prisma.mapObject.findMany({
      where: { scenarioId: req.params.id },
      orderBy: { startTime: 'asc' }
    })

    res.json(updatedObjects)
  } catch (error) {
    console.error('Error updating map objects:', error)
    res.status(500).json({ error: '맵 오브젝트 업데이트에 실패했습니다.' })
  }
})

export default router
