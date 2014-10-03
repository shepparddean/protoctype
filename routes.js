var User = require('./models/user');



module.exports = function(app, express) {


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
		
		console.log(req);
		console.log('The Name = [', req.body.name, ']');
		console.log('The pass = [', req.body.password, ']');

		User.create({
			name : req.body.name,  // set the user name (comes from the request)
			password : req.body.password
		}, function(err, user) {
			if (err)
				res.send(err);

			console.log('returning all users');
			User.find(function(err, users) {
				if (err) 
					res.send(err)

				res.json(users);
			});

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

				User.find(function(err, users) {
					if (err) {
						res.send(err)
					}

					res.json(users);
				});
			});

		});
	})

	.delete(function(req, res) {
		User.remove({
			_id: req.params.user_id
		}, function(err, user) {
			if (err)
				res.send(err);

			User.find(function(err, users) {
				if (err) 
					res.send(err)

				res.json(users);
				
			});
		});
	});



	// more routes for our API will happen here

	// REGISTER OUR ROUTES -------------------------------
	// all of our routes will be prefixed with /api
	app.use('/api', router);
}