// Example express application adding the parse-server module to expose Parse
// compatible API routes.

var express = require('express');
var cors = require('cors'); // add this line below it
var ParseServer = require('parse-server').ParseServer;
var path = require('path');

var databaseUri = process.env.DATABASE_URI || process.env.MONGOLAB_URI;

if (!databaseUri) {
  console.log('DATABASE_URI not specified, falling back to localhost.');
}

var api = new ParseServer({
  databaseURI: databaseUri || 'mongodb://localhost:27017/dev',
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId: process.env.APP_ID || 'Zrb6jucmZ5pj82G4mIXtgqw7QTmYtljeKSxFBLyg',
  masterKey: process.env.MASTER_KEY || 'QA3njV4Y6KAoFNQOfZ5C15G0g1pzs5arhwKhhIBW', //Add your master key here. Keep it secret!
  serverURL: process.env.SERVER_URL || 'http://localhost:1337/parse', 
javascriptKey: process.env.JAVASCRIPT_KEY || 'SSWjgQW7vpirYtHl39BLSk4YSWLlRm0c8mZ4ZOol',  //** add this line no need to set values, they will be overwritten by heroku config vars
  restAPIKey: process.env.REST_API_KEY || 'SgBhQBSQdkHg0cYPLfktxtkwrU79t5eEESywobxs', //** add this line
  dotNetKey: process.env.DOT_NET_KEY || 't10ae2pkgoTfCmm5gPE05ut5rPsCzol6VTFzpm5c', //** add this line
  clientKey: process.env.CLIENT_KEY || 'zy9FKpQGQwnwArN2OFaN8s1VUdKxBH5QquuyRViA', //** add this line  // Don't forget to change to https if needed
  liveQuery: {
    classNames: ["Posts", "Comments"] // List of classes to support for query subscriptions
  }
});
// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey

var app = express();
app.use(cors()); // add this line below it

// Serve static assets from the /public folder
app.use('/public', express.static(path.join(__dirname, '/public')));

// Serve the Parse API on the /parse URL prefix
var mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api);

// Parse Server plays nicely with the rest of your web routes
app.get('/', function(req, res) {
  res.status(200).send('Make sure to star the parse-server repo on GitHub!');
});

// There will be a test page available on the /test path of your server url
// Remove this before launching your app
app.get('/test', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/test.html'));
});

var port = process.env.PORT || 1337;
var httpServer = require('http').createServer(app);
httpServer.listen(port, function() {
    console.log('parse-server-example running on port ' + port + '.');
});

// This will enable the Live Query real-time server
ParseServer.createLiveQueryServer(httpServer);

