import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { z } from 'zod';

// 시나리오 생성 스키마
const createScenarioSchema = z.object({
  title: z.string().min(1, '제목은 필수입니다'),
  description: z.string().optional(),
  mapId: z.string().min(1, '맵 ID는 필수입니다'),
  isPublic: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  players: z.array(z.object({
    name: z.string(),
    agent: z.string(),
    team: z.enum(['attack', 'defense']),
    color: z.string()
  })),
  timeline: z.object({
    duration: z.number().default(120000),
    currentTime: z.number().default(0),
    isPlaying: z.boolean().default(false),
    playbackSpeed: z.number().default(1.0)
  }).optional()
});

// GET /api/scenarios - 시나리오 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const isPublic = searchParams.get('public') === 'true';
    
    const scenarios = await prisma.scenario.findMany({
      where: isPublic ? { isPublic: true } : {},
      include: {
        user: {
          select: { id: true, username: true, avatar: true }
        },
        players: true,
        _count: {
          select: { actions: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit
    });

    const total = await prisma.scenario.count({
      where: isPublic ? { isPublic: true } : {}
    });

    return NextResponse.json({
      scenarios,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('시나리오 조회 오류:', error);
    return NextResponse.json(
      { error: '시나리오를 조회할 수 없습니다.' },
      { status: 500 }
    );
  }
}

// POST /api/scenarios - 새 시나리오 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createScenarioSchema.parse(body);
    
    // TODO: 실제 구현에서는 JWT 토큰에서 사용자 ID 추출
    const userId = "temp-user-id"; // 임시 사용자 ID
    
    const scenario = await prisma.scenario.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        mapId: validatedData.mapId,
        isPublic: validatedData.isPublic,
        tags: validatedData.tags,
        createdBy: userId,
        players: {
          create: validatedData.players
        },
        timeline: validatedData.timeline ? {
          create: validatedData.timeline
        } : undefined
      },
      include: {
        players: true,
        timeline: true,
        user: {
          select: { id: true, username: true, avatar: true }
        }
      }
    });

    return NextResponse.json(scenario, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: '입력 데이터가 올바르지 않습니다.', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('시나리오 생성 오류:', error);
    return NextResponse.json(
      { error: '시나리오를 생성할 수 없습니다.' },
      { status: 500 }
    );
  }
}
