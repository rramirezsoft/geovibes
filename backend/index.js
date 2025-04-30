require('dotenv').config();

// -- IMPORTS -- 
// Core Modules
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// Middlewares
const errorHandler = require('./middleware/errorHandler.js');

// Configurations 
const { connectMongoDB } = require('./config/mongo.js');
const { connectRedis } = require('./config/redis.js');

// Logging & Monitoring
const morganBody = require('morgan-body');
const loggerStream = require('./utils/handleLogger.js');

// Documentation
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('./docs/swagger.js');

// Routes
const authRoutes = require('./routes/auth.js');
const userRoutes = require('./routes/user.js');
const placeRoutes = require('./routes/place.js');
const userPlaceRoutes = require('./routes/userPlace.js');


// Inicialización de la app
const app = express();

// Conexion base de datos 
connectMongoDB(); // MongoDB
connectRedis(); // Redis

// Jobs
require('./jobs/cleanUnverifiedUsers.js'); // Limpia usuarios no verificados

// Configuración de CORS
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:8080', // Permite que solo el frontend se comunique con el backend
    credentials: true,                       // Permite enviar cookies y cabeceras
}

// logs con slack
morganBody(app, {
    noColors: true,
    skip: function (req, res) { 
        return res.statusCode < 500; 
    },
    stream: loggerStream
})

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJsdoc));

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(errorHandler);

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/place', placeRoutes);
app.use('/api/userPlace', userPlaceRoutes);

// Puerto
const port = process.env.PORT || 3001;

// Iniciamos el servidor
app.listen(port, () => {
    console.log("Servidor escuchando en el puerto " + port)
    // pintamos en el navegador un texto para verificar que el servidor esta corriendo
    app.get('/', (req, res) => {
        res.send('API funcionando correctamente')
    })

})

module.exports = app;