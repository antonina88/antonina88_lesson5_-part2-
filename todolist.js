var connect = require('./pool-server.js');

var todoList = {
  list: function (callback) {
    connect.getTasks(callback);
  },

  getTask: function (callback, id) {
    connect.getTask(callback, id);
  },

  add: function (text) {
    connect.addTask(text, function(err, info) {
      if (err)
        throw err;
    });
  },

  change: function (id, newText) {
    connect.updateTask(id, newText, function(err, info) {
      if (err)
        throw err;
    });
  },

  complete: function (id) {
    connect.completeTasks(id, function(err, info) {
      if (err)
        throw err;
    });
  },

  delete: function (id) {
    connect.deleteTask(id, function(err, info) {
      if (err)
        throw err;
    });
  },
}

module.exports = todoList;
