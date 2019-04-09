// User.js Defining the TABLE (Fields in Mongo DB)
var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var orderedPhoneSchema = new mongoose.Schema({
	// Username field
	userId: {
		type: String,
		required: true
	},

	mobileId: {
		type: Number,
		required: true
	},
	mobileName: {
		type: String,
		required: true
	},
	mobilePrice: {
		type: Number,
		required: true
	},
	mobileImageUrl:{
		type: String,
		required: true
	},
	orderedAt:{
		type: String,
		reuired: true
	}
});

// Telling passport to use email  as username when signing up.
// usersSchema.plugin(passportLocalMongoose, { usernameField : 'email' });

// usersSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("UserOrder", orderedPhoneSchema);
// var mydate1 = new Date()
// // expected output: 0
//     var monthNames = [
//     "January", "February", "March",
//     "April", "May", "June", "July",
//     "August", "September", "October",
//     "November", "December"
//     ];

//     var d = mydate1.getDate();
//     var m = monthNames[mydate1.getMonth()];
//     var y = mydate1.getFullYear();
// console.log(d + " "+ m + " "+  y)

// var order1 = mongoose.model('UserOrder', orderedPhoneSchema);

// var kitty = new order1({ userId: '5c0061f5b45fe00ca9fc1c71', mobileId: 118, mobileName: "Apple iPhone XS Max", mobilePrice: 1066, mobileImageUrl: "https://eshop.lycamobile.co.uk/pub/media/catalog/product/cache/c687aa7517cf01e65c009f6943c2b1e9/a/p/apple-iphone-xs-max-grey.jpg" , orderedAt: d + " "+ m + " "+  y  });
// kitty.save(function (err, order) {
// 	if (err) {
// 		console.log(err);
// 	} else {
// 		console.log(order);
// 	}
// });