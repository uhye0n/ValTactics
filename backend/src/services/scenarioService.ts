import { prisma } from '@/lib/prisma';
import { CreateScenarioRequest, UpdateScenarioRequest } from '@/types/api';

export class ScenarioService {
  // 시나리오 생성
  static async createScenario(data: CreateScenarioRequest, userId: string) {
    return await prisma.scenario.create({
      data: {
        title: data.title,
        description: data.description,
        mapId: data.mapId,
        isPublic: data.isPublic || false,
        tags: data.tags || [],
        roundType: data.roundType || 'FULL_BUY',
        gameMode: data.gameMode || 'COMPETITIVE',
        createdBy: userId,
        players: {
          create: data.players
        }
      },
      include: {
        players: true,
        user: {
          select: { id: true, username: true, name: true }
        }
      }
    });
  }

  // 사용자별 시나리오 조회
  static async getUserScenarios(userId: string, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    
    const [scenarios, total] = await Promise.all([
      prisma.scenario.findMany({
        where: { createdBy: userId },
        include: {
          players: true,
          _count: {
            select: { actions: true }
          }
        },
        orderBy: { updatedAt: 'desc' },
        skip: offset,
        take: limit
      }),
      prisma.scenario.count({
        where: { createdBy: userId }
      })
    ]);

    return {
      scenarios,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  // 공개 시나리오 조회
  static async getPublicScenarios(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    
    const [scenarios, total] = await Promise.all([
      prisma.scenario.findMany({
        where: { isPublic: true },
        include: {
          user: {
            select: { id: true, username: true, name: true }
          },
          players: true,
          _count: {
            select: { actions: true }
          }
        },
        orderBy: { updatedAt: 'desc' },
        skip: offset,
        take: limit
      }),
      prisma.scenario.count({
        where: { isPublic: true }
      })
    ]);

    return {
      scenarios,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  // 시나리오 상세 조회
  static async getScenarioById(id: string) {
    return await prisma.scenario.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, username: true, name: true }
        },
        players: {
          include: {
            actions: {
              orderBy: { timestamp: 'asc' }
            }
          }
        }
      }
    });
  }

  // 시나리오 업데이트
  static async updateScenario(id: string, data: UpdateScenarioRequest, userId: string) {
    // 권한 확인
    const scenario = await prisma.scenario.findUnique({
      where: { id },
      select: { createdBy: true }
    });

    if (!scenario || scenario.createdBy !== userId) {
      throw new Error('Unauthorized');
    }

    return await prisma.scenario.update({
      where: { id },
      data,
      include: {
        user: {
          select: { id: true, username: true, name: true }
        },
        players: {
          include: {
            actions: {
              orderBy: { timestamp: 'asc' }
            }
          }
        }
      }
    });
  }

  // 시나리오 삭제
  static async deleteScenario(id: string, userId: string) {
    // 권한 확인
    const scenario = await prisma.scenario.findUnique({
      where: { id },
      select: { createdBy: true }
    });

    if (!scenario || scenario.createdBy !== userId) {
      throw new Error('Unauthorized');
    }

    return await prisma.scenario.delete({
      where: { id }
    });
  }

  // 시나리오 복제
  static async duplicateScenario(id: string, userId: string) {
    const originalScenario = await this.getScenarioById(id);
    
    if (!originalScenario) {
      throw new Error('Scenario not found');
    }

    // 공개 시나리오이거나 본인의 시나리오만 복제 가능
    if (!originalScenario.isPublic && originalScenario.createdBy !== userId) {
      throw new Error('Unauthorized');
    }

    return await prisma.scenario.create({
      data: {
        title: `${originalScenario.title} (복사본)`,
        description: originalScenario.description,
        mapId: originalScenario.mapId,
        isPublic: false, // 복사본은 기본적으로 비공개
        tags: originalScenario.tags,
        roundType: originalScenario.roundType,
        gameMode: originalScenario.gameMode,
        duration: originalScenario.duration,
        createdBy: userId,        players: {
          create: originalScenario.players.map((player: any) => ({
            name: player.name,
            agent: player.agent,
            team: player.team,
            color: player.color,
            actions: {
              create: player.actions.map((action: any) => ({
                timestamp: action.timestamp,
                type: action.type,
                positionX: action.positionX,
                positionY: action.positionY,
                rotation: action.rotation,
                data: action.data,
                scenarioId: undefined // Prisma가 자동으로 설정
              }))
            }
          }))
        }
      },
      include: {
        players: {
          include: {
            actions: {
              orderBy: { timestamp: 'asc' }
            }
          }
        },
        user: {
          select: { id: true, username: true, name: true }
        }
      }
    });
  }
}
