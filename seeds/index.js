const mongoose = require('mongoose');
const Campground = require('../Models/campground');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');

mongoose.set('strictQuery', false);

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
    console.log("Connected to Database");
}

const sample = arr => arr[Math.floor(Math.random() * arr.length)];

const seedDb = async() => {
    await Campground.deleteMany({});

    for (let i = 0; i < 300; i++) {
        let random1000 = Math.floor(Math.random() * 1000) + 1;
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '63d79281667e0fedf96e4ded',
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${cities[random1000].city},${cities[random1000].state}`,
            geometry: { type: 'Point', coordinates: [`${cities[random1000].longitude}`, `${cities[random1000].latitude}`] },
            images: [{
                    url: 'https://res.cloudinary.com/dtv59bp9v/image/upload/v1675275574/YelCamp/xss2hv9am5yeap6ufcse.jpg',
                    filename: 'YelCamp/xss2hv9am5yeap6ufcse'
                },
                {
                    url: 'https://res.cloudinary.com/dtv59bp9v/image/upload/v1675275573/YelCamp/ib9dkfqdt7juo2n1ifd8.jpg',
                    filename: 'YelCamp/ib9dkfqdt7juo2n1ifd8'
                },
                {
                    url: 'https://res.cloudinary.com/dtv59bp9v/image/upload/v1675275574/YelCamp/zcqdezp7uxxauepyfrrf.jpg',
                    filename: 'YelCamp/zcqdezp7uxxauepyfrrf'
                }
            ],
            description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Repudiandae voluptas ab delectus dolorum, minus molestiae quia nam sequi nostrum odit dolores id alias consequuntur molestias eveniet consectetur neque ea! Officia?',
            price
        })
        await camp.save();
    }
}
seedDb().then(() => {
    mongoose.connection.close();
}).catch(err => {
    console.log(err);
});