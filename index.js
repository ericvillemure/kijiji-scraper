var osmosis = require('osmosis');
var csvWriter = require('csv-write-stream')
const fs = require('fs');

var writer = csvWriter()
writer.pipe(fs.createWriteStream('out.csv'))


osmosis
.get('https://www.kijiji.ca/b-autos-camions/quebec/c174l9001?ad=offering&a-vendre-par=ownr')
.paginate('.selected + a')
.find('a.title')
.set('title')
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
    writer.write(listing);
    // do something with listing data
})
//.log(console.log)
.error(err => console.log("error", err))
.done(() => {
    writer.end()
})
//.debug(console.log)