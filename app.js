require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectId } = require('mongodb');
const path = require('path');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();

const PORT = process.env.PORT || 3000;
const uri = `mongodb+srv://Matthew:${process.env.mongo_pwd}@cluster0.vza6k.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Initialize MongoDB client and connect once
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

client.connect().then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB:', err);
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// Routes
app.get('/', async (req, res) => {
    const collection = client.db('matts-db').collection('cool-collection');
    const movies = await collection.find().sort({ rating: -1 }).limit(5).toArray();
    res.render('index', { movies });
});

app.get('/ratings', async (req, res) => {
    const collection = client.db('matts-db').collection('cool-collection');
    const result = await collection.find().toArray();
    res.render('ratings', { mongoResult: result });
});

app.post('/add-rating', async (req, res) => {
    const { movieName, rating } = req.body;
    const numericRating = parseFloat(rating);

    if (isNaN(numericRating) || numericRating < 1 || numericRating > 10) {
        return res.status(400).send('Rating must be a number between 1 and 10.');
    }

    const collection = client.db('matts-db').collection('cool-collection');
    await collection.insertOne({
        post: movieName,
        rating: numericRating,
    });
    res.redirect('/ratings');
});

app.post('/update/:id', async (req, res) => {
    const movieId = req.params.id;
    const newRating = parseFloat(req.body.newRating);
    const collection = client.db('matts-db').collection('cool-collection');
    await collection.updateOne(
        { _id: new ObjectId(movieId) },
        { $set: { rating: newRating } }
    );
    res.redirect('/ratings');
});

app.post('/delete/:id', async (req, res) => {
    const collection = client.db('matts-db').collection('cool-collection');
    await collection.findOneAndDelete({ _id: new ObjectId(req.params.id) });
    res.redirect('/ratings');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
