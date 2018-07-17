const osmosis = require("osmosis");
const csvWriter = require("csv-write-stream");
const fs = require("fs");
const firebase = require("firebase");

var config = {
  apiKey: "AIzaSyAz8_5CQXo1oCclki5HQjjFsoJk6bbB8Kc",
  authDomain: "kijiji-scraper.firebaseapp.com",
  databaseURL: "https://kijiji-scraper.firebaseio.com",
  projectId: "kijiji-scraper",
  storageBucket: "kijiji-scraper.appspot.com",
  messagingSenderId: "446280846330"
};
var app = firebase.initializeApp(config);

// firebase
//   .auth(app)
//   .signInAnonymously()
//   .catch(function(error) {
//     var errorCode = error.code;
//     var errorMessage = error.message;
//     console.log("error authenticating to firebase", errorCode, errorMessage);
//   });

// var writer = csvWriter({
//   headers: [
//     "title",
//     "url",
//     "id",
//     "price",
//     "year",
//     "brand",
//     "model",
//     "driveWheelConfiguration",
//     "vehicleTransmission",
//     "fuelType",
//     "mileageFromOdometer",
//     "dateFound"
//   ]
// });
// writer.pipe(fs.createWriteStream("out.csv", { encoding: "ascii" }));

var logWriter = csvWriter();
logWriter.pipe(fs.createWriteStream("log.csv"));

const listOfMakes = [
  "acura",
  "alpharomeo",
  "am_general",
  "amc",
  "astnmrtn",
  "audi",
  "austinhealey",
  "bentley",
  "bmw",
  "bricklin",
  "bugatti",
  "buick",
  "cadillac",
  "chevrolet",
  "chrysler",
  "daewoo",
  "diahatsu",
  "datsun",
  "dodge",
  "eagle",
  "ferrari",
  "fiat",
  "ford",
  "genesis",
  "geo",
  "gmc",
  "honda",
  "hummer",
  "hyundai",
  "infiniti",
  "inthrvstr",
  "isuzu",
  "jaguar",
  "jeep",
  "kia",
  "lmbrghn",
  "landrover",
  "lexus",
  "lincoln",
  "lotus",
  "maserati",
  "maybach",
  "mazda",
  "mercedes",
  "mercury",
  "mg",
  "mini",
  "mitsubishi",
  "nissan",
  "oldsmobile",
  "opel",
  "peugeot",
  "plymouth",
  "pontiac",
  "porsche",
  "ram",
  "renault",
  "rollsroyce",
  "saab",
  "saturn",
  "scion",
  "shelby",
  "smart",
  "subaru",
  "suzuki",
  "tesla",
  "toyota",
  "triumph",
  "volkwagen",
  "volvo",
  "othrmake"
];
//const listOfMakes = ["acura", "alpharomeo", "am_general", "amc"];

//We need to search by make because kijiji has a maximum page count = 100.  Even then some makes have more than 3000

var promises = listOfMakes.map(
  make =>
    new Promise(resolve =>
      osmosis
        .get(
          `https://www.kijiji.ca/b-autos-camions/quebec/${make}/c174l9001a54?ad=offering&a-vendre-par=ownr`
        )
        .paginate('a:contains("Suivante")')
        .find("a.title")
        .set("title")
        .set({
          url: "@href"
        })
        .then((context, data, next, done) => {
          // var database = app.database();
        //   console.log("then", data.url);
          var ref = app.database().ref("listings");
          ref
            .orderByChild("url")
            .equalTo(data.url)
            .once("value", snapshot => {
              //console.log("once", snapshot.val());
              if (!snapshot.val()) {
                //Only fetch the listing if it's not already in the database.  We ignore updates for now
                next(context, data);
              }
              done();
            });

          //   if (context.index % 2 == 0 || true) {
          //     //console.log("then next");
          //     next(context, data);
          //   }
          //console.log("then done");
        })
        .follow("@href")
        .set({
          id: 'li[class^="currentCrumb"] span',
          price: '[itemprop="price"]:first@content',
          year: '[itemprop="vehicleModelDate"]',
          brand: '[itemprop="brand"]',
          model: '[itemprop="model"]',
          driveWheelConfiguration: '[itemprop="driveWheelConfiguration"]',
          vehicleTransmission: '[itemprop="vehicleTransmission"]',
          fuelType: '[itemprop="fuelType"]',
          mileageFromOdometer: '[itemprop="mileageFromOdometer"]'
        })
        .data(function(data) {
          const listing = {
            ...data,
            mileageFromOdometer:
              data.mileageFromOdometer &&
              data.mileageFromOdometer.replace(/\s/g, ""),
            dateFound: Date()
          };
          if (!listing.id) {
            console.log("invalid id", listing);
          } else {
            var ref = app.database().ref("listings/" + listing.id);
            ref.set(listing);
          }
        })
        //.log(data => logWriter.write({ date: Date(), type: "log", data }))
        .error(err => {
          console.log("error", err);
          logWriter.write({ type: "error", data: err });
        })
        .done(() => {
          resolve();
        })
    )
);

var allPromises = Promise.all(promises);
allPromises
  .then(() => {
    logWriter.end();
    app
      .delete()
      .then(function() {
        console.log("App deleted successfully");
      })
      .catch(function(error) {
        console.log("Error deleting app:", error);
      });
  })
  .catch(e => console.log("global error", e));
