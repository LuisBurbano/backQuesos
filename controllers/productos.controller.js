const express = require("express");
const cors = require("cors");
const app = express();
const PRODUCTOS_LOGIN = require("../constants/productos.path");
const { connection } = require("../database/connection.database");

app.use(cors());
app.use(express.json());

// Obtener todos los productos
const getProductos = (request, response) => {
    connection.query("SELECT * FROM PRODUCTO", (error, results) => {
        if (error) {
            response.status(500).json({ error: "Error al obtener productos" });
            return;
        }
        response.status(200).json(results);
    });
};

// Agregar un producto
const postProductos = (request, response) => {
    const { NOMBREPRODUCTO, IMAGENPRODUCTO, PRECIOPRODUCTO } = request.body;
    
    // Validación de datos
    if (!NOMBREPRODUCTO || !IMAGENPRODUCTO || !PRECIOPRODUCTO) {
        response.status(400).json({ error: "Los datos del producto son incompletos" });
        return;
    }
    
    connection.query(
        "INSERT INTO PRODUCTO(NOMBREPRODUCTO, IMAGENPRODUCTO, PRECIOPRODUCTO) VALUES (?,?,?)",
        [NOMBREPRODUCTO, IMAGENPRODUCTO, PRECIOPRODUCTO],
        (error, results) => {
            if (error) {
                console.error("Error al agregar producto:", error.message);
                response.status(500).json({ error: "Error interno al agregar producto" });
                return;
            }
            response.status(201).json({ "Producto añadido correctamente": { id: results.insertId, NOMBREPRODUCTO, IMAGENPRODUCTO, PRECIOPRODUCTO } });
        }
    );
};

const putProducto = (request, response) => {
    
    const { NOMBREPRODUCTO, IMAGENPRODUCTO, PRECIOPRODUCTO, IDPRODUCTO } = request.body;

    connection.query(
        "UPDATE PRODUCTO SET NOMBREPRODUCTO = ?, IMAGENPRODUCTO = ?, PRECIOPRODUCTO = ? WHERE IDPRODUCTO = ?;",
        [NOMBREPRODUCTO, IMAGENPRODUCTO, PRECIOPRODUCTO, IDPRODUCTO],
        (error, results) => {
            if (error) {
                console.error("Error al editar producto:", error.message);
                response.status(500).json({ error: "Error interno al editar producto" });
                return;
            }
            
            response.status(200).json({ message: "Producto editado correctamente" });
        }
    );
};


// Eliminar un producto
const deleteProducto = (request, response) => {
    const id = request.params.id;

    connection.query(
        "DELETE FROM PRODUCTO WHERE IDPRODUCTO = ?",
        [id],
        (error, results) => {
            if (error) {
                console.error("Error al eliminar producto:", error.message);
                response.status(500).json({ error: "Error interno al eliminar producto" });
                return;
            }
            response.status(200).json({ message: "Producto eliminado correctamente" });
        }
    );
};

// Rutas
app.route(PRODUCTOS_LOGIN)
    .get(getProductos)
    .post(postProductos);

app.route(`${PRODUCTOS_LOGIN}/:id`)
    .put(putProducto)
    .delete(deleteProducto);

module.exports = app;
