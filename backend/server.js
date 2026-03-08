require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const tenantsRoutes = require('./routes/tenants')
const paymentRoutes = require('./routes/payments');
const userRoutes = require('./routes/users')
const authRoutes = require('./routes/auth')
const adminRoutes = require('./routes/admin')

const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const authenticateToken = require('./middlewares/authenticateToken');

const app = express();
const port = process.env.PORT;

// Security headers
app.use(helmet());

// CORS - only allow specific origins
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:3000'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { message: 'Demasiados intentos, intente nuevamente en 15 minutos' },
});
app.use('/users/login', authLimiter);
app.use('/users/register', authLimiter);

// MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Conectado a MongoDB'))
.catch((error) => console.error('Error al conectar a MongoDB:', error));

// Middleware para parsear JSON
app.use(express.json());

// Test
app.get('/', (req, res) => {
  res.send('Backend funcionando');
});

// Rutas
app.use('/tenants', tenantsRoutes);
app.use('/payments', paymentRoutes);
app.use('/users', userRoutes);
app.use('/auth', authRoutes)
app.use('/admin', adminRoutes)

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo`);
});