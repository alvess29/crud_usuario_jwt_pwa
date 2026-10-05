require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('path')
const swaggerUi = require('swagger-ui-express')
const swaggerSpec = require('./config/swagger')
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, '../frontend')))

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

mongoose.connect(process.env.MONGO_URI)
  .catch(error => console.error('Erro ao conectar no MongoDB:', error.message))

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Servidor em http://localhost:${port}`)
  console.log(`Swagger em http://localhost:${port}/api-docs`)
})
