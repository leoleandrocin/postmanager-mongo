var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
var config = require('config'); 

module.exports = {
  
  connectToServer: function( callback ) {
    mongoose.connect(config.DBHost,  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex : true }, function( err, client ) {
      return callback( err );
    });
  }
};