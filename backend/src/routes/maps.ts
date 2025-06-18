import { Router } from 'express'
import { prisma } from '../lib/prisma'
import { authenticateToken } from '../middleware/auth'

const router = Router()

// 모든 맵 조회
router.get('/', async (req, res) => {
  try {
    const maps = await prisma.map.findMany({
      orderBy: { name: 'asc' }
    })
    
    res.json(maps)
  } catch (error) {
    console.error('Error fetching maps:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// 특정 맵 조회  
router.get('/:id', async (req, res) => {
  try {
    const map = await prisma.map.findUnique({
      where: { id: req.params.id }
    })
    
    if (!map) {
      return res.status(404).json({ error: 'Map not found' })
    }
    
    res.json(map)
  } catch (error) {
    console.error('Error fetching map:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// 맵 생성 (관리자용)
router.post('/', authenticateToken, async (req: any, res) => {
  try {
    const {
      id,
      name,
      displayName,
      imageUrl,
      viewImageUrl,
      width,
      height,
      sites,
      callouts
    } = req.body
    
    const map = await prisma.map.create({
      data: {
        id,
        name,
        displayName,
        imageUrl,
        viewImageUrl,
        width,
        height,
        sites: JSON.stringify(sites),
        callouts: JSON.stringify(callouts)
      }
    })
    
    res.status(201).json(map)
  } catch (error) {
    console.error('Error creating map:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
