var Post = require('../models/post').getModel();

exports.addPost = (req, res) => {
  let login = req.body.login;

  try {
    let now = new Date(Date.now());
    const post = new Post(login, req.body.title, req.body.message, now.getFullYear() + '/' + now.getMonth() + '/' + now.getDate());

    await post.save();
    description = "Post successfully created!";
    status = 200
    res.status(200).send({ notification: { description: description, status: status } }).end();
  }
  catch (err) {
    description = "Fail saving post!";
    status = 500;
    res.status(status).send({ notification: { description: description, status: status }}).end();
  }
};

/* Get all posts from all users 
* This function returns a collections of current posts (posts added at the current day)
*/
exports.getPosts = (req, res) => {
  if(req.method !== 'GET') {
    return res.status(404).json(
      {
        message: 'Method Not allowed for this request'
      }
    )
  }

  let now = new Date(Date.now());

  Post
    .find({'createdAt' : now.getFullYear() + '/' + now.getMonth() + '/' + now.getDate()})
    .exec(function(err, posts) {
      if(err) {
        res.status(500).send({ description: "Fail searching posts", status: 500 }).end();
      }

      var postsList = [];
      var notification = null;

      if (posts.length > 0) {
        posts.forEach((post) => {
          postsList.push(
            { 
              'id': post._id,
              'login': post.login,
              'title': post.title,
              'body': post.body,
              'createdAt': post.createdAt
            }
          );
        })
      } else {
        notification = { description: "No post found", status: 404 };
      }
      res.status(200).send(
        {
          notification: notification,
          posts: postsList,
        }
      ).end();
    });
};

exports.getPostsByUser = (req, res) => {
  let login = req.body.login;

  if(req.method !== 'GET') {
    return res.status(404).json(
      {
        message: 'Method Not allowed for this request'
      }
    )
  }
  else if(login == null || login == undefined) {
    return res.status(404).json(
      {
        message: 'No login was informed'
      }
    )
  }

  Post
    .find({'login' : login})
    .exec(function(err, posts) {
      if(err) {
        res.status(500).send({ description: "Fail searching posts", status: 500 }).end();
      }

      var postsList = [];
      var notification = null;

      if (posts.length > 0) {
        posts.forEach((post) => {
          postsList.push(
            { 
              'id': post._id,
              'login': post.login,
              'title': post.title,
              'body': post.body,
              'createdAt': post.createdAt
            }
          );
        })
      } else {
        notification = { description: "No post found", status: 404 };
      }
      res.status(200).send(
        {
          notification: notification,
          posts: postsList,
        }
      ).end();
    });
};
