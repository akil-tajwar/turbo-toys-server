const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
const toy = require('./data/toy.json')
const category = require('./data/category.json')

app.use(cors());
const corsConfig = {
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}
// app.use(cors(corsConfig))
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
    app.get('/toy', (req, res) => {
      res.send(toy);
    })
    app.get('/category', (req, res) => {
      res.send(category);
    })
    app.listen(port, () => {
      console.log(`toy car is running on prot: ${port}`);
    })
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
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

    app.put('/mytoys/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedCoffee = req.body;
      const toy = {
        $set: {
          tname: updatedCoffee.tname,
          sname: updatedCoffee.sname,
          quantity: updatedCoffee.quantity,
          category: updatedCoffee.category,
          price: updatedCoffee.price,
          rating: updatedCoffee.rating,
          description: updatedCoffee.description,
          url: updatedCoffee.url
        }
      }
      const result = await toyCollection.updateOne(filter, toy, options);
      res.send(result);
    })

    app.delete('/mytoys/:id', async (req, res) => {
      const id = req.params.id;
      const querry = { _id: new ObjectId(id) };
      const result = await toyCollection.deleteOne(querry);
      res.send(result);
    })

    app.patch("/cart/addtocart/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: {
          addToCart: true,
        },
      };
      const result = await toyCollection.updateOne(filter, updatedDoc);
      res.send(result);
    });

    app.patch("/cart/undofromcart/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: {
          addToCart: false,
        },
      };
      const result = await toyCollection.updateOne(filter, updatedDoc);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
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

