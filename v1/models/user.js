var mongoose = require("mongoose");
var passposrtLocalMOngoose = require("passport-local-mongoose");


var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    confirmpassword: String,
    avatar: String,
    FirstName: String,
    LastName: String,
    email: String,
    avatar: String,
    isAdmin: {
        type: Boolean,
        default: false
    }
});

userSchema.plugin(passposrtLocalMOngoose);
module.exports = mongoose.model("user", userSchema);