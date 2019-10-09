const mongoose = require('mongoose')
require('mongoose-double')(mongoose);

var postSchema = mongoose.Schema({
    login: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    createdAt: {
        type: String,
        required: true
    }
});

postSchema.index({ login: 1, title: 1, body: 1, createdAt: 1 }, { unique: true });

var postModel = mongoose.model('Post', postSchema);

module.exports = {

    getModel: function() {
        return postModel;
    },

    getSchema: function() {
        return postSchema;
    }
};