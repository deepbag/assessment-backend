const express = require("express");
const mysql = require("mysql");
var morgan = require("morgan");
const { startQuery, executeQuery } = require("./helpers");
const { config } = require("./config/config");

const app = express();
app.use(express.json());
app.use(morgan("combined"));
const port = 3000;

// database connection
const _db = mysql.createConnection({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database,
  port: config.port,
});

// connect to the database
_db.connect((err) => {
  if (err) {
    console.log("🚀", err);
  } else {
    console.log("🚀 database connected");
    startQuery(_db);
  }
});

app.post("/:collection", (request, response) => {
  try {
    const { collection } = request.params;
    const data = request.body;

    // query to get table
    const _query = `SHOW TABLES LIKE '${collection}'`;

    executeQuery(_db, _query, (error, success) => {
      if (error) return response.status(error.status).json(error);
      if (success) {
        // if no table exist create new with data
        if (success?.data?.length !== 0) {
          // columns from payload
          const columns = Object.keys(data).join(", ");
          // values from payload
          const values = Object.values(data)
            .map((value) => `'${value}'`)
            .join(", ");

          // insert column and values into table
          executeQuery(
            _db,
            `INSERT INTO ${collection} (${columns}) VALUES (${values})`,
            (error, success) => {
              if (error) return response.status(error.status).json(error);
              if (success)
                return response.status(success.status).json({
                  ...success,
                });
            }
          );
        } else {
          // if no collection found
          return response.status(500).json({ message: "no collection found" });
        }
      }
    });
  } catch (error) {
    return response
      .status(500)
      .json({ status: 500, message: "Something went wrong" });
  }
});

app.get("/:collection/:id", (request, response) => {
  try {
    const { collection } = request.params;
    const { id } = request.params;

    // query to get specific data
    const _query = `SELECT * FROM ${collection} WHERE id = '${id}'`;

    // get data
    executeQuery(_db, _query, (error, success) => {
      if (error) return response.status(error.status).json(error);
      if (success)
        return response.status(success.status).json({
          ...success,
        });
    });
  } catch (error) {
    return response
      .status(500)
      .json({ status: 500, message: "Something went wrong" });
  }
});

app.post("/:collection/:id", (request, response) => {
  try {
    const { collection } = request.params;
    const { id } = request.params;
    const data = request.body;

    // query to update data
    const _query = `UPDATE ${collection} SET ${Object.keys(data).map(
      (_r) => `${_r} = '${data[_r]}'`
    )} WHERE id = '${id}'`;

    // update
    executeQuery(_db, _query, (error, success) => {
      if (error) return response.status(error.status).json(error);
      if (success)
        return response.status(success.status).json({
          ...success,
        });
    });
  } catch (error) {
    return response
      .status(500)
      .json({ status: 500, message: "Something went wrong" });
  }
});

app.delete("/:collection/:id", (request, response) => {
  try {
    const { collection } = request.params;
    const { id } = request.params;

    // query to delete specific id
    const _query = `DELETE FROM ${collection} WHERE id = '${id}'`;

    // delete
    executeQuery(_db, _query, (error, success) => {
      if (error) return response.status(error.status).json(error);
      if (success)
        return response.status(success.status).json({
          ...success,
        });
    });
  } catch (error) {
    return response
      .status(500)
      .json({ status: 500, message: "Something went wrong" });
  }
});

app.listen(port, () => {
  console.log("🚀", port);
});

module.exports = app;
