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
.find('[itemprop="price"]:first@content')
.set('price')
.find('[itemprop="vehicleModelDate"]')
.set('year')
.find('[itemprop="brand"]')
.set('brand')
.find('[itemprop="model"]')
.set('model')


.find('[itemprop="driveWheelConfiguration"]')
.set('driveWheelConfiguration')


.find('[itemprop="vehicleTransmission"]')
.set('vehicleTransmission')
.find('[itemprop="fuelType"]')
.set('fuelType')
.find('[itemprop="mileageFromOdometer"]')
.set('mileageFromOdometer')


// .follow('@href')

// .find('p > a')
// .follow('@href')
// .set({
//     'title':        'section > h2',
//     'description':  '#postingbody',
//     'subcategory':  'div.breadbox > span[4]',
//     'date':         'time@datetime',
//     'latitude':     '#map@data-latitude',
//     'longitude':    '#map@data-longitude',
//     'images':       ['img@src']
// })
.data(function(listing) {
    writer.write(listing);
    // do something with listing data
})
//.log(console.log)
.error(console.log)
.done(() => {
    writer.end()
})
//.debug(console.log)