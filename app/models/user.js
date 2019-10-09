const mongoose = require('mongoose')
require('mongoose-double')(mongoose);

var userSchema = mongoose.Schema({
    login: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    }
});

userSchema.index({ username: 1 }, { unique: true });

var userModel = mongoose.model('User', userSchema);

module.exports = {

    getModel: function() {
        return userModel;
    },

    getSchema: function() {
        return userSchema;
    }
};