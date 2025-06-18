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

// 사용자별 시나리오 목록 조회 (자신의 시나리오만) - /:id 라우트보다 먼저 정의
router.get('/my-scenarios', async (req: any, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    
    console.log('내 시나리오 요청:', { page, limit, search });
    
    // 임시로 테스트 사용자 시나리오 가져오기
    const testUser = await prisma.user.findFirst({
      where: { email: 'test@valtactics.com' }
    });
    
    if (!testUser) {
      console.log('테스트 사용자를 찾을 수 없음');
      return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
    }
    
    console.log('테스트 사용자 찾음:', testUser.id);
    
    let where: any = { authorId: testUser.id };
    
    // 검색어가 있으면 제목에서 검색
    if (search) {
      where.title = { contains: search };
    }

    const scenarios = await prisma.scenario.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit)
    });
    
    const total = await prisma.scenario.count({ where });
    
    console.log(`찾은 시나리오 개수: ${scenarios.length}, 전체: ${total}`);
    
    res.json({
      scenarios,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching user scenarios:', error);
    res.status(500).json({ error: '내 시나리오 목록을 가져오는데 실패했습니다.' });
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
        mapName: data.mapName,
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
        },        timeline: {
          create: {
            duration: 100000, // 1분 40초 (100초)
            rounds: 1
          }
        }
      }
    });    // 생성된 시나리오를 다시 조회하여 관련 데이터와 함께 반환
    const fullScenario = await (prisma.scenario as any).findUnique({
      where: { id: scenario.id },
      include: {
        teams: true,
        timeline: {
          include: {
            events: true
          }
        }
      }
    });
    
    console.log('시나리오 생성 성공:', scenario.id);

    res.status(201).json(fullScenario)
  } catch (error) {
    console.error('Error creating scenario:', error)
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: '입력 데이터가 올바르지 않습니다.', details: error.errors })
    }
    res.status(500).json({ error: '시나리오 생성에 실패했습니다.' })  }
})

// 시나리오 삭제 (임시로 인증 없이)
router.delete('/:id', async (req: any, res: any) => {
  try {
    const scenarioId = req.params.id;
    console.log('시나리오 삭제 요청:', scenarioId);
    
    // 시나리오 존재 확인
    const scenario = await prisma.scenario.findUnique({
      where: { id: scenarioId }
    });
    
    if (!scenario) {
      return res.status(404).json({ error: '시나리오를 찾을 수 없습니다.' });
    }
    
    // 관련 데이터와 함께 시나리오 삭제
    await prisma.scenario.delete({
      where: { id: scenarioId }
    });
    
    console.log('시나리오 삭제 성공:', scenarioId);
    res.json({ message: '시나리오가 성공적으로 삭제되었습니다.' });
  } catch (error) {
    console.error('Error deleting scenario:', error);
    res.status(500).json({ error: '시나리오 삭제에 실패했습니다.' });
  }
})

// 플레이어 액션 기록 (타임라인 이벤트 생성)
router.post('/:id/actions', async (req: any, res) => {
  try {
    const scenarioId = req.params.id;
    const { playerId, actionType, timestamp, position, data } = req.body;
    
    console.log('플레이어 액션 기록:', { scenarioId, playerId, actionType, timestamp });
    
    // 시나리오의 타임라인 찾기
    const scenario = await (prisma.scenario as any).findUnique({
      where: { id: scenarioId },
      include: { timeline: true }
    });
    
    if (!scenario) {
      return res.status(404).json({ error: '시나리오를 찾을 수 없습니다.' });
    }
    
    if (!scenario.timeline) {
      return res.status(400).json({ error: '시나리오에 타임라인이 없습니다.' });
    }
      // 타임라인 이벤트 생성
    const event = await (prisma as any).timelineEvent.create({
      data: {
        timelineId: scenario.timeline.id,
        timestamp: timestamp,
        eventType: actionType,
        description: `플레이어 ${playerId} ${actionType} 액션`,
        data: JSON.stringify({
          playerId,
          actionType,
          position,
          ...data
        })
      }
    });
    
    console.log('타임라인 이벤트 생성 성공:', event.id);
    res.status(201).json(event);
  } catch (error) {
    console.error('Error creating player action:', error);
    res.status(500).json({ error: '플레이어 액션 기록에 실패했습니다.' });
  }
})

// 타임라인 이벤트 추가
router.post('/:id/events', async (req: any, res) => {
  try {
    const scenarioId = req.params.id;
    const { id: eventId, playerId, actionType, timestamp, position, metadata } = req.body;
    
    console.log('타임라인 이벤트 추가:', { scenarioId, eventId, playerId, actionType, timestamp });
    
    // 시나리오의 타임라인 찾기
    const scenario = await (prisma.scenario as any).findUnique({
      where: { id: scenarioId },
      include: { timeline: true }
    });
    
    if (!scenario) {
      return res.status(404).json({ error: '시나리오를 찾을 수 없습니다.' });
    }
    
    if (!scenario.timeline) {
      return res.status(404).json({ error: '타임라인을 찾을 수 없습니다.' });
    }
    
    // 타임라인 이벤트 생성
    const event = await (prisma as any).timelineEvent.create({
      data: {
        id: eventId,
        timelineId: scenario.timeline.id,
        eventType: actionType,
        timestamp: timestamp,
        description: `${actionType} action`,
        data: {
          playerId: playerId,
          position: position,
          ...metadata
        }
      }
    });
    
    console.log('타임라인 이벤트 추가 성공:', event.id);
    res.status(201).json(event);  } catch (error) {
    console.error('Error adding timeline event:', error);
    return res.status(500).json({ error: '타임라인 이벤트 추가에 실패했습니다.' });
  }
})

// 타임라인 이벤트 업데이트
router.put('/:id/events/:eventId', async (req, res) => {
  try {
    const { id: scenarioId, eventId } = req.params;
    const updates = req.body;
    
    console.log('타임라인 이벤트 업데이트 요청:', { scenarioId, eventId, updates });
    
    // 시나리오 존재 확인
    const scenario = await (prisma as any).scenario.findUnique({
      where: { id: scenarioId },
      include: { timeline: true }
    });
    
    if (!scenario) {
      return res.status(404).json({ error: '시나리오를 찾을 수 없습니다.' });
    }
    
    // 이벤트 업데이트
    const updatedEvent = await (prisma as any).timelineEvent.update({
      where: { id: eventId },
      data: {
        ...updates,
        data: updates.data ? JSON.stringify(updates.data) : undefined
      }
    });
    
    console.log('타임라인 이벤트 업데이트 성공:', updatedEvent.id);
    res.json(updatedEvent);  } catch (error) {
    console.error('Error updating timeline event:', error);
    return res.status(500).json({ error: '타임라인 이벤트 업데이트에 실패했습니다.' });
  }
});

// 타임라인 이벤트 삭제
router.delete('/:id/events/:eventId', async (req, res) => {
  try {
    const { id: scenarioId, eventId } = req.params;
    
    console.log('타임라인 이벤트 삭제 요청:', { scenarioId, eventId });
    
    // 시나리오 존재 확인
    const scenario = await (prisma as any).scenario.findUnique({
      where: { id: scenarioId },
      include: { timeline: true }
    });
    
    if (!scenario) {
      return res.status(404).json({ error: '시나리오를 찾을 수 없습니다.' });
    }
    
    // 이벤트 삭제
    await (prisma as any).timelineEvent.delete({
      where: { id: eventId }
    });
    
    console.log('타임라인 이벤트 삭제 성공:', eventId);
    res.status(204).send();  } catch (error) {
    console.error('Error deleting timeline event:', error);
    return res.status(500).json({ error: '타임라인 이벤트 삭제에 실패했습니다.' });
  }
});

export default router
