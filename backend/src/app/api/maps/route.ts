import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { CreateMapRequest, ApiResponse } from '@/types/api';
import { z } from 'zod';

const createMapSchema = z.object({
  name: z.string().min(1).max(50),
  imageUrl: z.string().url(),
  viewImageUrl: z.string().url(),
  width: z.number().min(1),
  height: z.number().min(1),
  callouts: z.array(z.object({
    name: z.string().min(1),
    positionX: z.number(),
    positionY: z.number(),
    areaX: z.number(),
    areaY: z.number(),
    areaWidth: z.number(),
    areaHeight: z.number()
  })).optional()
});

// GET /api/maps - 맵 목록 조회
export async function GET(request: NextRequest) {
  try {
    const maps = await prisma.map.findMany({
      include: {
        callouts: true
      },
      orderBy: { name: 'asc' }
    });

    const response: ApiResponse = {
      success: true,
      data: maps
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('GET /api/maps error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch maps' } as ApiResponse,
      { status: 500 }
    );
  }
}

// POST /api/maps - 새 맵 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createMapSchema.parse(body);

    const map = await prisma.map.create({
      data: {
        name: validatedData.name,
        imageUrl: validatedData.imageUrl,
        viewImageUrl: validatedData.viewImageUrl,
        width: validatedData.width,
        height: validatedData.height,
        callouts: validatedData.callouts ? {
          create: validatedData.callouts
        } : undefined
      },
      include: {
        callouts: true
      }
    });

    const response: ApiResponse = {
      success: true,
      data: map,
      message: 'Map created successfully'
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('POST /api/maps error:', error);
    
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
      { success: false, error: 'Failed to create map' } as ApiResponse,
      { status: 500 }
    );
  }
}
