import { Router } from 'express'
import { prisma } from '../lib/prisma'
import { authenticateToken } from '../middleware/auth'

const router = Router()

// 사용자 프로필 조회
router.get('/profile', authenticateToken, async (req: any, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
        rank: true,
        level: true,
        createdAt: true,
        lastLoginAt: true
      }
    })
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    
    res.json(user)
  } catch (error) {
    console.error('Error fetching user profile:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// 사용자 프로필 업데이트
router.put('/profile', authenticateToken, async (req: any, res) => {
  try {
    const { username, avatar, rank, level } = req.body
    
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...(username && { username }),
        ...(avatar && { avatar }),
        ...(rank && { rank }),
        ...(level && { level })
      },
      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
        rank: true,
        level: true,
        createdAt: true,
        lastLoginAt: true
      }
    })
    
    res.json(updatedUser)
  } catch (error) {
    console.error('Error updating user profile:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
