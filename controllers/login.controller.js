const express = require("express");
const app = express();
const LOGIN_PATH = require("../constants/login.path");
const {connection} = require("../database/connection.database");

const getPersona = (request, response) => {
    connection.query("SELECT * FROM usuario", 
    (error, results) => {
        if(error)
            throw error;
        response.status(200).json(results);
    });
};

//ruta
app.route(LOGIN_PATH).get(getPersona);


const postUsuario = (request, response) => {
    const { EMAILUSUARIO, PASSUSUARIO} = request.body;
    connection.query("INSERT INTO usuario(EMAILUSUARIO, PASSUSUARIO) VALUES (?,?) ", 
    [EMAILUSUARIO,PASSUSUARIO],
    (error, results) => {
        if(error)
            throw error;
        response.status(201).json({"Item añadido correctamente": results.affectedRows});
    });
};
app.route(LOGIN_PATH).post(postUsuario);


const getPersonaByEmail = (request, response) => {
    const { email } = request.params;
    connection.query("SELECT * FROM usuario WHERE EMAILUSUARIO = ?", [email], (error, results) => {
      if (error) {
        console.error("Error al obtener usuario por email:", error.message);
        response.status(500).json({ error: "Error interno al obtener usuario por email" });
        return;
      }
      if (results.length === 0) {
        response.status(404).json({ error: "Usuario no encontrado" });
        return;
      }
      response.status(200).json(results[0]);
    });
  };
  

// Ruta
app.route(`${LOGIN_PATH}/:email`).get(getPersonaByEmail);
module.exports = app;