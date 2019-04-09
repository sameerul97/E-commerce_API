// Incharge of storing best selling, mostly wished items on the site
var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var phone = new mongoose.Schema({

    topSpec: {

    },
    mobileName: "",
    fullSpec: {

    },
    mobileStock: "",
    mobileId: "",
    mobilePrice: "",
    sizeVariant: {

    },
    colourVariant: {

    },
    imageUrl: ""

});

// Telling passport to use email  as username when signing up.
// usersSchema.plugin(passportLocalMongoose, { usernameField : 'email' });

// usersSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("phones", phone);


var order1 = mongoose.model("phones", phone);

// var kitty = new order1({
//     topSpec: {
//         os: 'Android',
//         camera: '12 Megapixels',
//         display: 'Super AMOLED',
//         storage: '128 GB / 512 GB',
//         battery: '4000mAh'
//     },
//     mobileName: 'Samsung Galaxy Note 9 (2018)',
//     fullSpec: {
//         'Mobile Weight': '201 g',
//         'Screen Size (Diagonal)': '6.4 Inch',
//         'Stero bluetooth (A2DP)': 'Yes',
//         Resolutions: '1440 x 2960 pixels',
//         'WLan/WiFi Support': 'Yes',
//         'Camera auto focus': 'Yes',
//         USB: 'Type-C 1.0 reversible connector',
//         Capacity: '4000mAh',
//         'Connection type headset': '3.5 mm',
//         'Display type': 'Super AMOLED capacitive touchscreen, 16M colors',
//         'USB version': '3.1',
//         'Video Recording': 'Yes',
//         'Camera resolution ': '12 Megapixels',
//         Dimension: '161.9 x 76.4 x 8.8 mm',
//         'Additional Internal Storage': 'Up to 512 GB',
//         'Memory Card Type': 'microSD (uses SIM 2 slot) - dual SIM model only',
//         'Bluetooth version': '5.0 A2DP, LE, aptX'
//     },
//     mobileStock: 'Now In Stock',
//     mobileId: 100,
//     mobilePrice: 767,
//     sizeVariant: {
//         size3: '256 GB',
//         size1: '64 GB',
//         size2: '128 GB'
//     },
//     colourVariant: {
//         colour1: 'Silver'
//     },
//     imageUrl: 'https://eshop.lycamobile.co.uk/pub/media/catalog/product/cache/c687aa7517cf01e65c009f6943c2b1e9/s/a/samsung-galaxy-note-9-front.jpg'
// });
// kitty.save(function (err,order) {
// 	if (err) {
// 		console.log(err);
// 	} else {
// 		console.log(order);
// 	}
// });
// var fs = require('fs');

// var obj = JSON.parse(fs.readFileSync('data4withImageURL.json', 'utf8'));
// var jsonData = obj;
// mongoose.connect('mongodb://127.0.0.1/Ecommerce');
// var db = mongoose.connection;

// db.collection("phones").findOne({ "mobileId": 100 }, function (err, result) {
//     if (err) throw err;
//     // console.log(result);
// });
// for (i in jsonData.phones) {
//     var phone =
//     {
//         "topSpec": jsonData.phones[i].topSpec,
//         "mobileName": jsonData.phones[i].mobileName,
//         "fullSpec": jsonData.phones[i].fullSpec,
//         "mobileStock": jsonData.phones[i].mobileStock,
//         "mobileId": jsonData.phones[i].mobileId,
//         "mobilePrice": jsonData.phones[i].mobilePrice,
//         "sizeVariant": jsonData.phones[i].sizeVariant,
//         "colourVariant": jsonData.phones[i].colourVariant,
//         "imageUrl": jsonData.phones[i].imageUrl
//     }
//     // mobileName.push(jsonData.phones[i].mobileName);
//     console.log(phone);
//     db.collection("phones").insertOne(phone, function (err, res) {
//         if (err) throw err;
//         console.log("Uploaded to DB ");
//         // db.close();
//     });
// }
// {
    // topSpec: {
    //     os: 'Android',
    //     camera: '12 Megapixels',
    //     display: 'Super AMOLED',
    //     storage: '128 GB / 512 GB',
    //     battery: '4000mAh'
    // },
    // mobileName: 'Samsung Galaxy Note 9 (2018)',
    // fullSpec: {
    //     'Mobile Weight': '201 g',
    //     'Screen Size (Diagonal)': '6.4 Inch',
    //     'Stero bluetooth (A2DP)': 'Yes',
    //     Resolutions: '1440 x 2960 pixels',
    //     'WLan/WiFi Support': 'Yes',
    //     'Camera auto focus': 'Yes',
    //     USB: 'Type-C 1.0 reversible connector',
    //     Capacity: '4000mAh',
    //     'Connection type headset': '3.5 mm',
    //     'Display type': 'Super AMOLED capacitive touchscreen, 16M colors',
    //     'USB version': '3.1',
    //     'Video Recording': 'Yes',
    //     'Camera resolution ': '12 Megapixels',
    //     Dimension: '161.9 x 76.4 x 8.8 mm',
    //     'Additional Internal Storage': 'Up to 512 GB',
    //     'Memory Card Type': 'microSD (uses SIM 2 slot) - dual SIM model only',
    //     'Bluetooth version': '5.0 A2DP, LE, aptX'
    // },
    // mobileStock: 'Now In Stock',
    // mobileId: 100,
    // mobilePrice: 767,
    // sizeVariant: {
    //     size3: '256 GB',
    //     size1: '64 GB',
    //     size2: '128 GB'
    // },
    // colourVariant: {
    //     colour1: 'Silver'
    // },
    // imageUrl: 'https://eshop.lycamobile.co.uk/pub/media/catalog/product/cache/c687aa7517cf01e65c009f6943c2b1e9/s/a/samsung-galaxy-note-9-front.jpg'
// }