const collar = require('../../collar.js');

// enable dev tool
var DevToolAddon = require('../../collar.js-dev-client');
collar.use(new DevToolAddon());
// collar.enableDevtool();


const lib = require('./libs/index');

var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var session    = require('express-session');
var viewRouter = require('./router/view');
var apiRouter  = require('./router/api');
var webapiRouter  = require('./router/webapi');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  secret: 'encodar session secret',
  cookie: {} // TODO: ENABLE SECURE ON PRODUCTION!!!!
}));
app.set('view engine', 'ejs');

var port = process.env.PORT || 8080;        // set our port

app.use('/api', apiRouter);
app.use('/webapi', webapiRouter);
app.use('/', viewRouter);

/* 404: This is the LAST route!!! */
app.get('*', function(req, res){
  let session = req.session;
  res.render('404', {
    user: session.user
  });
});


app.listen(port);
console.log('server started on port ' + port);
