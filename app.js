var express = require('express');
var https = require('https');
var fs = require("fs");

var app = express();
var passport = require("passport");
var LocalStrategy = require('passport-local');
var passportLocalMongoose = require('passport-local-mongoose');
var mongoose = require('mongoose');
var async = require('async');
var User = require('./models/user');
var userOrder = require('./models/usersOrder');
var bestSelling = require('./models/bestSelling');
var userReview = require('./models/userReview');
var questionAnswers = require('./models/questionAnswer');
var basket = require('./models/basket');
var phone = require('./models/Phone')
var cors = require('cors');
var jwt = require('jsonwebtoken');
var ObjectId = require('mongodb').ObjectID;


// ALLOWING ACCESS TO API

//Sessions 
app.use(require("express-session")({
    secret: "express secret Data",
    resave: false,
    saveUninitialized: false
}));

// use it before all route definitions
var bodyParser = require('body-parser')
// app.use(express.bodyParser());
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}));




/*ITS IMPORTANT express makes uses of express session before we use passport
 MAIN POINT----> passport NEED EXPRESS SESSION FOR Authentication isLoggedIn Function*/
app.use(passport.initialize());
app.use(passport.session());
// Telling passport to use email field as username when checking request from client
passport.use(new LocalStrategy({
    usernameField: 'email'
}, User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


mongoose.connect('mongodb://127.0.0.1/Ecommerce');
var db = mongoose.connection;
// mongoose.Promise = global.Promise;


// ++++++++++++++++++++++++++++++++
// +For deployment                +
// ++++++++++++++++++++++++++++++++
// Add domain name of the angular app -> ecomapp.sameerul.com
app.use(cors({
    origin: ['http://localhost:4200', 'http://localhost:3006', 'http://localhost:8080',"http://localhost:1337" ]
}));
// origin: ['http://localhost:4200', 'http://angularnoteapp.sameerul.com','http://angula-app.herokuapp.com']

//  CORS SETTINGS 
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(cors());



//RESTFUL API HOMEPAGE
app.get("/home", function (req, res) {
    res.json({
        "Message": "RESTFUL API HOMEPAGE"
    });
});

app.get("/register", function (req, res) {
    res.json({
        "Need": "Name, password, email, username"
    });
});
app.post("/register", function (req, res) {
    var name = req.body.name;
    var password = req.body.password;
    var email = req.body.email;
    // var username = req.body.username;
    console.log(name, password, email);
	/*Using  user model User, which use local mongoose strategy to check if username
	 and email exists already*/
    // 	console.log(User.find({"email":email}));

    User.findOne({
        email: email
    }, function (err, user) {
        if (err) {
            console.log("Error", err);
        }
        if (user) { /*if user found ..means email already used*/
            console.log("email already used")
            return res.json({
                "Message": "email already used"
            });
        } else {
            User.register(new User({
                name: req.body.name,
                // username: req.body.username,
                email: req.body.email
            }), req.body.password, function (err, user) {
                if (err) {
                    console.log(err);
                    return res.json({
                        "Message": err
                    });
                }
                passport.authenticate("local")(req, res, function () {
                    res.json({
                        "Message": "Signed Up"
                    });
                    console.log("Signed up", user);
                    emailUser(email, username);
                });
            });
        }
    });
});


//-----------------------
// GET LOGIN
app.get("/userLogin", function (req, res) {
    res.json({
        "Message": "Login GET PAGE should end up here coz login failed"
    });
});

app.post("/login", function (req, res, next) {
    console.log(req.body);
    console.log(req.body.email);
    console.log(req.body.password);
    // generate the authenticate method and pass the req/res
    passport.authenticate('local', function (err, user, info) {
        if (Object.keys(req.body).length === 0) {
            console.log("EMpty ");
            res.json({
                "Message": "Empty Body "
            })
        }
        if (err) {
            res.json({
                "Message": "user not found " + err
            })
        }
        if (!user) {
            return res.json({
                "Message": "User Not found Create a account"
            })
        }
        if (user) {
            payload = {
                "user_Id": user._id,
                "name": user.name,
                "email": user.email
            }
            // user.name + user.email;
            // console.log(secretData)
            jwt.sign({
                user: payload
            }, "secretkey", {
                    subject: payload.name,
                    // FOR TESTING purpose set it to 10seconds
                    // 1200sec = 20 mins
                    // 3600sec = 1Hour
                    expiresIn: '3600s'
                }, function (err, token) {
                    res.json({
                        "Message": "Okay",
                        "name": user.name,
                        "email": user.email,
                        "userId": user._id,
                        token: token
                    })
                })
        }
    })(req, res, next);

});


// Requres  valid token from the user if the user becoms unvalid then Authorisation failed will be sent 
app.get("/profile", verifyToken, function (req, res) {
    jwt.verify(req.token, "secretkey", function (err, authData) {
        if (err) {
            // res.sendStatus(403);
            res.json({
                "Message": "Authorisation Failed"
            });
        } else {
            // console.log(typeof(authData));
            User.findOne({
                "email": authData.user.email
            }, function (err, user) {
                // console.log(notes.title);
                if (err) throw err;
                console.log("User Updated");
                console.log(user);
                // body...
                console.log(authData.user.user_Id);
                console.log(authData.user.name);
                res.json({
                    "Message": "Success",
                    "id": user._id,
                    "name": user.name,
                    "email": user.email
                });
            });
        }
    })
});

// Update Profile
app.post("/updateProfile", verifyToken, function (req, res) {
    jwt.verify(req.token, "secretkey", function (err, authData) {
        if (err) {
            // res.sendStatus(403);
            res.json({
                "Message": "Authorisation Failed"
            });
        } else {
            // console.log(typeof(authData));
            console.log(req.body.name);
            User.update({
                "_id": ObjectId(req.body.userId)
            }, {
                    $set: {
                        "name": req.body.name
                    }
                }, function (err, user) {
                    console.log(user);
                    console.log(user.name);
                    if (err) throw err;
                    // body...
                });
            // User.findOne({email: authData.user.email})
            User.findOne({
                "email": authData.user.email
            }, function (err, user) {
                // console.log(notes.title);
                if (err) throw err;
                console.log("User Updated");
                console.log(user);
                // body...
                console.log(authData.user.user_Id);
                console.log(authData.user.name);
                res.json({
                    "Message": "Updated successfully",
                    "id": user._id,
                    "name": user.name,
                    "email": user.email
                });
            });
        }
    })
    // console.log("Message:" + req.user.name);
});

// Get all mobile phones 
app.get("/allPhones", function (req, res) {
    console.log("Getting all phones");
    phone.find({},function(err, result){
        console.log(res);
        if (err) throw err;
        mobileInfo = [];
        for (i in result) {
            mobileInfo.push({
                "mobileId": result[i].mobileId,
                "mobileName": result[i].mobileName,
                "mobilePrice": "£" + result[i].mobilePrice,
                "mobileImageUrl": result[i].imageUrl
            })
        }
        res.json({
            result: mobileInfo
        })
    })
});

// Call this route when user clicks a mobilephone and pass in mobile ID
app.get("/getPhone/:mobileId", function (req, res) {
    var mobileId = parseInt(req.params.mobileId);
    console.log(mobileId)
    phone.findOne({'mobileId':mobileId},function(err,result){
        if (err) throw err;
        res.json({
            "MobileData":result
        })
    })
})

// Product filteration by LOW TO HIGH PRICE
app.get("/lowToHigh", function (req, res) {
    console.log("Low to High mobile phones by price");
    var mysort = { mobilePrice: 1 };
    phone.find({}).sort({mobilePrice:1}).exec(function(err,mobileData){
        if (err) throw err;
        mobileInfo = [];
        // console.log(mobileData)
        for (i in mobileData) {
            // console.log(mobileData[i].mobilePrice)
            mobileInfo.push({
                "mobileId": mobileData[i].mobileId,
                "mobileImageUrl": mobileData[i].imageUrl,
                "mobileName": mobileData[i].mobileName,
                "mobilePrice": "£" + mobileData[i].mobilePrice,
            })
        }
        res.json({
            result: mobileInfo
        })
    })
});

// Product filteration by High TO Low PRICE
app.get("/highToLow", function (req, res) {
    console.log("Getting High to Low mobile phones by price");
    var mysort = { mobilePrice: -1 };
    // db.collection("mobilePhones").find().sort({ mobilePrice: -1 }).toArray(function (err, mobileData) {
    phone.find({}).sort({mobilePrice:-1}).exec(function(err,mobileData){

        if (err) throw err;
        mobileInfo = [];
        // console.log(mobileData)
        for (i in mobileData) {
            // console.log(mobileData[i].mobilePrice)
            mobileInfo.push({
                "mobileId": mobileData[i].mobileId,
                "mobileName": mobileData[i].mobileName,
                "mobilePrice": "£" + mobileData[i].mobilePrice,
                "mobileImageUrl": mobileData[i].imageUrl,

            })
        }
        res.json({
            result: mobileInfo
        })
    });
});

// Incharge of adding wished product to db. Requires user id, product id store the wished product for tht user
// Route updates best selling table [noOftimeWished] column by 1
app.post("/myWishedProduct", verifyToken, function (req, res) {
    jwt.verify(req.token, "secretkey", function (err, authData) {
        if (err) {
            // res.sendStatus(403);
            res.json({
                "Message": "Authorisation Failed"
            });
        } else {
            // userId = "objectId('" + req.body.userId + "')";
            wishedProductId = req.body.mobileId;
            User.findOne({ "_id": ObjectId(req.body.userId) }, function (err, user) {
                console.log(user)
                console.log("Wished Prod " + user.wishedProducts);
                var userWishedItem = wishedProductId;
                console.log("Convertedd " + parseInt(userWishedItem));
                WishedItem = parseInt(userWishedItem);
                if (user.wishedProducts.includes(WishedItem)) {
                    res.json({
                        "Message": "success",
                        "Content": "Already wished"
                    })
                }
                else {
                    console.log("Adding to wishlist");
                    User.update({
                        "_id": ObjectId(req.body.userId)
                    }, { $push: { wishedProducts: wishedProductId } }, function (err, user) {
                        console.log("yeah yeah " + user);
                        res.json({
                            "Message": "success",
                            "Content": "Added to wished items"
                        })
                        if (err) throw err;
                    });

                    // Updateing no of times wished field for tht specific product in best selling table
                    bestSelling.findOne({ mobileId: req.body.mobileId }, function (err, result) {
                        console.log("RESULT: " + result);

                        // If greater than zero, it means smone has wished it already so jus increase the no of times wished wished
                        if (result) {
                            var currentNoOfTimesWished = result.noOfTimesWished;
                            var updateNumber = currentNoOfTimesWished + 1;

                            // Means someone has wished it 
                            bestSelling.update({
                                "mobileId": req.body.mobileId
                            }, {
                                    $set: {
                                        "noOfTimesWished": updateNumber,
                                    }
                                }, function (err, user) {
                                    // console.log(user);
                                    // console.log(user.name);
                                    if (err) throw err;
                                    // body...
                                });
                        }
                        else {
                            // THIS SECTION SHOULD HAPPEN ONLY ONCE. ONLY WHEN CREATING A ROW FOR THT MOBIILE
                            // IF that item hasnt been wished already by anyone then create a row for that item
                            // Create a new row for tht mobile id and increase the number of best selling by one
                            var wishlist = new bestSelling({
                                mobileId: req.body.mobileId,
                                noOfTimesOrdered: 0,
                                noOfTimesWished: 1
                            })
                            wishlist.save(function (err, wishedItem) {
                                if (err) {
                                    return err
                                }
                                else {
                                    console.log("Created a new mobile in best selling")
                                    console.log(wishedItem);
                                }
                            })
                        }
                    })
                }
            });
        }
    })
});

// Route incharge of storing orders in userOrders table. Requires, UserId,MobileId, MobileName, MobilePrice
// Once storing, need to update best selling table [noOfTimesOrdered] by 1: THIS COloumn used to define best selling item in ascen order
app.post("/orderPhone", verifyToken, function (req, res) {
    jwt.verify(req.token, "secretkey", function (err, authData) {
        if (err) {
            // res.sendStatus(403);
            res.json({
                "Message": "Authorisation Failed"
            });
        } else {
            console.log("Ordered a phone");
            var mydate1 = new Date()
            // expected output: 0
            var monthNames = [
                "January", "February", "March",
                "April", "May", "June", "July",
                "August", "September", "October",
                "November", "December"
            ];

            var d = mydate1.getDate();
            var m = monthNames[mydate1.getMonth()];
            var y = mydate1.getFullYear();
            var newOrder = new userOrder({
                userId: req.body.userId,
                mobileId: parseInt(req.body.mobileId),
                mobileName: req.body.mobileName,
                mobilePrice: parseInt(req.body.mobilePrice),
                mobileImageUrl: req.body.mobileImageUrl,
                orderedAt: d + " " + m + " " + y
            })
            newOrder.save(function (err, savedOrder) {
                if (err) {
                    res.json({
                        result: err
                    })
                }
                else {
                    console.log("Saved your order")
                    console.log(savedOrder);
                    res.json({
                        result: "Success"
                    })
                }
            })
        }
        bestSelling.findOne({ mobileId: parseInt(req.body.mobileId) }, function (err, result) {
            console.log("RESULT: " + result);

            // If greater than zero, it means smone has order it already so jus increase the no of ordered by 1
            if (result) {
                console.log("IM HERER")
                var currentNoOfTimesWished = result.noOfTimesOrdered;
                var updateNumber = currentNoOfTimesWished + 1;

                // Means someone has wished it 
                bestSelling.update({
                    "mobileId": req.body.mobileId
                }, {
                        $set: {
                            "noOfTimesOrdered": updateNumber,
                        }
                    }, function (err, user) {
                        // console.log(user);
                        // console.log(user.name);
                        if (err) throw err;
                        // body...
                    });
            }
            else {
                // THIS SECTION SHOULD HAPPEN ONLY ONCE. ONLY WHEN CREATING A ROW FOR THT MOBIILE
                // IF that item hasnt been ordered  already by anyone then create a row for that item
                // Create a new row for tht mobile id and increase the number of times ordered by one
                var orderList = new bestSelling({
                    mobileId: req.body.mobileId,
                    noOfTimesOrdered: 1,
                    noOfTimesWished: 0
                })
                orderList.save(function (err, savedOrder) {
                    if (err) {
                        return err
                    }
                    else {
                        console.log("Created a new mobile in best selling")
                        console.log(savedOrder);
                    }
                })

            }
        })
    })
});

// Get user orders, all the orders placed by thier user 
app.get("/myOrders/:userId", verifyToken, function (req, res) {
    jwt.verify(req.token, "secretkey", function (err, authData) {
        if (err) {
            // res.sendStatus(403);
            res.json({
                "Message": "Authorisation Faailed",
                "Err": errs
            });
        } else {
            userOrder.find({ "userId": req.params.userId }, function (err, orderedItems) {
                console.log("Ss")
                if (err) {
                    res.json({
                        Error: "Error"
                    })
                }
                if (orderedItems.length > 0) {
                    res.json({
                        "Orders": orderedItems
                    })
                }
                else {
                    res.json({
                        "Orders": "None"
                    })
                }

            });
        }
    })
})
// Get items in users baskets, all the orders placed by thier user 
app.get("/basket/:userId", verifyToken, function (req, res) {
    jwt.verify(req.token, "secretkey", function (err, authData) {
        if (err) {
            // res.sendStatus(403);
            res.json({
                "Message": "Authorisation Faailed",
                "Err": err
            });
        } else {
            basket.find({ "userId": req.params.userId }, function (err, basketItems) {
                console.log("Ss")
                if (err) {
                    res.json({
                        Error: "Error"
                    })
                }
                if (basketItems.length > 0) {
                    res.json({
                        "basketItems": basketItems
                    })
                }
                else {
                    res.json({
                        "basketItems": "None"
                    })
                }

            });
        }
    })
})

app.post("/basket", verifyToken, function (req, res) {
    jwt.verify(req.token, "secretkey", function (err, authData) {
        if (err) {
            // res.sendStatus(403);
            res.json({
                "Message": "Authorisation Failed",
                "Err": err
            });
        } else {
            var userId = (req.body.mobileId);
            var mobileId = (req.body.mobileId);
            var mobileName = (req.body.mobileName);
            var mobilePrice = (req.body.mobilePrice);
            var mobileImageUrl = (req.body.mobileImageUrl);
            var basketItem = new basket({
                userId: req.body.userId,
                mobileId: req.body.mobileId,
                mobileName: req.body.mobileName,
                mobilePrice: req.body.mobilePrice,
                mobileImageUrl: req.body.mobileImageUrl
            });
            basketItem.save(function (err, basketItem) {
                console.log("Here")
                if (err) {
                    console.log(err);
                } else {
                    res.json({
                        "Message": "success"
                    })
                    console.log(basketItem);
                }
            });
        }
    })
})
app.delete("/basket/:basketItemId", verifyToken, function(req, res, next) {
	var basketItemId = req.params.basketItemId;
	console.log(basketItemId);
	jwt.verify(req.token, "secretkey", function(err, authData) {
		if (err) {
			// res.sendStatus(403);
			res.json({
				"Message": "Authorisation Failed"
			});
		} else {
			// console.log(req.body);
			// console.log(req.body.noteId);

			basket.remove({
				"_id": ObjectId(basketItemId)
			}, function(err, notes) {
				// console.log(notes.title);
				if (err) throw err;
				console.log("Deleted successfully");
				// body...
			});
			res.json({
				"Message": "Deleted"
			})
		}
    })
});
// Get phones rated by the user 
app.get("/ratedPhones/:userId", verifyToken, function (req, res) {
    jwt.verify(req.token, "secretkey", function (err, authData) {
        if (err) {
            // res.sendStatus(403);
            res.json({
                "Message": "Authorisation Failed"
            });
        } else {
            userReview.find({ "userId": req.params.userId }, function (err, reviewedItems) {
                if (reviewedItems.length > 0) {
                    res.json({
                        "ratedPhones": reviewedItems
                    })
                }
                else {
                    res.json({
                        "ratedPhones": "None"
                    })
                }

            });
        }
    })
})

// Gets users wished Item, requires userId to be passed like "myWishedProduct/213123udhj132"
app.get("/myWishedProduct/:id", verifyToken, function (req, res) {
    jwt.verify(req.token, "secretkey", function (err, authData) {
        if (err) {
            // res.sendStatus(403);
            res.json({
                "Message": "Authorisation Failed"
            });
        } else {
            var result;
            var mobileInfo = []
            var sharedData = "Data from : ";
            async.series([
                // First function
                function (callback) {
                    console.log("Firt function")
                    sharedData = "First Callback";
                    console.log(sharedData);
                    var result1;
                    User.find({ "_id": ObjectId(req.params.id) }, ['wishedProducts'], function (err, wishedProducts) {
                        // console.log(wishedProducts);
                        // console.log(wishedProducts[0].wishedProducts);
                        result = wishedProducts[0].wishedProducts;
                        if (!result.length > 0) {
                            res.json({
                                "Message": "No items wished yet"
                            })
                        }
                        callback();
                    })
                },
                // Second function
                function (callback) {
                    // console.log("IN SECOND FUNCTION");
                    // console.log(result);
                    for (let index = 0; index < result.length; index++) {
                        const element = result[index];
                        console.log(element);
                        // db.collection("mobilePhones").findOne({ "mobileId": parseInt(element) }, function (err, mobileData) {
                            phone.findOne({"mobileId": parseInt(element) }, function(err,mobileData){
                            // db.collection("mobilePhones").findOne({ "mobileId": element }).toArray(function (err, mobileData) {
                            if (err) throw err;
                            mobileInfo.push({
                                "mobileId": mobileData.mobileId,
                                "mobileName": mobileData.mobileName,
                                "mobilePrice": "£" + mobileData.mobilePrice,
                                "mobileImageUrl": mobileData.imageUrl
                            })
                            if (mobileInfo.length === result.length) {
                                callback();
                            }
                        })
                    }
                    // callback();
                }
            ],
                // Final callback 
                function (err) {
                    res.json({
                        result: mobileInfo
                    })
                    if (err) {
                        callback();
                    }
                    // callback();
                }
            );
        }
    })
});


// Get best selling product
app.get("/bestSelling", function (req, res) {
    // bestSelling.find({}, null to get everthing or [coloumn field ], { limit: 10, sort: { "noOfTimesOrdered": -1 } }, function (err, bestSellingData) {
    var result;
    var mobileInfo = []
    var sharedData = "Data from : ";
    async.series([
        // First function
        function (callback) {
            bestSelling.find({}, ['mobileId'], { limit: 5, sort: { "noOfTimesOrdered": -1 } }, function (err, bestSellingData) {
                console.log(bestSellingData)
                result = bestSellingData;
                callback();
            });
        },
        // Second function
        function (callback) {

            for (let index = 0; index < result.length; index++) {
                const element = result[index].mobileId;
                phone.findOne({"mobileId": parseInt(element) }, function(err,mobileData){
                    if (err) throw err;
                    console.log("MOB DATA " + mobileData.imageUrl)
                    mobileInfo.push({
                        "mobileId": mobileData.mobileId,
                        "mobileName": mobileData.mobileName,
                        "mobilePrice": "£" + mobileData.mobilePrice,
                        "mobileImageUrl": mobileData.imageUrl
                    });
                    if (mobileInfo.length == result.length) {
                        // console.log("Oi " + mobileInfo.length);
                        // console.log("Oi " + result.length);
                        callback();
                    }
                })
            }
            // callback();
        }
    ],
        // Final callback 
        function (err) {
            res.json({
                result: mobileInfo
            })
            if (err) {
                // callback();
            }
            // callback();
        }
    );  
});



// Get mostly wished item
app.get("/mostlyWished", function (req, res) {
    console.log("Getting mostly wished phones");
    var result;
    var mobileInfo = []
    async.series([
        // First function
        function (callback) {
            bestSelling.find({}, ['mobileId'], { limit: 5, sort: { "noOfTimesWished": -1 } }, function (err, bestSellingData) {
                console.log(bestSellingData)
                result = bestSellingData;
                callback();
            });
        },
        // Second function
        function (callback) {

            for (let index = 0; index < result.length; index++) {
                phone.findOne({"mobileId": parseInt(element) }, function(err,mobileData){
                    if (err) throw err;
                    console.log("MOB DATA " + mobileData.mobileName)
                    mobileInfo.push({
                        "mobileId": mobileData.mobileId,
                        "mobileName": mobileData.mobileName,
                        "mobilePrice": "£" + mobileData.mobilePrice,
                        "mobileImageUrl": mobileData.imageUrl
                    });
                    // console.log("Pushing " + mobileData.mobileName);
                    if (mobileInfo.length == result.length) {
                        callback();
                    }
                })

            }
            // callback();
        }
    ],
        // Final callback 
        function (err) {
            res.json({
                result: mobileInfo
            })
            if (err) {
                callback();
            }
            // callback();
        }
    );
});

// Get avg user_Ratings of a product by getting the product id /productRate/121
app.get("/productReview/:productId", function (req, res) {
    var oneStars = 0;
    var twoStars = 0;
    var threeStars = 0;
    var fourStars = 0;
    var fiveStars = 0;
    console.log(parseInt(req.params.productId));
    userReview.find({ "mobileId": parseInt(req.params.productId) }, function (err, reviews) {
        console.log(reviews);
        if (reviews.length > 0) {
            reviews.forEach(element => {
                console.log(element)
                if (element.noOfStars == 1) {
                    oneStars += 1;
                }
                if (element.noOfStars == 2) {
                    twoStars += 1;
                }
                if (element.noOfStars == 3) {
                    threeStars += 1;
                }
                if (element.noOfStars == 4) {
                    fourStars += 1;
                    console.log(fourStars);
                }
                if (element.noOfStars == 5) {
                    fiveStars += 1;
                }
            });
            console.log(oneStars , twoStars , threeStars, fourStars , fiveStars)
            var totalNoOfReviews = (oneStars + twoStars + threeStars + fourStars + fiveStars)
            var totalReviews = (1 * oneStars + 2 * twoStars + 3 * threeStars + 4 * fourStars + 5 * fiveStars);
            var ans = totalReviews / (oneStars + twoStars + threeStars + fourStars + fiveStars)
            var ratings = parseInt(ans);
            res.json(
                {
                    "Message": "Reviews",
                    "ratings": ratings,
                    "totalReviews":totalNoOfReviews,
                    "reviews" : reviews,
                    "oneStars": oneStars,
                    "twoStars": twoStars , 
                    "threeStars": threeStars, 
                    "fourStars": fourStars, 
                    "fiveStars": fiveStars
                }
            )
        } else {
            res.json(
                {
                    "reviews": "None",
                    // "ratings": ratings
                }
            )
        }

    })
})

app.post("/writeMyReview", verifyToken, function (req, res) {
    jwt.verify(req.token, "secretkey", function (err, authData) {
        if (err) {
            // res.sendStatus(403);
            res.json({
                "Message": "Authorisation Failed"
            });
        } else {
            console.log("Adding review to db");
            var mobId = parseInt(req.body.mobileId);
            var stars = parseInt(req.body.noOfStars);
            var review1 = new userReview({
                mobileId: mobId,
                userId: req.body.userId,
                userName: req.body.userName,
                noOfStars: stars,
                opinion: req.body.opinionText
            });
            review1.save(function (err, order) {
                if (err) {
                    console.log(err);
                } else {
                    res.json({
                        "Message": "success"
                    })
                    console.log(order);
                }
            });
        }
    })
});


app.get("/mostlyReviewed", function (req, res) {
    userReview.find({}, function (err, allReviews) {
        var mobileIds = []
        for (i in allReviews) {
            // console.log(allReviews[i].mobileId);
            mobileIds[i] = allReviews[i].mobileId;
        }
        console.log(mobileIds);
        var frequency = {};  // array of frequency.
        var max = 0;  // holds the highest number of times fir instance if mobId 121 apperas 6 time then max will be 6.
        var result;   // holds the id which appears most
        for (var v in mobileIds) {
            frequency[mobileIds[v]] = (frequency[mobileIds[v]] || 0) + 1; // increment frequency.
            if (frequency[mobileIds[v]] > max) { // is this frequency > max so far ?
                max = frequency[mobileIds[v]];  // update max.
                result = mobileIds[v];          // update result.
            }
        }
        // Loop through frequency array and find the most appearing id, store it and remove all instances of tht id from mobileIds
        var localTempArr = [] //Hold the mobile id in the order of mostly reviwed 
        for (i in frequency) {
            // console.log("DUDE " + mobileIds)
            var mostAppearingId = findMax(mobileIds, frequency);
            localTempArr.push(mostAppearingId);
            for (var i = 0; i < mobileIds.length; i++) {
                if (mobileIds[i] == mostAppearingId) {
                    mobileIds.splice(i, 1);
                    i--; //reduce the index size once deleteing it 
                }
            }
        }

        var mobileInfo = []
        for (i in localTempArr) {
            phone.findOne({"mobileId":  localTempArr[i] }, function(err,mobileData){

            // db.collection("mobilePhones").findOne({ "mobileId": localTempArr[i] }, function (err, mobileData) {
                if (err) throw err;
                // cant use mobileInfo[i] as i starts wiith 1 
                mobileInfo.push({
                    "mobileId": mobileData.mobileId,
                    "mobileName": mobileData.mobileName,
                    "mobilePrice": "£" + mobileData.mobilePrice,
                    "mobileImageUrl": mobileData.imageUrl
                })
                console.log(mobileInfo.length); 
                if (mobileInfo.length === 5) {
                    res.json({
                        "result": mobileInfo
                    })
                }
            })
        }
    })
})

function findMax(mobileIds, frequency) {
    // var mobileIds = []
    // var frequency = {};  // array of frequency.
    var max = 0;  // holds the max frequency.
    var result;   // holds the max frequency element.
    // console.log(mobileIds);
    for (var v in mobileIds) {
        frequency[mobileIds[v]] = (frequency[mobileIds[v]] || 0) + 1; // increment frequency.
        if (frequency[mobileIds[v]] > max) { // is this frequency > max so far ?
            max = frequency[mobileIds[v]];  // update max.
            result = mobileIds[v];          // update result.
        }
    }
    // result returns the Id thts apperaring most in [mobileIds]
    return result;
}

// Post a questiion for a mobile. requires, UserId,mobileId,userName, question
app.post("/postQuestion", verifyToken, function (req, res) {
    jwt.verify(req.token, "secretkey", function (err, authData) {
        if (err) {
            res.json({
                "Message": "Authorisation Failed"
            });
        } else {
            var newQuestion = new questionAnswers({
                userId: req.body.userId,
                mobileId: parseInt(req.body.mobileId),
                userName: req.body.userName,
                question: req.body.question
            });
            newQuestion.save(function (err, savedQuestion) {
                if (err) {
                    console.log(err);
                } else {
                    res.json({
                        "Message": "Success",
                        "question": savedQuestion
                    })
                }
            });
        }
    })
})

// Posting an answer to question, requires, questionId, answer, userId, userName
app.post("/postAnswer", verifyToken, function (req, res) {
    jwt.verify(req.token, "secretkey", function (err, authData) {
        if (err) {
            res.json({
                "Message": "Authorisation Failed"
            });
        } else {
            // questionnId 5c05b88c805cf63b98b97a40
            questionAnswers.findByIdAndUpdate({
                "_id": ObjectId(req.body.questionId)
            },
                {
                    $push: {
                        "answers": {
                            "answer": req.body.answer,
                            "userId": req.body.userId,
                            "userName": req.body.userName
                        }
                    }
                }, function (err, answered) {
                    if (err) {
                        res.json({ "Message": "Error" })
                    }
                    // console.log(answered);
                    else {
                        res.json({ "Message": "Success" })
                    }
                })
        }
    })
})

// Get QAndA for a product instance eg /getQAndAs/120
app.get("/getQAndAs/:mobileId", function (req, res) {
    questionAnswers.find({ "mobileId": req.params.mobileId }, function (err, qAndAs) {
        // console.log(qandAs);
        if (qAndAs.length > 0) {
            res.json({
                "qAndAs": qAndAs
            })
        }
        else {
            res.json({
                "qAndAs": "None"
            })
        }
    })
})

// route to check if token is expired or not 
app.get("/checkToken", verifyToken, function (req, res) {
    jwt.verify(req.token, "secretkey", function (err, authData) {
        if (err) {
            // res.sendStatus(403);
            res.json({
                "Message": false,
                err : err
            });
        } else {
            res.json({
                "Message": true
            })
        }
    })
})

app.listen(3000, function () {
    console.log('App listening on port ' + 3000);
});

// verifyToken
// TokenFormat 
// Authorisation: Bearer [CRAZYTOKEN]
function verifyToken(req, res, next) {
    // Get auth header value
    var bearerHeader = req.headers["authorization"];
    // Token Validation first
    if (typeof (bearerHeader) !== "undefined") {
        var bearer = bearerHeader.split(" ");
        // Get token from bearer array[1]
        var bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        // res.sendStatus(403)
        res.json({
            "Message": "AAuthorisation Failed"
        });
    }
}

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login")
}
