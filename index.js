const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Permitir solicitudes desde cualquier origen
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Permitir los métodos HTTP especificados
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Permitir los encabezados especificados
    next();
  });

app.use(require('./controllers/login.controller'));
app.use(require('./controllers/productos.controller'));
app.use(require('./controllers/compras.controller'));

const port = 3000;

app.listen(port,() => {
    console.log("Servidor corriendo en el puerto 3000");
});

module.exports = app;