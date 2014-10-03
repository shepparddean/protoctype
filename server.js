// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express'); 		// call express
var app        = express(); 				// define our app using express
var mongoose = require('mongoose'); 					// mongoose for mongodb
var morgan = require('morgan'); 			// log requests to the console (express4)
var bodyParser = require('body-parser');
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)


// configure app to use bodyParser()
// this will let us get the data from a POST
mongoose.connect('mongodb://localhost/test'); // connect to our database

app.use(express.static(__dirname + '/public')); 				// set the static files location /public/img will be /img for users
app.use(morgan('dev')); 										// log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'})); 			// parse application/x-www-form-urlencoded
app.use(bodyParser.json()); 									// parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());



var port = process.env.PORT || 8080; 		// set our port


var User     = require('./models/user');


// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); 				// get an instance of the express Router


// middleware to use for all requests
router.use(function(req, res, next) {
	// do logging
	next(); // make sure we go to the next routes and don't stop here
});


// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
	res.json({ message: 'hooray! welcome to our api!' });	
});

router.route('/users')

	// create a bear (accessed at POST http://localhost:8080/api/bears)
	.post(function(req, res) {
	
		User.create({
			name : req.body.name,  // set the user name (comes from the request)
			password : req.body.password
		}, function(err, user) {
			if (err)
				res.send(err);

			res.json({ message: 'User created!' });

		});
	})

	.get(function(req, res) {
		User.find(function(err, users) {
			if (err)
				res.send(err);

			res.json(users);
		});
	});


router.route('/users/:user_id')

	.get(function(req, res) {
		User.findById(req.params.user_id, function(err, user) {
			if (err)
				res.send(err);
			
			res.json(user);
		});
	})

	.put(function(req, res) {

		// use our bear model to find the bear we want
		User.findById(req.params.user_id, function(err, user) {

			if (err)
				res.send(err);

			user.name = req.body.name; 	// update the users info
			user.password = req.body.password;


			// save the bear
			user.save(function(err) {
				if (err)
					res.send(err);

				res.json({ message: 'User updated!' });
			});

		});
	})

	.delete(function(req, res) {
		User.remove({
			_id: req.params.user_id
		}, function(err, user) {
			if (err)
				res.send(err);

			res.json({ message: 'Successfully deleted' });
		});
	});



// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);


// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);