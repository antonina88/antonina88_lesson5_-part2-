var mysql = require('mysql');
var config = require('./config.js');

var connectionPool = mysql.createPool(config.db);

function getTasks(callback) {
  connectionPool.getConnection(function (err, connection) {
    if (err)
      throw err;
    connection.query('select * from todos order by id DESC', callback);
    connection.release();
  });
}

function getTask(callback, id) {
  connectionPool.getConnection(function (err, connection) {
    if (err)
      throw err;
    connection.query('select * from todos WHERE id = ?;', [id], callback);
    connection.release();
  });
}

function addTask (text, callback) {
  connectionPool.getConnection(function (err, connection) {
    if (err)
      throw err;
    connection.query('insert into todos (text, completed) values (?, "false");', [text], callback);
    connection.release();
  });
}

function updateTask (id, newText, callback) {
  connectionPool.getConnection(function (err, connection) {
    if (err)
      throw err;

    connection.query('update `todos` SET `text` = ? WHERE id = ?;', [newText, id], callback);
    connection.release();
  });
}

function completeTasks (id, callback) {
  connectionPool.getConnection(function (err, connection) {
    if (err)
      throw err;
    connection.query('update `todos` SET `completed` = "true" WHERE id = ?;', [id], callback);
    connection.release();
  });
}

function deleteTask (id, callback) {
  connectionPool.getConnection(function (err, connection) {
    if (err)
      throw err;
    connection.query('delete from `todos` WHERE id = ?;', [id], callback);
    connection.release();
  });
}

module.exports.getTasks = getTasks;
module.exports.getTask = getTask;
module.exports.addTask = addTask;
module.exports.deleteTask = deleteTask;
module.exports.updateTask = updateTask;
module.exports.completeTasks = completeTasks;
