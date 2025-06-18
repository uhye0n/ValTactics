import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { UpdateScenarioRequest, ApiResponse } from '@/types/api';
import { z } from 'zod';

const updateScenarioSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
  mapId: z.string().min(1).optional(),
  isPublic: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  roundType: z.enum(['PISTOL', 'ECO', 'FORCE_BUY', 'FULL_BUY']).optional(),
  gameMode: z.enum(['COMPETITIVE', 'UNRATED', 'CUSTOM']).optional(),
  duration: z.number().min(0).optional(),
  currentTime: z.number().min(0).optional(),
  playbackSpeed: z.number().min(0.1).max(5).optional()
});

interface RouteParams {
  params: { id: string }
}

// GET /api/scenarios/[id] - 특정 시나리오 조회
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const scenario = await prisma.scenario.findUnique({
      where: { id: params.id },
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

    if (!scenario) {
      return NextResponse.json(
        { success: false, error: 'Scenario not found' } as ApiResponse,
        { status: 404 }
      );
    }

    const response: ApiResponse = {
      success: true,
      data: scenario
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error(`GET /api/scenarios/${params.id} error:`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch scenario' } as ApiResponse,
      { status: 500 }
    );
  }
}

// PUT /api/scenarios/[id] - 시나리오 업데이트
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const body = await request.json();
    const validatedData = updateScenarioSchema.parse(body);

    // 시나리오 존재 확인
    const existingScenario = await prisma.scenario.findUnique({
      where: { id: params.id }
    });

    if (!existingScenario) {
      return NextResponse.json(
        { success: false, error: 'Scenario not found' } as ApiResponse,
        { status: 404 }
      );
    }

    // TODO: 권한 확인 (사용자가 해당 시나리오의 소유자인지)

    const updatedScenario = await prisma.scenario.update({
      where: { id: params.id },
      data: validatedData,
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

    const response: ApiResponse = {
      success: true,
      data: updatedScenario,
      message: 'Scenario updated successfully'
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error(`PUT /api/scenarios/${params.id} error:`, error);

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
      { success: false, error: 'Failed to update scenario' } as ApiResponse,
      { status: 500 }
    );
  }
}

// DELETE /api/scenarios/[id] - 시나리오 삭제
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // 시나리오 존재 확인
    const existingScenario = await prisma.scenario.findUnique({
      where: { id: params.id }
    });

    if (!existingScenario) {
      return NextResponse.json(
        { success: false, error: 'Scenario not found' } as ApiResponse,
        { status: 404 }
      );
    }

    // TODO: 권한 확인 (사용자가 해당 시나리오의 소유자인지)

    await prisma.scenario.delete({
      where: { id: params.id }
    });

    const response: ApiResponse = {
      success: true,
      message: 'Scenario deleted successfully'
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error(`DELETE /api/scenarios/${params.id} error:`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete scenario' } as ApiResponse,
      { status: 500 }
    );
  }
}
