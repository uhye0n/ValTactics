import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import { createServer } from 'http'
import { Server } from 'socket.io'

// Routes
import authRoutes from './routes/auth'
import scenarioRoutes from './routes/scenarios_simple'
import mapRoutes from './routes/maps'
import userRoutes from './routes/users'

// Middleware
import { errorHandler } from './middleware/errorHandler'
import { requestLogger } from './middleware/requestLogger'

dotenv.config()

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
})

const PORT = process.env.PORT || 3001

// Middleware
app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(requestLogger)

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/scenarios', scenarioRoutes)
app.use('/api/maps', mapRoutes)
app.use('/api/users', userRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

// Socket.IO for real-time collaboration
io.on('connection', (socket) => {
  console.log('User connected:', socket.id)
  
  // 시나리오 편집 방 참가
  socket.on('join-scenario', (scenarioId) => {
    socket.join(`scenario-${scenarioId}`)
    console.log(`User ${socket.id} joined scenario ${scenarioId}`)
  })
  
  // 실시간 시나리오 업데이트
  socket.on('scenario-update', (data) => {
    socket.to(`scenario-${data.scenarioId}`).emit('scenario-updated', data)
  })
  
  // 타임라인 동기화
  socket.on('timeline-sync', (data) => {
    socket.to(`scenario-${data.scenarioId}`).emit('timeline-synced', data)
  })
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
  })
})

// Error handling
app.use(errorHandler)

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📊 Environment: ${process.env.NODE_ENV}`)
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL}`)
})
