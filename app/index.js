const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const mongoUtil = require('./util/mongo_util')
const jwt = require('jsonwebtoken');

const {addPost, getPostsByUser, getPosts} = require('./services/postService');
const {addUser, getUserByLogin, getAllUsers} = require('./services/userService');
const {login} = require('./services/authenticationService');

const app = express();
const main = express();

main.use('/postmanager', app);
main.use(bodyParser.json());
main.use(bodyParser.urlencoded({extended : false}));
main.use(cors());

//DB connection
mongoUtil.connectToServer( function( err, client ) {
  if (err) {
      return console.log(err);
  }

  app.listen(port, () => {
      console.log("Server running on port " + port);
  })
});

app.post('/addPost', verifyJWT, (req, res) => {
  return addPost(req, res);
});

app.get('/posts', (req, res) => {
    return getPosts(req, res);
});

app.get('/posts/:login', verifyJWT, (req, res) => {
    return getPostsByUser(req, res);
});

app.post('/addUser', (req, res) => {
  return addUser(req, res);
});

app.get('/users', verifyJWT, (req, res) => {
    return getAllUsers(req, res);
});

app.get('/users/:login', verifyJWT, (req, res) => {
  return getUserByLogin(req, res);
});

app.post('/auth/login', (req, res) => {
  return login(req, res);
});

function verifyJWT(req, res, next){

  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  if (!token) {
      description = "Connection token not informed!";
      status = 401;
      res.status(status);
      return res.render("./auth/login", { auth: false,  notification: {description: description, status: status} });
  }

  jwt.verify(token, process.env.SECRET, function(err, decoded) {
      if (err) {
          description = "Fail during connection token authentication!";
          status = 500;
          res.status(status);
          return res.render("./auth/login", { auth: false,  notification: {description: description, status: status} });
      }
      
      req.userId = decoded.id;
      next();
  });
}

module.exports = main;