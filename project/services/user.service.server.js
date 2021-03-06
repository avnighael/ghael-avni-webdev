var app = require('../../express');
var userModel = require('../models/user/user.model.server');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require("bcrypt-nodejs");

var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var googleConfig = {
    clientID     : process.env.GOOGLE_CLIENT_ID,
    clientSecret : process.env.GOOGLE_CLIENT_SECRET,
    callbackURL  : process.env.GOOGLE_CALLBACK_URL
};

var FacebookStrategy = require('passport-facebook').Strategy;
var facebookConfig = {
    clientID     : process.env.FACEBOOK_CLIENT_ID,
    clientSecret : process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL  : process.env.FACEBOOK_CALLBACK_URL
};

passport.use(new LocalStrategy(localStrategy));
// passport.use(new LocalStrategy(localChecking));
passport.serializeUser(serializeUser);
passport.deserializeUser(deserializeUser);

passport.use(new GoogleStrategy(googleConfig, googleStrategy));
passport.use(new FacebookStrategy(facebookConfig, facebookStrategy));

app.get('/api/project/checkLoggedIn',checkLoggedIn );

app.get('/api/project/user/:userId',findUserById);
app.post('/api/project/login',passport.authenticate('local'), login);
app.post('/api/project/register', register);
app.get('/api/project/checkAdmin', checkAdmin);
app.post('/api/project/logout', logout);
app.get('/api/project/user',findUser);
app.post('/api/project/user',createUser);
app.put('/api/project/admin/user/:userId',updateUser);
app.put('/api/project/user/:userId', modifyUser);
app.post('/api/project/unregister', unregister);
app.put('/api/project/user/:userId/project/:projectId', addToWishList);
app.delete('/api/project/user/:userId/project/wishlist/remove/:projectIndex', removeFromWishList);
app.get('/api/project/user/:userId/project/:projectId', findUserWishListProjectById);
app.get('/api/project/user/:userId/wishlist', getWishList);
// app.post('/api/project/user/:userId/project/:projectId/donate', sendDonation);
app.put("/api/project/user/:userId/follow/:userIdToFollow",follow);
app.put("/api/project/user/:userId/unfollow/:userIdToUnfollow",unfollow);
app.put('/api/project/user/:userId/project/:projectId/favourites',addToFavourites);
app.delete('/api/project/user/:userId/project/:projectId/favourites',removeFromFavourites);


app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
app.get('/auth/google/callback',
    passport.authenticate('google', {
        successRedirect: '/project/#/profile',
        failureRedirect: '/project/#/login'
    }));

app.get ('/auth/facebook', passport.authenticate('facebook', { scope : ['email'] }));
app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect: '/project/#/profile',
        failureRedirect: '/project/#/login'
    }));

function register(req, res) {
    var newUser = req.body;
    newUser.password = bcrypt.hashSync(newUser.password);
    // console.log(newUser);

    userModel
        .createUser(newUser)
        .then(function(user){
            if(user){
                req.login(user, function(err) {
                    if(err) {
                        res.status(400).send(err);
                    } else {
                        res.json(user);
                    }
                });
            }
        }, function (err) {
            // console.log(err);
            return err;
        });

}


function unregister(req, res) {
    var userId = req.body._id;
    userModel
        .deleteUser(userId)
        .then(function (user) {
            req.logout();
            res.sendStatus(200);
        });
}

function checkAdmin(req, res) {
    if(req.isAuthenticated() && req.user.role.indexOf('ADMIN') > -1) {
        res.json(req.user);
    } else {
        res.send('0');
    }
}

function logout(req, res) {
    req.logout();
    res.sendStatus(200);
}

function checkLoggedIn(req, res) {
    if(req.isAuthenticated()) {
        console.log("logged in ");
        res.json(req.user);
    } else {
        console.log("not logged in ");
        res.send('0');
    }
}

function login(req, res) {
    var user = req.user;
    res.json(user);
}

function sendDonation(req, res) {
    var userId = req.params.userId;
    var projectId = req.params.projectId;
    var amount = req.body;
    console.log(amount);

//console.log(userId);
    userModel
        .sendDonation(userId)
        .then(function (response) {
            console.log(response);
            res.json(response);
        },function (err) {
            res.sendStatus(404);
        });
}

function getWishList(req, res) {
    var userId = req.params.userId;
//console.log(userId);
    userModel
        .getWishList(userId)
        .then(function (response) {
            res.json(response);
        },function (err) {
            res.sendStatus(404);
        });
}

function findUserWishListProjectById(req, res) {
    var userId = req.params.userId;
    var projectId = req.params.projectId;

    userModel
        .findUserWishListProjectById(userId, projectId)
        .then(function (response) {
             // console.log(response);
            if(response == undefined) {
                res.sendStatus(404);
            } else {
                // res.sendStatus(200);
                res.send(response);
            }

        },function (err) {
            res.sendStatus(404);
        });
}

function removeFromWishList(req, res) {
    var userId = req.params.userId;
    var projectIndex = req.params.projectIndex;

    userModel
        .removeFromWishList(userId, projectIndex)
        .then(function (response) {
            res.json(response);
        },function (err) {
            res.sendStatus(404);
        });
}

function addToWishList(req, res) {
    var userId      = req.params.userId;
    var projectId   = req.params.projectId;
    var project = req.body;

    userModel
        .addToWishList(userId, projectId, project)
        .then(function (response) {
            res.json(response);
        },function (err) {
            res.send(err);
        });
}

function removeFromFavourites(req, res) {
    var userId = req.params.userId;
    var projectId = req.params.projectId;

    userModel
        .removeFromFavourites(userId, projectId)
        .then(function (response) {
            res.json(response);
        },function (err) {
            res.sendStatus(404);
        });
}

function addToFavourites(req, res) {
    var userId      = req.params.userId;
    var projectId   = req.params.projectId;
    var project = req.body;

    userModel
        .addToFavourites(userId, projectId, project)
        .then(function (response) {
            res.json(response);
        },function (err) {
            res.send(err);
        });
}


function findUser(req, res) {
    var username = req.query.username;
    var password = req.query.password;
    if(username && password) {
        findUserByCredentials(req, res);
    } else if(username) {
        findUserByUsername(req, res);
    }
}

function findUserByUsername(req, res) {
    var username = req.query.username;

    userModel
        .findUserByUsername(username)
        .then(function (user) {
            console.log("Success");
            res.json(user);
        }, function (err) {
            console.log("Failed");
            res.sendStatus(404);
        });
}

function findUserByCredentials(req, res) {
    var username = req.query.username;
    var password = req.query.password;

    userModel
        .findUserByCredentials(username,password)
        .then(function (user) {
            res.json(user);
        }, function (err) {
            res.send(err);
        });
}


function updateUser(req, res) {
    var userId = req.params['userId'];
    var user = req.body;

    userModel
        .updateUser(userId, user)
        .then(function (status) {
            res.sendStatus(200);
        });

}

function modifyUser(req, res) {
    var userId = req.params.userId;
    var user = req.body;
    user.password = bcrypt.hashSync(user.password);

    userModel
        .updateUser(userId, user)
        .then(function (status) {
            res.sendStatus(200);
        }, function (err) {
            return err;
        });
}

function createUser(req,res) {
    var newUser = req.body;
    userModel
        .createUser(newUser)
        .then(function (newUser) {
            res.json(newUser)
        }, function (err) {
            res.send(err);
        });
}

function findUserById(req, res) {
    var userId = req.params['userId'];

    userModel
        .findUserById(userId)
        .then(function (thisUser) {
            // console.log(thisUser);
            res.json((thisUser));
        });

}

function follow(req, res) {
    var userId = req.params.userId;
    var userIdToFollow = req.params.userIdToFollow;

    userModel
        .followPerson(userIdToFollow, userId)
        .then(function (response) {
            res.json(response);
        },function (err) {
            res.send(err);
        });
}

function unfollow(req, res) {
    var userId = req.params.userId;
    var userIdToUnfollow = req.params.userIdToUnfollow;
    userModel
        .unfollowPerson(userIdToUnfollow, userId)
        .then(function (response) {
            res.json(response);
        },function (err) {
            res.send(err);
        });
}


function localStrategy(username, password, done) {
    userModel
        .findUserByUsername(username)
        .then(
            function(user) {
                console.log(user);
                if (user && bcrypt.compareSync(password, user.password)) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
                 return done(null, user);
            },
            function(err) {
                if (err) {
                    return done(err);
                }
            }
        );
}

function serializeUser(user, done) {
    done(null, user);
}

function deserializeUser(user, done) {
    userModel
        .findUserById(user._id)
        .then(
            function(user){
                done(null, user);
            },
            function(err){
                done(err, null);
            }
        );
}

function googleStrategy(token, refreshToken, profile, done) {
    userModel
        .findUserByGoogleId(profile.id)
        .then(
            function(user) {
                if(user) {
                    return done(null, user);
                } else {
                    var email = profile.emails[0].value;
                    var emailParts = email.split("@");
                    var newGoogleUser = {
                        username:  emailParts[0],
                        firstName: profile.name.givenName,
                        lastName:  profile.name.familyName,
                        email:     email,
                        google: {
                            id:    profile.id,
                            token: token
                        }
                    };
                    return userModel.createUser(newGoogleUser);
                }
            },
            function(err) {
                if (err) { return done(err); }
            }
        )
        .then(
            function(user){
                return done(null, user);
            },
            function(err){
                if (err) { return done(err); }
            }
        );
}

function facebookStrategy(token, refreshToken, profile, done) {
    userModel
        .findUserByFacebookId(profile.id)
        .then(
            function (facebookUser) {
                if (facebookUser) {
                    return done(null, facebookUser);
                }
                else {
                    var facebookUser = {
                        firstName: profile.displayName.split(' ')[0],
                        lastName: profile.displayName.split(' ')[1],
                        facebook: {
                            token: token,
                            id: profile.id
                        }
                    };
                    userModel
                        .createUser(facebookUser)
                        .then(function (user) {
                            done(null, user)
                        }, function (err) {
                            done(err, null)
                        });
                }
            },
            function (err) {
                done(err, null);
            });
}
