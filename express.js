//links express with node.js
var express = require('express');
var handlebars = require('express-handlebars');
var mongodb = require('mongodb');
var bodyParser = require('body-parser');
var formidable = require('formidable');
var cookieParser = require('cookie-parser');

var app = express();

app.disable('x-powered-by');
// privacy shit

app.engine('handlebars', handlebars({defaultLayout: 'homesubpages'}));
// the template will be profile.handlebars

app.use(bodyParser.urlencoded({extended: true}));

// Import credentials which are used for secure cookies
var credentials = require('./credentials.js');
app.use(require('cookie-parser')(credentials.cookieSecret));

app.set('view engine', 'handlebars');
// using handlebars to load page content

app.get('/', function(req, res) {
    res.render('home', {title: 'home', layout: 'homepage.handlebars'});
});

// about page
app.get('/about', function(req, res){
  res.render('about', {title: 'about', layout: 'homesubpages.handlebars'});
});

// terms page
app.get('/termsandconditions', function(req, res){
  res.render('termsandconditions', {title: 'termsandconditions', layout: 'homesubpages.handlebars'});
});

// privacypolicy page
app.get('/privacypolicy', function(req, res){
  res.render('privacypolicy', {title: 'privacypolicy', layout: 'homesubpages.handlebars'});
});

// login page
app.get('/login', function(req, res){
  res.render('login', {title: 'login', layout: 'homesubpages.handlebars'});
});

// lets define registration!
app.get('/registration', function(req, res){
  res.render('registration', {title: 'registration', layout: 'homesubpages.handlebars'});
});

app.get('/editprofile', function(req, res){
  res.render('editprofile', {title: 'editprofile', layout: 'homesubpages.handlebars'});
});


// check login
app.post('/checklogin', function(req, res){
	// Get a Mongo client to work with the Mongo server
	var MongoClient = mongodb.MongoClient;

	// Define where the MongoDB server is
	var url = 'mongodb://localhost:27017/connectin';

	// Connect to the server
	MongoClient.connect(url, function(err, db) {
		if (err)
		{
			console.log('Unable to connect to the Server', err);
		}

		else
		{
			// We are connected
			console.log('Connection established to', url);

			// Get the documents collection
			var collection = db.collection('userData');

			//Get Login info
			// console.log(req.body.email);

			// Find all users
			collection.find({"email": req.body.email, "password": req.body.password}).toArray(function(err, result) {
				if (err)
				{
					res.send(err);
				}

				else if (result.length)
				{
					console.log('user logged in');
          //console.log(result.length);
          //console.log(result[0].username);
					//res.cookie('username',req.body.email, {expire :new Date()+9999});
          //currentUser = formData.email;
          res.cookie('email',req.body.email, {expire: new Date() + 9999});
          res.redirect('profile');
				}

				else
				{
					console.log('no result');
					//console.log(req.body.passWord);
					//console.log(formData.);
					res.redirect('login');

				}
				//Close connection
				db.close();
      });
		}
	});
});

// registering a user
app.post('/adduser', function(req, res){ /* matches action on form */

	// Get a Mongo client to work with the Mongo server
	var MongoClient = mongodb.MongoClient;

	// Define where the MongoDB server is
	var url = 'mongodb://localhost:27017/connectin';

	// Connect to the server
	MongoClient.connect(url, function(err, db){
		if (err) {
			console.log('Unable to connect to the Server:', err);
		} else {
			console.log('Connected to Server');

			// Get the documents collection
			var collection = db.collection('userData');

			// Get the user data passed from the form
			var currentUser = {email: req.body.email, username: req.body.username,
				password: req.body.password, firstname: req.body.firstname, lastname: req.body.lastname, birthday: req.body.birthday};
        //console.log(req);
			// Insert the student data into the database
			collection.insert(currentUser, function(err, result){
				if (err) {
					console.log(err);
				} else {

					// Redirect to the updated student list
					res.redirect('/login');
				}

        console.log('User registered.');

				// Close the database
				db.close();
      });
		}
	});
});




// registering a user
app.post('/editprofile', function(req, res){ /* matches action on form */

	// Get a Mongo client to work with the Mongo server
	var MongoClient = mongodb.MongoClient;
  var username = req.cookies.username;
  console.log(username);

	// Define where the MongoDB server is
	var url = 'mongodb://localhost:27017/connectin';

	// Connect to the server
	MongoClient.connect(url, function(err, db){
		if (err) {
			console.log('Unable to connect to the Server:', err);
		} else {
			console.log('Connected to Server');

			// Get the documents collection
			var collection = db.collection('userData');
      collection.update({"email": req.cookies.email},{$set:{"education": req.body.education,"occupation": req.body.occupation,"address": req.body.address,"interests": req.body.interests,"status": req.body.status }});


      res.redirect('profile');


       db.close();
		}
	});
});


/*
// registering a user
app.post('/editprofile', function(req, res){ /* matches action on form

	// Get a Mongo client to work with the Mongo server
	var MongoClient = mongodb.MongoClient;

	// Define where the MongoDB server is
	var url = 'mongodb://localhost:27017/connectin';

	// Connect to the server
	MongoClient.connect(url, function(err, db){
		if (err) {
			console.log('Unable to connect to the Server:', err);
		} else {
			console.log('Connected to Server');

			// Get the documents collection
			var collection = db.collection('userData');
      console.log(req.cookies.email);

       collection.update({"username": req.cookies.username},{$set:{"education": req.body.education,"occupation": req.body.occupation,"address": req.body.address,"interests": req.body.interests,"status": req.body.status }});


res.redirect('profile');


				db.close();
      });
		}
	});
});
*/







app.get('/profile', function(req, res){
	// Get a Mongo client to work with the Mongo server
	var MongoClient = mongodb.MongoClient;

	// Define where the MongoDB server is
	var url = 'mongodb://localhost:27017/connectin';

	// Connect to the server
	MongoClient.connect(url, function(err, db) {
		if (err)
		{
			console.log('Unable to connect to the Server', err);
		}

		else
		{
			// We are connected
			console.log('Connection established to', url);

			// Get the documents collection
			var collection = db.collection('userData');

			//Get Login info
			// console.log(req.body.email);

			// Find all users
			collection.find({"email": req.cookies.email}).toArray(function(err, result){
				if (err)
				{
					res.send(err);
				}

				else if (result.length)
				{
					console.log('showing profile page');
          //console.log(result.length);
          //console.log(result[0].username);
					//res.cookie('username',req.body.email, {expire :new Date()+9999});
          //currentUser = formData.email;
            res.render('profile', {"profileData": result, layout: 'profileLayout.handlebars'});
				}

				else
				{
					console.log('no result');
					//console.log(req.body.passWord);
					//console.log(formData.);
					res.redirect('login');

				}
				//Close connection
				db.close();
      });
		}
	});
});








// about page
app.get('/about', function(req, res){
  res.render('about', {title: 'about', layout: 'homesubpages.handlebars'});
});

// terms page
app.get('/termsandconditions', function(req, res){
  res.render('termsandconditions', {title: 'termsandconditions', layout: 'homesubpages.handlebars'});
});

// privacypolicy page
app.get('/privacypolicy', function(req, res){
  res.render('privacypolicy', {title: 'privacypolicy', layout: 'homesubpages.handlebars'});
});

// login page
app.get('/login', function(req, res){
  res.render('login', {title: 'login', layout: 'homesubpages.handlebars'});
});




app.post('/searchuser', function(req, res){
  // res.render('profile',{"profileData": result, layout: 'profilelayout.handlebars'});
  // Get a Mongo client to work with the Mongo server
  var MongoClient = mongodb.MongoClient;
  // Define where the MongoDB server is
  var url = 'mongodb://localhost:27017/connectin';

  MongoClient.connect(url, function (err, db) {
    if (err)
    {
      console.log('Unable to connect to the Server', err);
    }
    else
    {
      var collection = db.collection('userData');
      console.log(req.body.searchuser);
      collection.find({"username": req.body.searchuser}).toArray (function(err, result)
      {
        if (err)
        {
          res.send(err);
        }
        else(result.length)
        {
          console.log(result);
          res.render('profile', {"profileData": result, layout: 'profileLayout.handlebars'});
        }
        db.close();
      });
		}
	});
});

// cookies
app.get('/listcookies', function(req, res){
  console.log("Cookies : ", req.cookies);
  res.send('Look in console for cookies');
});

app.get('/deletecookie', function(req, res){
  console.log("Cookies : ", res.clearCookie);
  console.log('Cookie Deleted');
  res.redirect('login');
});

// link to css
app.use(express.static(__dirname + '/public'));

// the port where its hosted
app.listen(3000);

// just to tell us that the server is up :)
app.listen(app.get('port'), function() {
  console.log('Server running.');
});
