// Incharge of storing best selling, mostly wished items on the site
var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var orderedPhoneSchema = new mongoose.Schema({
	mobileId: {
		type: Number,
		required: true
	},
	noOfTimesOrdered: {
        type:Number
    },
    noOfTimesWished:{
        type:Number
    }
});

// Telling passport to use email  as username when signing up.
// usersSchema.plugin(passportLocalMongoose, { usernameField : 'email' });

// usersSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("bestSelling", orderedPhoneSchema);


// var order1 = mongoose.model('bestSelling', orderedPhoneSchema);

// var kitty = new order1({ mobileId:101,noOfTimesOrdered:0,noOfTimesWished:2});
// kitty.save(function (err,order) {
// 	if (err) {
// 		console.log(err);
// 	} else {
// 		console.log(order);
// 	}
// });