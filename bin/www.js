#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require('../app');
var debug = require('debug')('we:server');
var http = require('http');
var fs = require('fs');
var path = require('path');
const mongoose = require('mongoose');

const httpsOptions = {
  key: fs.readFileSync(path.join(__dirname, 'ssl.key')),
  cert: fs.readFileSync(path.join(__dirname, 'ssl.pem')),
};

// 连接数据库
// const options = {
// 	user : "test",
//   pass : "123"
// }

mongoose.connect('mongodb://@127.0.0.1:27017/gray-class-db', err=>{
  if(err)
    console.log("Failed to connect MongoDB Server!");
  else
    console.log("Succeed in connecting MongoDB Server!");
});

/**
 * Get port from environment and store in Express.
 */

var port = '2333';
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
