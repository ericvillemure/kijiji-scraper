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

firebase
  .auth()
  .signInAnonymously()
  .catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log("error authenticating to firebase", errorCode, errorMessage);
  });

var database = firebase.database();

var writer = csvWriter({
  headers: [
    "title",
    "url",
    "id",
    "price",
    "year",
    "brand",
    "model",
    "driveWheelConfiguration",
    "vehicleTransmission",
    "fuelType",
    "mileageFromOdometer",
    "dateFound"
  ]
});
writer.pipe(fs.createWriteStream("out.csv", { encoding: "ascii" }));

var logWriter = csvWriter();
logWriter.pipe(fs.createWriteStream("log.csv"));

//const listOfMakes = ["acura", "alpharomeo", "am_general", "amc", "astnmrtn", "audi", "austinhealey", "bentley", "bmw", "bricklin", "bugatti", "buick", "cadillac", "chevrolet", "chrysler", "daewoo", "diahatsu", "datsun", "dodge", "eagle", "ferrari", "fiat", "ford", "genesis", "geo", "gmc", "honda", "hummer", "hyundai", "infiniti", "inthrvstr", "isuzu", "jaguar", "jeep", "kia", "lmbrghn", "landrover", "lexus", "lincoln", "lotus", "maserati", "maybach", "mazda", "mercedes", "mercury", "mg", "mini", "mitsubishi", "nissan", "oldsmobile", "opel", "peugeot", "plymouth", "pontiac", "porsche", "ram", "renault", "rollsroyce", "saab", "saturn", "scion", "shelby", "smart", "subaru", "suzuki", "tesla", "toyota", "triumph", "volkwagen", "volvo", "othrmake"];
const listOfMakes = ["acura", "alpharomeo"];

//We need to search by make because kijiji has a maximum page count = 100.  Even then some makes have more than 3000
Promise.all(
  listOfMakes.map(
    make =>
      new Promise((resolve, reject) => {
        osmosis
          .get(
            `https://www.kijiji.ca/b-autos-camions/quebec/${make}/c174l9001a54?ad=offering&a-vendre-par=ownr`
          )
          .paginate('a:contains("Suivante")', 1)
          .find("a.title")
          .set("title")
          .set({
            url: "@href"
          })
          .then(e => console.log("then", e))
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
          .data(function(listing) {
            const data = {
              ...listing,
              mileageFromOdometer:
                listing.mileageFromOdometer &&
                listing.mileageFromOdometer.replace(/\s/g, ""),
              dateFound: Date()
            };

            var ref = database.ref("listings/" + data.id);
            ref.once("value", snap => {
              if (snap.val()) {
                ref.set(data);
              }
            });

            //console.log('write', data);
            //writer.write(data);
            // do something with listing data
          })
          .log(data => logWriter.write({ date: Date(), type: "log", data }))
          .error(err => {
            console.log("error", err);
            logWriter.write({ type: "error", data: err });
          })
          .done(() => {
            resolve();
          });
      })
  )
)
  .then(() => {
    writer.end();
    logWriter.end();
  })
  .catch(e => console.log("global error", e));
