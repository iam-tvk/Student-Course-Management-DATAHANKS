var mongoose = require("mongoose");
var hankSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    link: String,
    link1: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        },
        username: String
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }]
});
module.exports = mongoose.model(`hank`, hankSchema);