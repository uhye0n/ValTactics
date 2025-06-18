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
router.get('/', authenticateToken, async (req: any, res) => {
  try {
    const { page = 1, limit = 10, search = '', isPublic } = req.query
    
    const where: any = {
      OR: [
        { authorId: req.user.id },
        { isPublic: true }
      ]
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
        ourTeam: true,
        enemyTeam: true,
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
router.get('/:id', authenticateToken, async (req: any, res) => {
  try {
    const scenario = await prisma.scenario.findFirst({
      where: {
        id: req.params.id,
        OR: [
          { authorId: req.user.id },
          { isPublic: true },
          { shares: { some: { userId: req.user.id } } }
        ]
      },
      include: {
        author: {
          select: { id: true, username: true, avatar: true }
        },
        ourTeam: {
          include: {
            playerActions: {
              orderBy: { timestamp: 'asc' }
            }
          }
        },
        enemyTeam: {
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
      return res.status(404).json({ error: 'Scenario not found' })
    }
    
    res.json(scenario)
  } catch (error) {
    console.error('Error fetching scenario:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// 시나리오 생성
router.post('/', authenticateToken, async (req: any, res) => {
  try {
    const data = createScenarioSchema.parse(req.body)
    
    const scenario = await prisma.scenario.create({
      data: {
        title: data.title,
        description: data.description,
        mapId: data.mapId,
        mapName: data.mapName,
        isPublic: data.isPublic,
        authorId: req.user.id,
        ourTeam: {
          create: data.ourTeam.map(agent => ({
            teamType: 'our',
            agentName: agent.agentName,
            agentRole: agent.agentRole,
            position: agent.position
          }))
        },
        enemyTeam: {
          create: data.enemyTeam.map(agent => ({
            teamType: 'enemy',
            agentName: agent.agentName,
            agentRole: agent.agentRole,
            position: agent.position
          }))
        },
        timeline: {
          create: {
            duration: 0,
            rounds: 1
          }
        }
      },
      include: {
        author: {
          select: { id: true, username: true, avatar: true }
        },
        ourTeam: true,
        enemyTeam: true,
        timeline: true
      }
    })
    
    res.status(201).json(scenario)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors })
    }
    console.error('Error creating scenario:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// 시나리오 업데이트
router.put('/:id', authenticateToken, async (req: any, res) => {
  try {
    const scenario = await prisma.scenario.findFirst({
      where: {
        id: req.params.id,
        OR: [
          { authorId: req.user.id },
          { shares: { some: { userId: req.user.id, permission: 'edit' } } }
        ]
      }
    })
    
    if (!scenario) {
      return res.status(404).json({ error: 'Scenario not found or no permission' })
    }
    
    const updatedScenario = await prisma.scenario.update({
      where: { id: req.params.id },
      data: {
        title: req.body.title,
        description: req.body.description,
        isPublic: req.body.isPublic,
        updatedAt: new Date()
      },
      include: {
        author: {
          select: { id: true, username: true, avatar: true }
        },
        ourTeam: true,
        enemyTeam: true,
        timeline: {
          include: {
            events: {
              orderBy: { timestamp: 'asc' }
            }
          }
        }
      }
    })
    
    res.json(updatedScenario)
  } catch (error) {
    console.error('Error updating scenario:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// 시나리오 삭제
router.delete('/:id', authenticateToken, async (req: any, res) => {
  try {
    const scenario = await prisma.scenario.findFirst({
      where: {
        id: req.params.id,
        authorId: req.user.id
      }
    })
    
    if (!scenario) {
      return res.status(404).json({ error: 'Scenario not found or no permission' })
    }
    
    await prisma.scenario.delete({
      where: { id: req.params.id }
    })
    
    res.json({ message: 'Scenario deleted successfully' })
  } catch (error) {
    console.error('Error deleting scenario:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// 타임라인 업데이트
router.put('/:id/timeline', authenticateToken, async (req: any, res) => {
  try {
    const { duration, rounds, events } = req.body
    
    const scenario = await prisma.scenario.findFirst({
      where: {
        id: req.params.id,
        OR: [
          { authorId: req.user.id },
          { shares: { some: { userId: req.user.id, permission: 'edit' } } }
        ]
      }
    })
    
    if (!scenario) {
      return res.status(404).json({ error: 'Scenario not found or no permission' })
    }
    
    // 기존 이벤트 삭제 후 새로 생성
    await prisma.timelineEvent.deleteMany({
      where: { timeline: { scenarioId: req.params.id } }
    })
    
    const updatedTimeline = await prisma.timeline.update({
      where: { scenarioId: req.params.id },
      data: {
        duration,
        rounds,
        events: {
          create: events?.map((event: any) => ({
            timestamp: event.timestamp,
            eventType: event.eventType,
            description: event.description,
            data: JSON.stringify(event.data)
          })) || []
        }
      },
      include: {
        events: {
          orderBy: { timestamp: 'asc' }
        }
      }
    })
    
    res.json(updatedTimeline)
  } catch (error) {
    console.error('Error updating timeline:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// 맵 오브젝트 추가/업데이트
router.put('/:id/map-objects', authenticateToken, async (req: any, res) => {
  try {
    const { objects } = req.body
    
    const scenario = await prisma.scenario.findFirst({
      where: {
        id: req.params.id,
        OR: [
          { authorId: req.user.id },
          { shares: { some: { userId: req.user.id, permission: 'edit' } } }
        ]
      }
    })
    
    if (!scenario) {
      return res.status(404).json({ error: 'Scenario not found or no permission' })
    }
    
    // 기존 오브젝트 삭제 후 새로 생성
    await prisma.mapObject.deleteMany({
      where: { scenarioId: req.params.id }
    })
    
    const createdObjects = await prisma.mapObject.createMany({
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
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
