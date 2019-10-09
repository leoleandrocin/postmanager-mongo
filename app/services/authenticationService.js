require('dotenv').config({ path: __dirname + '/../../.env' });
var jwt = require('jsonwebtoken');
var CryptoJS = require("crypto-js");

var User = require('../models/user').getModel();
var cryp = "5945237";

exports.login = (req, res) => {
  if (validateUserFields(req.body.login, req.body.password)) {
    var status = 400;

    User
      .findOne({ login: req.body.login})
      .exec(function(err, foundAccount) {
        if (err || foundAccount == null || !validadePassword(foundAccount.password, req.body.password)) {
          res.status(status).send({notification: {description: "User not found!", status: status}});
        } 
        else {
          var payload = foundAccount._id + foundAccount.login + Date.now;
          var token = jwt.sign({ payload }, process.env.SECRET, {
              expiresIn: 3600 // expires in 5min
          });
          foundAccount.password = null;
          res.status(200).send(
            {
              'token': token,
              'userId': foundAccount._id,
              'login': foundAccount.login,
              'description' : 'User successfully logged'
            }
          );
        }
      });

  } else {
    res.status(200).send({ notification: { description: "User credentials are invalid!", status: status } });
  }
};

function validateUserFields(login, password) {
    if (!login || !password) {
        return false;
    } else {
        return true;
    }
}

function validadePassword(password, informedPassword){
    var password = CryptoJS.AES.decrypt(password, cryp);
    var informedPassword = CryptoJS.AES.decrypt(informedPassword, cryp);

    return password.toString(CryptoJS.enc.Utf8) == informedPassword.toString(CryptoJS.enc.Utf8);
}