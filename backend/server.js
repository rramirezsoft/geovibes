const app = require('./app.js');
const port = process.env.PORT || 3001;

// Iniciamos el servidor
app.listen(port, () => {
  console.log('Servidor escuchando en el puerto ' + port);
});
