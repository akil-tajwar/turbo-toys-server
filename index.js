const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
const toy = require('./data/toy.json')
const category = require('./data/category.json')

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fdbahux.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const toyCollection = client.db('toyDB').collection('newtoy');

    app.get('/newtoy', async (req, res) => {
      const cursor = toyCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.post('/newtoy', async (req, res) => {
      const newToy = req.body;
      console.log(newToy);
      const result = await toyCollection.insertOne(newToy);
      res.send(result);
    })

    app.get('/mytoys', async (req, res) => {
      console.log(req.query.email);
      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email }
      }
      const result = await toyCollection.find(query).toArray();
      res.send(result);
    })

    app.delete('/mytoys/:id', async(req, res) => {
      const id = req.params.id;
      const querry = {_id: new ObjectId(id)};
      const result = await toyCollection.deleteOne(querry);
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('toy car is running');
})

app.get('/toy', (req, res) => {
  res.send(toy);
})
app.get('/category', (req, res) => {
  res.send(category);
})
app.listen(port, () => {
  console.log(`toy car is running on prot: ${port}`);
})