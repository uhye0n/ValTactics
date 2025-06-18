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

// 시나리오 목록 조회 (공개 시나리오는 인증 없이도 조회 가능)
router.get('/', async (req: any, res) => {
  try {
    const { page = 1, limit = 10, search = '', isPublic } = req.query
    
    let where: any = { isPublic: true } // 기본적으로 공개 시나리오만
    
    // 검색어가 있으면 제목에서 검색
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
        teams: true
      },
      orderBy: { updatedAt: 'desc' },
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
    res.status(500).json({ error: '시나리오 목록을 가져오는데 실패했습니다.' })
  }
})

// 특정 시나리오 조회 (공개 시나리오는 인증 없이도 조회 가능)
router.get('/:id', async (req: any, res) => {
  try {
    const scenario = await prisma.scenario.findFirst({
      where: {
        id: req.params.id
        // 임시로 모든 시나리오 조회 가능하도록 설정
      },
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
        mapObjects: true
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

// 시나리오 생성 (임시로 인증 없이)
router.post('/', async (req: any, res) => {
  console.log('시나리오 생성 요청:', req.body);
  
  try {
    const data = createScenarioSchema.parse(req.body);
    console.log('검증된 데이터:', data);
    
    // 테스트 사용자 ID 가져오기
    const testUser = await prisma.user.findFirst({
      where: { email: 'test@valtactics.com' }
    });
    
    if (!testUser) {
      console.log('테스트 사용자를 찾을 수 없음');
      return res.status(500).json({ error: '테스트 사용자를 찾을 수 없습니다.' });
    }
    
    console.log('테스트 사용자 찾음:', testUser.id);    const scenario = await prisma.scenario.create({
      data: {
        title: data.title,
        description: data.description,
        mapId: data.mapId,
        isPublic: data.isPublic,
        authorId: testUser.id,
        teams: {
          create: [
            ...data.ourTeam.map(team => ({
              teamType: 'our',
              agentName: team.agentName,
              agentRole: team.agentRole,
              position: team.position
            })),
            ...data.enemyTeam.map(team => ({
              teamType: 'enemy',
              agentName: team.agentName,
              agentRole: team.agentRole,
              position: team.position
            }))
          ]
        }
      },
      include: {
        teams: true
      }
    });
    
    console.log('시나리오 생성 성공:', scenario.id);

    res.status(201).json(scenario)
  } catch (error) {
    console.error('Error creating scenario:', error)
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: '입력 데이터가 올바르지 않습니다.', details: error.errors })
    }
    res.status(500).json({ error: '시나리오 생성에 실패했습니다.' })
  }
})

export default router
