var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var questionAnswerSchema = new mongoose.Schema({
    // Username field
    userId: {
        type: String,
        required: true
    },
    mobileId: {
        type: Number,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    question: {
        type: String,
        required: true
    },
    answers: [{
        answer: String,
        userId: String,
        userName: String,
    }],

});

// Telling passport to use email  as username when signing up.
// usersSchema.plugin(passportLocalMongoose, { usernameField : 'email' });

// usersSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("questionAnswer", questionAnswerSchema);


// var order1 = mongoose.model('questionAnswer', questionAnswerSchema);

// var kitty = new order1({ userId: '5c0061f5b45fe00ca9fc1c71', mobileId: 118, userName: "Max", question: "How many pixel is the camera ?" });
// kitty.save(function (err, order) {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log(order);
//     }
// });     



