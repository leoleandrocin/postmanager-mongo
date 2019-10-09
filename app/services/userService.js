var User = require('../models/user').getModel();

exports.addUser = (req, res) => {
  let login = req.body.login;
  let password = req.body.password;
  let confirmPassword = req.body.confirmPassword;

  let description;
  let status;
  let validation = passwordValidation(password, confirmPassword);

  if(validation == null)
  {
    try {
        const user = new User(login, password);

        await user.save();
        description = "User successfully created!";
        status = 200
        res.status(200).send({ notification: { description: description, status: status } }).end();
    }
    catch (err) {
        description = "User already exists or invalid user data";
        status = 400;
        res.status(status).send({ notification: { description: description, status: status }}).end();
    }
  }
  else
  {
    res.status(status).send({ notification: { description: description, status: status }}).end();
  }
};

/* Get all users */
exports.getAllUsers = (req, res) => {
  if(req.method !== 'GET') {
    return res.status(404).json(
      {
        message: 'Method Not allowed for this request'
      }
    )
  }
  listUsers(req, res);
};

exports.getUserByLogin = (req, res) => {
  let login = req.body.login;

  if(req.method !== 'GET') {
    return res.status(404).json(
      {
        message: 'Method Not allowed for this request'
      }
    )
  }

  let response_data = null;

  User.findOne({'login' : login}, function(err, user) {
    if(err) {
      res.status(500).send({ notification: { description: 'Fail searching user by login!', status: 500 }}).end();
    }

    response_data = {
      'user' : user,
    }

    res.status(200).json(response_data);
  });
};

function passwordValidation(password, passwordConfirmation){

  var password = CryptoJS.AES.decrypt(password, cryp).toString(CryptoJS.enc.Utf8);
  var passwordConfirmation = CryptoJS.AES.decrypt(passwordConfirmation, cryp).toString(CryptoJS.enc.Utf8);

  if(password != passwordConfirmation)
  {
      return "Password and confirmation not combined!";
  }
  return null;
}

function listUsers(req, res) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  User
    .findAll()
    .exec(function(err, users) {
      if(err) {
        res.status(500).send({ description: "Fail searching users", status: 500 }).end();
      }

      var usersList = [];
      var notification = null;

      if (users.length > 0) {
        users.forEach((user) => {
          usersList.push(
            {
              'id': user._id,
              'login': user.login,
            }
          );
        })
      } else {
        notification = { description: "No user found", status: 404 };
      }
      res.status(200).send(
        {
          'token': token,
          'notification': notification,
          'users': usersList,
        }
      ).end();
    });
}