var express = require("express");
var router = express.Router();
var hank = require("../models/hank");
var Comment = require("../models/comment");
var user = require("../models/user");
const { text } = require("body-parser");

router.get("/hanks", function(req, res) {
    if (req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), "gi");
        hank.find({ name: regex }, (err, hanks) => {
            if (err) {
                console.log(err);
            } else {
                res.render(`hanks/hanks`, { hanks: hanks, currentUser: req.user });
            }
        });

    } else {
        // console.log(req.user);
        hank.find({}, (err, hanks) => {
            if (err) {
                console.log(err);
            } else {
                res.render(`hanks/hanks`, { hanks: hanks, currentUser: req.user });
            }
        });
    }


})

router.post("/hanks", isLoggedIn, function(req, res) {
    //get data from form and add to hanks array 
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var link = req.body.link;
    var link1 = req.body.link1;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newhank = { name: name, image: image, description: desc, author: author, link: link, link1: link1}
        //hanks.push(newhank);

    hank.create(newhank, (err, newlyCreated) => {
        if (err) {
            console.log(err);
        } else {
            console.log(req.body);
            res.redirect("/hanks")
        }
    });


})

router.get("/hanks/new", isLoggedIn, function(req, res) {
    res.render("hanks/new");
})

router.get("/hanks/:id", function(req, res) {
    hank.findById(req.params.id).populate("comments").exec(function(err, foundhank) {
        if (err) {
            console.log(err);
        } else {
            console.log(foundhank);
            res.render("hanks/show", { hank: foundhank })
        }
    });
})



//Edit
router.get("/hanks/:id/edit", checkHankOwnership, function(req, res) {
    hank.findById(req.params.id, function(err, foundhank) {
        res.render("hanks/edit", { hank: foundhank });
    })

})


//Update
router.put("/hanks/:id", checkHankOwnership, function(req, res) {

    hank.findByIdAndUpdate(req.params.id, req.body.hank, function(err, updatedhank) {
        if (err) {
            res.redirect("/hanks");

        } else {
            res.redirect("/hanks/" + req.params.id)
        }
    })
})


//destroy
router.delete("/hanks/:id", checkHankOwnership, function(req, res) {
        hank.findByIdAndRemove(req.params.id, function(err) {
            if (err) {
                res.redirect("/hanks/");
            } else {

                res.redirect("/hanks/")
            }
        })

    })
    // router.delete("/hanks/:id/comments/:comment_id", function(req, res) {
    //     comment.findByIdAndRemove(req.params.comment_id, function(err) {
    //         if (err) {
    //             res.redirect("back");
    //         } else {
    //             res.redirect("/hanks/" + req.params.id);
    //         }
    //     })
    // })

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

function checkHankOwnership(req, res, next) {
    if (req.isAuthenticated()) {
        //does the user own hank

        hank.findById(req.params.id, function(err, hank) {

            if (hank.author.id.equals(req.user._id) || req.user.isAdmin) {
                next();

            } else {
                res.redirect("back");
            }

        })

    } else {
        // console.log("YOU NEED TO BE LOGGED IN TO DO THAT!!!");
        // res.send("YOU NEED TO BE LOGGED IN TO DO THAT!!!");
        res.redirect("back");
    }
}


function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$!#\s]/g, "\\$&");

};
module.exports = router;