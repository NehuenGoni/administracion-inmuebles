const express = require('express');
const mongoose = require('mongoose');
const tenantsRoutes = require('./routes/tenants')
const paymentRoutes = require('./routes/payments');
const cors = require('cors')

const app = express();
const port = 3001; // Puerto en el que el servidor escuchará

// Habilita CORS para todas las solicitudes
app.use(cors());

// Conexión a MongoDB
mongoose.connect('mongodb+srv://nehuen_goni:K1HcUR7zsTYbccE0@tenantapp.zjj8b.mongodb.net/tenantApp?retryWrites=true&w=majority&appName=tenantApp', {
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

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});