require('dotenv').config();

// Imports
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { connectMongoDB } = require('./config/mongo.js')
const { connectRedis } = require('./config/redis.js')
const authRoutes = require('./routes/auth.js')
const userRoutes = require('./routes/user.js')
const morganBody = require('morgan-body');
const loggerStream = require('./utils/handleLogger.js')
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('./docs/swagger.js');

// Inicialización de la app
const app = express();

// Conexion base de datos 
connectMongoDB(); // MongoDB
connectRedis(); // Redis

// Configuración de CORS
const corsOptions = {
    origin: process.env.FRONTEND_URL || '*', // Permite que solo el frontend se comunique con el backend
    credentials: true,                       // Permite enviar cookies y cabeceras
}

// logs con slack
morganBody(app, {
    noColors: true,
    skip: function (req, res) { 
        return res.statusCode < 400 
    },
    stream: loggerStream
})

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJsdoc));

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

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