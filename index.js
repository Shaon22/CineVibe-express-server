const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();

const allowedOrigins = ['https://boisterous-banoffee-85e31d.netlify.app'];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // allow non-browser requests like Postman
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sykxlbw.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let movieCollection, seriesCollection, blogsCollection;

async function connectDb() {
  if (!client.isConnected?.()) {
    await client.connect();
    const db = client.db("CineVibe");
    movieCollection = db.collection("movies");
    seriesCollection = db.collection("series");
    blogsCollection = db.collection("blogs");
  }
}

// Routes

app.get("/api/allMovies", async (req, res) => {
  await connectDb();
  const result = await movieCollection.find().toArray();
  res.json(result);
});

app.get("/api/allMovies/:id", async (req, res) => {
  await connectDb();
  const id = req.params.id;
  const result = await movieCollection.findOne({ _id: new ObjectId(id) });
  res.json(result);
});

app.get("/api/allSeries", async (req, res) => {
  await connectDb();
  const result = await seriesCollection.find().toArray();
  res.json(result);
});

app.get("/api/allSeries/:id", async (req, res) => {
  await connectDb();
  const id = req.params.id;
  const result = await seriesCollection.findOne({ _id: new ObjectId(id) });
  res.json(result);
});

app.get("/api/allBlogs", async (req, res) => {
  await connectDb();
  const result = await blogsCollection.find().toArray();
  res.json(result);
});

app.get("/api/allBlogs/:id", async (req, res) => {
  await connectDb();
  const id = req.params.id;
  const result = await blogsCollection.findOne({ _id: new ObjectId(id) });
  res.json(result);
});

app.get("/", (req, res) => {
  res.send("server is running");
});

// Export the app for Vercel
module.exports = app;
