const express = require("express");
const cors = require("cors");
const app = express();
const COMPRAS_LOGIN = require("../constants/compras.path");
const { connection } = require("../database/connection.database");

app.use(cors());
app.use(express.json());

// Obtener todas las órdenes
// Obtener todas las órdenes con precio total
const getOrdenes = (request, response) => {
    const query = `
        SELECT 
            ORDENES.*, 
            SUM(PRODUCTO.PRECIOPRODUCTO * DETALLEORDEN.CANTIDADPRODUCTO) AS PRECIOTOTAL
        FROM 
            ORDENES
        LEFT JOIN 
            DETALLEORDEN ON ORDENES.IDORDEN = DETALLEORDEN.IDORDEN
        LEFT JOIN 
            PRODUCTO ON DETALLEORDEN.IDPRODUCTO = PRODUCTO.IDPRODUCTO
        GROUP BY 
            ORDENES.IDORDEN;
    `;

    connection.query(query, (error, results) => {
        if (error) {
            console.error("Error al obtener órdenes:", error.message);
            response.status(500).json({ error: "Error al obtener órdenes" });
            return;
        }
        response.status(200).json(results);
    });
};

// Agregar una orden (si es necesario)
// Agregar una orden
const postCompra = (request, res) => {
    const orden = request.body;
    // Insertar la orden en la tabla ORDENES
  connection.query('INSERT INTO ORDENES SET ?', {
    NOMBRECLIENTE: orden.NOMBRECLIENTE,
    APELLIDOCLIENTE: orden.APELLIDOCLIENTE,
    CEDULACLIENTE: orden.CEDULACLIENTE,
    DIRECCIONCLIENTE: orden.DIRECCIONCLIENTE,
    CELULARCLIENTE: orden.CELULARCLIENTE,
    FECHAORDEN: orden.FECHAORDEN
  }, (err, results) => {
    if (err) {
      console.error('Error al insertar la orden:', err);
      res.status(500).send('Error interno del servidor');
      return;
    }

    const idOrden = results.insertId;

    // Insertar el detalle de la orden en la tabla DETALLEORDEN
    orden.productos.forEach(producto => {
      connection.query('INSERT INTO DETALLEORDEN SET ?', {
        IDORDEN: idOrden,
        IDPRODUCTO: producto.IDPRODUCTO,
        CANTIDADPRODUCTO: producto.PRODUCTOCANTIDAD,
        TOTALDETALLE: producto.PRODUCTOCANTIDAD * producto.PRECIOPRODUCTO
      }, (err, results) => {
        if (err) {
          console.error('Error al insertar el detalle de la orden:', err);
          res.status(500).send('Error interno del servidor');
          return;
        }
      });
    });

    res.status(200).send('Orden creada exitosamente');
    });
    
};



// Editar una orden (si es necesario)

// Eliminar una orden (si es necesario)

// Rutas
app.route(COMPRAS_LOGIN)
    .get(getOrdenes)
    .post(postCompra);
    // Puedes agregar más métodos HTTP aquí según sea necesario

module.exports = app;
