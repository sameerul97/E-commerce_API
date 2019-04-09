// Incharge of user review
var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var userReviewsSchema = new mongoose.Schema({
    mobileId: {
        type: Number,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    noOfStars: {
        type: Number,
        required: true
    },
    opinion: {
        type: String,
        required: true
    }
});

// Telling passport to use email  as username when signing up.
// usersSchema.plugin(passportLocalMongoose, { usernameField : 'email' });

// usersSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("userReview", userReviewsSchema);


// var userView = mongoose.model('userReview', userReviewsSchema);

// var review1 = new userView({ mobileId: 101, userId:'5c17d556a930080b6032557b', userName: 'sam', noOfStars: 4, opinion: "Great screen resolution as well an camera is pretty sharp." });
// review1.save(function (err, order) {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log(order);
//     }
// });