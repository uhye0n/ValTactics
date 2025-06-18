import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { CreateScenarioRequest, ApiResponse } from '@/types/api';
import { z } from 'zod';

// Validation schemas
const createScenarioSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().optional(),
  mapId: z.string().min(1),
  isPublic: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  roundType: z.enum(['PISTOL', 'ECO', 'FORCE_BUY', 'FULL_BUY']).default('FULL_BUY'),
  gameMode: z.enum(['COMPETITIVE', 'UNRATED', 'CUSTOM']).default('COMPETITIVE'),
  players: z.array(z.object({
    name: z.string().min(1),
    agent: z.string().min(1),
    team: z.enum(['ATTACK', 'DEFENSE']),
    color: z.string().regex(/^#[0-9A-F]{6}$/i)
  }))
});

// GET /api/scenarios - 시나리오 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const isPublic = searchParams.get('public') === 'true';
    const userId = searchParams.get('userId');

    const where = {
      ...(isPublic && { isPublic: true }),
      ...(userId && { createdBy: userId })
    };

    const [scenarios, total] = await Promise.all([
      prisma.scenario.findMany({
        where,
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
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.scenario.count({ where })
    ]);

    const response: ApiResponse = {
      success: true,
      data: {
        scenarios,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('GET /api/scenarios error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch scenarios' } as ApiResponse,
      { status: 500 }
    );
  }
}

// POST /api/scenarios - 새 시나리오 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // TODO: 실제 프로젝트에서는 인증된 사용자 ID를 가져와야 합니다
    const userId = 'temp-user-id'; // 임시 사용자 ID
    
    const validatedData = createScenarioSchema.parse(body);

    const scenario = await prisma.scenario.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        mapId: validatedData.mapId,
        isPublic: validatedData.isPublic,
        tags: validatedData.tags,
        roundType: validatedData.roundType,
        gameMode: validatedData.gameMode,
        createdBy: userId,
        players: {
          create: validatedData.players
        }
      },
      include: {
        players: true,
        user: {
          select: { id: true, username: true, name: true }
        }
      }
    });

    const response: ApiResponse = {
      success: true,
      data: scenario,
      message: 'Scenario created successfully'
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('POST /api/scenarios error:', error);
    
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
      { success: false, error: 'Failed to create scenario' } as ApiResponse,
      { status: 500 }
    );
  }
}
