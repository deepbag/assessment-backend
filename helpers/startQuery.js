const fs = require("fs");
const path = require("path");
const { executeQuery } = require("./executeQuery");

exports.startQuery = (_db) => {
  const _schemDir = path.join(__dirname, "../schemas");

  // read and create tables based on schema files
  fs.readdirSync(_schemDir).forEach((_file) => {
    if (_file.endsWith(".json")) {
      const _tableName = _file.replace(".json", "");
      const _schema = require(path.join(_schemDir, _file));
      // check if the table exists, and if not, create it
      executeQuery(
        _db,
        `SELECT * FROM information_schema.tables WHERE table_schema = 'db' AND table_name = '${_tableName}' LIMIT 1;`,
        (error, success) => {
          if (error) return console.log("table checking fail", err.message);
          if (success) {
            if (success?.data?.length === 0) {
              const _columns = Object.keys(_schema)
                .map((_name) => `${_name} ${_schema[_name]}`)
                .join(", ");

              executeQuery(
                _db,
                `CREATE TABLE ${_tableName} (${_columns})`,
                (error, success) => {
                  if (error)
                    return console.error("table creation fail", err.message);
                  if (success) console.log(`${_tableName} table created`);
                }
              );
            } else {
              executeQuery(
                _db,
                `SELECT column_name FROM information_schema.columns WHERE table_schema = 'db' AND table_name = '${_tableName}'`,
                (error, success) => {
                  if (error)
                    return console.error("table creation fail", err.message);
                  if (success?.data) {
                    const _exist = success?.data?.map((_i) => _i.COLUMN_NAME);
                    const _mmissing = Object.keys(_schema).filter(
                      (_name) => !_exist.includes(_name)
                    );
                    if (_mmissing.length > 0) {
                      const _alter = _mmissing.map((_col) => {
                        return `ADD COLUMN ${_col} ${_schema[_col]}`;
                      });
                      const _queryAlter = `ALTER TABLE ${_tableName} ${_alter.join(
                        ", "
                      )}`;
                      executeQuery(_db, _queryAlter, (error, success) => {
                        if (error)
                          return console.error(
                            `column adding fail ${err.message}`
                          );
                        if (success)
                          console.log(`missing column added in ${_tableName}`);
                      });
                    }
                  }
                }
              );
            }
          }
        }
      );
    }
  });
};
