import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { CreateActionRequest, ApiResponse } from '@/types/api';
import { z } from 'zod';

const createActionSchema = z.object({
  scenarioId: z.string().min(1),
  playerId: z.string().min(1),
  timestamp: z.number().min(0),
  type: z.enum(['MOVE', 'SKILL', 'SHOOT', 'PLANT', 'DEFUSE', 'DEATH', 'REVIVE']),
  positionX: z.number(),
  positionY: z.number(),
  rotation: z.number().optional(),
  data: z.any().optional()
});

// GET /api/actions - 액션 목록 조회 (시나리오별)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const scenarioId = searchParams.get('scenarioId');
    const playerId = searchParams.get('playerId');

    if (!scenarioId) {
      return NextResponse.json(
        { success: false, error: 'scenarioId is required' } as ApiResponse,
        { status: 400 }
      );
    }

    const where = {
      scenarioId,
      ...(playerId && { playerId })
    };

    const actions = await prisma.playerAction.findMany({
      where,
      include: {
        player: true
      },
      orderBy: { timestamp: 'asc' }
    });

    const response: ApiResponse = {
      success: true,
      data: actions
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('GET /api/actions error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch actions' } as ApiResponse,
      { status: 500 }
    );
  }
}

// POST /api/actions - 새 액션 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createActionSchema.parse(body);

    // 시나리오와 플레이어 존재 확인
    const [scenario, player] = await Promise.all([
      prisma.scenario.findUnique({ where: { id: validatedData.scenarioId } }),
      prisma.scenarioPlayer.findUnique({ where: { id: validatedData.playerId } })
    ]);

    if (!scenario) {
      return NextResponse.json(
        { success: false, error: 'Scenario not found' } as ApiResponse,
        { status: 404 }
      );
    }

    if (!player) {
      return NextResponse.json(
        { success: false, error: 'Player not found' } as ApiResponse,
        { status: 404 }
      );
    }

    if (player.scenarioId !== validatedData.scenarioId) {
      return NextResponse.json(
        { success: false, error: 'Player does not belong to the specified scenario' } as ApiResponse,
        { status: 400 }
      );
    }

    const action = await prisma.playerAction.create({
      data: validatedData,
      include: {
        player: true
      }
    });

    const response: ApiResponse = {
      success: true,
      data: action,
      message: 'Action created successfully'
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('POST /api/actions error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation failed',
          message: error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
        } as ApiResponse,
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create action' } as ApiResponse,
      { status: 500 }
    );
  }
}
