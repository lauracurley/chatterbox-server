/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var data = require('./data.json');
var randomstring = require('randomstring');
var fs = require('fs');
var path = require('path');


var addMessage = function(message) {
  message.createdAt = new Date();
  message.objectId = randomstring.generate(10);
  message.updatedAt = new Date();
  if (!message.roomname) { message.roomname = 'lobby'; }
  //write to file
  data.results.unshift(message);
  fs.writeFile("./data.json", JSON.stringify(data), function(err) {
    if(err) {
      return console.log(err);
    }

    console.log("The file was saved!");
  }); 

};

var serveStatic = function(request, response) {
  var mimeTypes = {
    '.js': 'text/javascript',
    '.html': 'text/html',
    '.css': 'text/css'
  };
  var lookup, f;
  if (request.url === '/') { 
    lookup = '/index.html'; 
  } else {
    lookup = request.url;
  }

  // var lookup = path.basename(decodeURI(request.url)) || 'index.html', f = lookup;
  lookup = '../client' + lookup; f = lookup; 
  fs.exists(f, function (exists) {
    if (exists) {
      fs.readFile(f, function(err, data) {
        if (err) {
          response.writeHead(404); response.end('Server Error!');
          return;
        }
      
        var headers = {'Content-type': mimeTypes[path.extname(request.url)]};  
        response.writeHead(200, headers);
        response.end(data);
      });
      return;
    }
    //doesn't exist
    response.writeHead(404);
    response.end();
  });
};

var requestHandler = function(request, response) {
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  if (request.method === 'GET' && request.url === '/classes/messages?order=-createdAt') {
    var statusCode = 200;
    var headers = defaultCorsHeaders;
    headers['Content-Type'] = 'json';
    response.writeHead(statusCode, headers);
    response.end(JSON.stringify(data));

  } else if (request.method === 'POST' && request.url === '/classes/messages') {
    var statusCode = 201;
    var headers = defaultCorsHeaders;
    var body = [];
    headers['Content-Type'] = 'json';
    response.writeHead(statusCode, headers);
    
    
    var body = '';
    request.on('data', function (chunk) {
      body += chunk;
    });

    request.on('end', function () {
      var jsonObj = JSON.parse(body);
      addMessage(jsonObj);
      response.end(JSON.stringify(data));
    });

  } else if (request.method === 'OPTIONS' && (request.url === '/classes/messages?order=-createdAt' || request.url === '/classes/messages')) {
    var statusCode = 200;
    var headers = defaultCorsHeaders;
    headers['Allow'] = 'GET,POST,OPTIONS';
    headers['Access-Control-Allow-Headers'] = 'X-Parse-REST-API-Key, X-Parse-Javascript-Key, X-Parse-Application-Id, X-Parse-Client-Version, X-Parse-Session-Token, X-Requested-With, X-Parse-Revocable-Session, Content-Type';
    headers['X-Parse-Application-Id'] = 'id';
    headers['X-Parse-REST-API-Key'] = 'key';
    response.writeHead(statusCode, headers);
    response.end('OK');
  } else {
    serveStatic(request, response);
    // var statusCode = 404;
    // var headers = defaultCorsHeaders;
    // headers['Content-Type'] = 'json';
    // response.writeHead(statusCode, headers);
    // response.end('ERROR');
  }



  // The outgoing status.
  // var statusCode = 200;

  // See the note below about CORS headers.
  // var headers = defaultCorsHeaders;

  // Tell the client we are sending them plain text.
  
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.
  // headers['Content-Type'] = 'text/plain';

  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.
  // response.writeHead(statusCode, headers);

  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
  // response.end('Hello, World!');
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

exports.requestHandler = requestHandler;

