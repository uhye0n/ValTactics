import { prisma } from './lib/prisma'
import bcrypt from 'bcryptjs'

const VALORANT_MAPS = [
  {
    id: 'abyss',
    name: 'Abyss',
    displayName: 'ABYSS',
    imageUrl: '/resources/images/map/Abyss_map.webp',
    viewImageUrl: '/resources/images/view/Abyss.webp',
    width: 1024,
    height: 1024,
    sites: ['A', 'B'],
    callouts: ['Mid', 'A Site', 'B Site', 'Spawn']
  },
  {
    id: 'ascent',
    name: 'Ascent',
    displayName: 'ASCENT',
    imageUrl: '/resources/images/map/Ascent_map.webp',
    viewImageUrl: '/resources/images/view/Ascent.webp',
    width: 1024,
    height: 1024,
    sites: ['A', 'B'],
    callouts: ['Mid', 'A Site', 'B Site', 'Catwalk', 'Market']
  },
  {
    id: 'bind',
    name: 'Bind',
    displayName: 'BIND',
    imageUrl: '/resources/images/map/Bind_map.webp',
    viewImageUrl: '/resources/images/view/Bind.webp',
    width: 1024,
    height: 1024,
    sites: ['A', 'B'],
    callouts: ['Teleporter A', 'Teleporter B', 'A Site', 'B Site', 'Hookah']
  },
  {
    id: 'breeze',
    name: 'Breeze',
    displayName: 'BREEZE',
    imageUrl: '/resources/images/map/Breeze_map.webp',
    viewImageUrl: '/resources/images/view/Breeze.webp',
    width: 1024,
    height: 1024,
    sites: ['A', 'B'],
    callouts: ['Mid', 'A Site', 'B Site', 'Pyramid', 'Cave']
  },
  {
    id: 'fracture',
    name: 'Fracture',
    displayName: 'FRACTURE',
    imageUrl: '/resources/images/map/Fracture_map.webp',
    viewImageUrl: '/resources/images/view/Fracture.webp',
    width: 1024,
    height: 1024,
    sites: ['A', 'B'],
    callouts: ['A Site', 'B Site', 'Dish', 'Rope', 'Arcade']
  },
  {
    id: 'haven',
    name: 'Haven',
    displayName: 'HAVEN',
    imageUrl: '/resources/images/map/Haven_map.webp',
    viewImageUrl: '/resources/images/view/Haven.webp',
    width: 1024,
    height: 1024,
    sites: ['A', 'B', 'C'],
    callouts: ['A Site', 'B Site', 'C Site', 'Garage', 'Long C']
  },
  {
    id: 'icebox',
    name: 'Icebox',
    displayName: 'ICEBOX',
    imageUrl: '/resources/images/map/Icebox_map.webp',
    viewImageUrl: '/resources/images/view/Icebox.webp',
    width: 1024,
    height: 1024,
    sites: ['A', 'B'],
    callouts: ['A Site', 'B Site', 'Mid', 'Kitchen', 'Tube']
  },
  {
    id: 'lotus',
    name: 'Lotus',
    displayName: 'LOTUS',
    imageUrl: '/resources/images/map/Lotus_map.webp',
    viewImageUrl: '/resources/images/view/Lotus.webp',
    width: 1024,
    height: 1024,
    sites: ['A', 'B', 'C'],
    callouts: ['A Site', 'B Site', 'C Site', 'Tree', 'Stairs']
  },
  {
    id: 'pearl',
    name: 'Pearl',
    displayName: 'PEARL',
    imageUrl: '/resources/images/map/Pearl_map.webp',
    viewImageUrl: '/resources/images/view/Pearl.webp',
    width: 1024,
    height: 1024,
    sites: ['A', 'B'],
    callouts: ['A Site', 'B Site', 'Mid', 'Art', 'Restaurants']
  },
  {
    id: 'split',
    name: 'Split',
    displayName: 'SPLIT',
    imageUrl: '/resources/images/map/Split_map.webp',
    viewImageUrl: '/resources/images/view/Split.webp',
    width: 1024,
    height: 1024,
    sites: ['A', 'B'],
    callouts: ['A Site', 'B Site', 'Mid', 'Ramps', 'Heaven']
  },
  {
    id: 'sunset',
    name: 'Sunset',
    displayName: 'SUNSET',
    imageUrl: '/resources/images/map/Sunset_map.webp',
    viewImageUrl: '/resources/images/view/Sunset.webp',
    width: 1024,
    height: 1024,
    sites: ['A', 'B'],
    callouts: ['A Site', 'B Site', 'Mid', 'Market', 'Alley']
  }
]

async function seed() {
  try {
    console.log('🌱 Starting database seed...')
    
    // 테스트 사용자 생성
    console.log('👤 Creating test user...')
    const hashedPassword = await bcrypt.hash('password123', 10)
    const testUser = await prisma.user.upsert({
      where: { email: 'test@valtactics.com' },
      create: {
        email: 'test@valtactics.com',
        username: 'TestUser',
        password: hashedPassword,
        rank: 'Diamond 2',
        level: 127
      },
      update: {
        rank: 'Diamond 2',
        level: 127
      }
    })
    console.log('✅ Test user created:', testUser.username)    // 맵 데이터 시딩
    console.log('📍 Seeding maps...')
    for (const mapData of VALORANT_MAPS) {
      await prisma.map.upsert({
        where: { id: mapData.id },
        create: {
          id: mapData.id,
          name: mapData.name,
          displayName: mapData.displayName,
          imageUrl: mapData.imageUrl,
          viewImageUrl: mapData.viewImageUrl,
          width: mapData.width,
          height: mapData.height,
          sites: JSON.stringify(mapData.sites),
          callouts: JSON.stringify(mapData.callouts)
        },
        update: {
          name: mapData.name,
          displayName: mapData.displayName,
          imageUrl: mapData.imageUrl,
          viewImageUrl: mapData.viewImageUrl,
          width: mapData.width,
          height: mapData.height,
          sites: JSON.stringify(mapData.sites),
          callouts: JSON.stringify(mapData.callouts)
        }
      })
      console.log(`✅ ${mapData.displayName} map seeded`)
    }

    // 테스트 시나리오 생성
    console.log('🎯 Creating test scenario...')
    const testScenario = await prisma.scenario.upsert({
      where: { id: 'test-scenario-1' },
      create: {
        id: 'test-scenario-1',
        title: 'Ascent A Site Execute',
        description: 'A사이트 공격 전략 시나리오',
        mapId: 'ascent',
        mapName: 'Ascent',
        isPublic: true,
        authorId: testUser.id
      },
      update: {
        title: 'Ascent A Site Execute',
        description: 'A사이트 공격 전략 시나리오'
      }
    })
    console.log('✅ Test scenario created:', testScenario.title)
    
    console.log('🎉 Database seeding completed!')
    
  } catch (error) {
    console.error('❌ Error during seeding:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

seed().catch((error) => {
  console.error(error)
  process.exit(1)
})
