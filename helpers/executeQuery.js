exports.executeQuery = (_db, _query, callback) => {
  _db.query(_query, (err, success) => {
    console.log(err, success)
    if (err) {
      callback(
        {
          status: 500,
          message: "Something went wrong",
        },
        null
      );
    } else {
      callback(null, { status: 200, data: success });
    }
  });
};
