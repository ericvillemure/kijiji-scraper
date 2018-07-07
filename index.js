var osmosis = require('osmosis');
var csvWriter = require('csv-write-stream')
const fs = require('fs');

var writer = csvWriter()
writer.pipe(fs.createWriteStream('out.csv',{ encoding: "ascii" }));

var logWriter = csvWriter()
logWriter.pipe(fs.createWriteStream('log.csv'));

const listOfMakes = ["acura", "alpharomeo", "am_general", "amc", "astnmrtn", "audi", "austinhealey", "bentley", "bmw", "bricklin", "bugatti", "buick", "cadillac", "chevrolet", "chrysler", "daewoo", "diahatsu", "datsun", "dodge", "eagle", "ferrari", "fiat", "ford", "genesis", "geo", "gmc", "honda", "hummer", "hyundai", "infiniti", "inthrvstr", "isuzu", "jaguar", "jeep", "kia", "lmbrghn", "landrover", "lexus", "lincoln", "lotus", "maserati", "maybach", "mazda", "mercedes", "mercury", "mg", "mini", "mitsubishi", "nissan", "oldsmobile", "opel", "peugeot", "plymouth", "pontiac", "porsche", "ram", "renault", "rollsroyce", "saab", "saturn", "scion", "shelby", "smart", "subaru", "suzuki", "tesla", "toyota", "triumph", "volkwagen", "volvo", "othrmake"];

//We need to search by make because kijiji has a maximum page count = 100.  Even then some makes have more than 3000
listOfMakes.forEach(make => {
    
    osmosis
    .get(`https://www.kijiji.ca/b-autos-camions/quebec/${make}/c174l9001a54?ad=offering&a-vendre-par=ownr`)
    .paginate('a:contains("Suivante")')
    .find('a.title')
    .set('title')
    .set({
        'url': '@href'
    })
    .follow('@href')
    .set({
        'id': 'li[class^="currentCrumb"] span',
        'price':'[itemprop="price"]:first@content',
        'year':'[itemprop="vehicleModelDate"]',
        'brand':'[itemprop="brand"]',
        'model':'[itemprop="model"]',
        'driveWheelConfiguration':'[itemprop="driveWheelConfiguration"]',
        'vehicleTransmission':'[itemprop="vehicleTransmission"]',
        'fuelType':'[itemprop="fuelType"]',
        'mileageFromOdometer':'[itemprop="mileageFromOdometer"]',
    })
    .data(function(listing) {
        const data = {
            ...listing,
            mileageFromOdometer: listing.mileageFromOdometer && listing.mileageFromOdometer.replace(/\s/g,'')
        };
        console.log('write', data);
        writer.write(data);
        // do something with listing data
    })
    .log(data => logWriter.write({type: 'log', data}))
    .error(err => {
        console.log('error', err);
        logWriter.write({type: 'error',data: err});
    })
    .done(() => {
        writer.end()
    })
})
//.debug(console.log)