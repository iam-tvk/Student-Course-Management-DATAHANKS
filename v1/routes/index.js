var express = require("express");
var router = express.Router();
var hank = require("../models/hank");
var Comment = require("../models/comment");
var user = require("../models/user");
var passport = require("passport");

//starttttttttttttttttttttt

// exports.login = (req, res, next) => {
//     User.findOne({ username: req.body.username }).then(
//       (user) => {
//         if (!user) {
//           return res.status(401).json({
//             error: new Error('User not found!')
//           });
//         }
//         bcrypt.compare(req.body.password, user.password).then(
//           (valid) => {
//             if (!valid) {
//               return res.status(401).json({
//                 error: new Error('Incorrect password!')
//               });
//             }
//             res.status(200).json({
//               userId: user._id,
//               token: 'token'
//             });
//           }
//         ).catch(
//           (error) => {
//             res.status(500).json({
//               error: error
//             });
//           }
//         );
//       }
//     ).catch(
//       (error) => {
//         res.status(500).json({
//           error: error
//         });
//       }
//     );
//   } //enddddddddddddddddd






router.get("/", function(req, res) {
        res.render("landing");
    })
    //authentication route

//show register form
router.get("/register", function(req, res) {
    res.render("register")
});

router.post("/register", function(req, res) {
    var newUser = new user({
        username: req.body.username,
        FirstName: req.body.FirstName,
        LastName: req.body.LastName,
        email: req.body.email,
        avatar: req.body.avatar
    });
    if (req.body.adminCode === "datahanks123") {
        newUser.isAdmin = true;

    }
    user.register(newUser, req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            return res.render("register")
        }
        passport.authenticate("local")(req, res, function() {
            res.redirect("/hanks");
        })
    })
})

//shoow login 
router.get("/login", function(req, res) {
        res.render("login")
    })
    //app.post("/login", middleware, callback)
router.post("/login", passport.authenticate("local", { successRedirect: "/hanks", failureRedirect: "/login"}), function(req, res) {
    //res.send("LOGIN logic happens here")
    //res.send("Invalid Credentials");
    //console.log("Invalid Credentials");
})

//Logout
router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/hanks")
})

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}
//profile
router.get("/users/:id", function(req, res) {
    user.findById(req.params.id, function(err, founduser) {
        if (err) {
            //res.send("error");
            res.redirect("/");
        }
        hank.find().where("author._id").equals(founduser._id).exec(function(err, hanks) {
            if (err) {
                //res.send("error");
                res.redirect("/");
            }
            res.render("users/show", { user: founduser, hanks: hanks })
        })

    })

})


module.exports = router;