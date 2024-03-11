import connection from "../database/connection.database.js";

export const obtainAllUsers = async () => {
  try {
    const userList = [];
    const query = "SELECT * FROM persona"; // Cambia "persona" por el nombre de tu tabla
    connection.query(query, (error, results, fields) => {
      if (error) {
        console.error("Error al obtener los usuarios: ", error);
        throw error;
      }
      results.forEach((row) => {
        userList.push(row);
      });
    });
    return userList;
  } catch (error) {
    console.error("Error obtaining users: ", error);
    throw error;
  }
};

export const obtainUserByCedula = async (email) => {
  try {
    const query = "SELECT * FROM users WHERE email = ?"; // Cambia "users" por el nombre de tu tabla
    const result = await connection.query(query, [email]);
    if (result.length > 0) {
      return result[0];
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error obtaining user by email: ", error);
    throw error;
  }
};

export const insertUser = async (user) => {
  try {
    const query = "INSERT INTO users SET ?"; // Cambia "users" por el nombre de tu tabla
    const result = await connection.query(query, user);
    console.log("User inserted with ID: ", result.insertId);
    return result.insertId;
  } catch (error) {
    console.error("Error inserting user: ", error);
    throw error;
  }
};
