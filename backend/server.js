require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const tenantsRoutes = require('./routes/tenants')
const paymentRoutes = require('./routes/payments');
const userRoutes = require('./routes/users')
const authRoutes = require('./routes/auth')

const cors = require('cors')
const authenticateToken = require('./middlewares/authenticateToken');

const app = express();
const port = process.env.PORT;

app.use(cors());

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

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo`);
});