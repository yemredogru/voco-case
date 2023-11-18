const express = require('express');
const mongoose = require('mongoose');
const Restaurant = require('./models/resturantSchema')
const Address = require("./models/addressSchema")
const Review = require('./models/reviewSchema')
const Menu = require("./models/menuSchema")
const app = express();
const port = 3000;

async function connectDb() {
    try {
        const connection = await mongoose.connect('mongodb://127.0.0.1:27017/vocoapp');
        console.log(`MongoDB Connected: ${connection.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}

async function runServer() {
    await connectDb()
        .then(() => {

            app.post('/create-menus', async (req, res) => {
                try {
                    const menuItems = await Menu.create(
                        {
                            name: 'Küçük Boy Peynirli Pizza',
                            price: 50
                        },
                        {
                            name: 'Orta Boy Mantarlı Pizza',
                            price: 100
                        },
                        {
                            name: 'Hamburger',
                            price: 120
                        }
                    );
                    var existingRestaurant = await Restaurant.findOne({ name: 'Voco Fast Food' })
                    if (!existingRestaurant) {
                        existingRestaurant = await Restaurant.create({ name: "Voco Fast Food" })
                    }

                    existingRestaurant.menu.push(...menuItems);
                    await existingRestaurant.save();


                    res.status(201).json({ status: true, message: existingRestaurant })
                } catch (error) {

                    res.status(500)
                }
            })
            app.get('/restaurants', async (req, res) => {

                const page = parseInt(req.query.page) || 1;
                const limit = 10;

                try {
                    const restaurants = await Restaurant.find()
                        .sort({ rating: -1 })
                        .skip((page - 1) * limit)
                        .limit(limit);

                    res.json(restaurants);
                } catch (error) {
                    res.status(500).json({ error: 'Internal Server Error' });
                }
            });
            app.get('/filter-restaurants', async (req, res) => {
                try {
                    const restaurants = await Restaurant.find({
                        'description': { $regex: /lahmacun/i },
                        'address.location': {
                            $near: {
                                $geometry: {
                                    type: 'Point',
                                    coordinates: [39.9, 32.8],
                                },
                                $maxDistance: 100000,
                                $minDistance: 0,
                            },
                        },
                    }).populate('address');

                    if (!restaurants) {
                        return res.status(404).json({ message: 'Restaurants not found' });
                    }

                    res.json(restaurants);
                } catch (error) {
                    console.error('Error:', error);
                    res.status(500).json({ message: 'Internal Server Error' });
                }
            });

            var page = 0;
            app.get('/reviews', async (req, res) => {
                try {
                    const skipCount = 20 * page
                    const reviews = await Review
                        .find()
                        .populate('user')
                        .sort({ date: -1 })
                        .skip(skipCount)
                        .limit(20);

                    const sortedReviews = reviews.sort((a, b) => {
                        const ageA = a.userId.age || 0;
                        const ageB = b.userId.age || 0;
                        return ageB - ageA;
                    });

                    console.log(sortedReviews);
                    page++
                    res.json(sortedReviews);
                } catch (error) {
                    console.error('Sorgu hatası:', error);
                }
            })
            app.get('/matches', async (req, res) => {
                try {
                    const pipeline = [
                        {
                            $unwind: "$ratings",
                        },
                        {
                            $group: {
                                _id: "$_id",
                                averageRating: { $avg: "$ratings.score" },
                                name: { $first: "$name" },
                                category: { $first: "$category" },
                                description: { $first: "$description" },
                            },
                        },
                        {
                            $match: {
                                averageRating: { $gte: 4 },
                                $or: [
                                    { category: { $in: ["fast food", "ev yemekleri"] } },
                                    { description: { $regex: /fast/i } },
                                ],
                            },
                        },
                        {
                            $project: {
                                _id: 0,
                                name: 1,
                                category: 1,
                                description: 1,
                            },
                        },
                    ];

                    const result = await Restaurant.aggregate(pipeline);
                    console.log(result)
                    res.json(result)
                } catch (error) {
                    console.error('Sorgu hatası:', error);
                }
            })


            app.listen(port, () => {
                console.log(`Server is running on http://localhost:${port}`);
            });
        })
        .catch(() => {
            console.error("DB bağlantı hatası")
        })



}

runServer()


