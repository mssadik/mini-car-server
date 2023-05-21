const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;


//meddelware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mhsnbkd.mongodb.net/?retryWrites=true&w=majority`;

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
    // await client.connect();

    const carCollection = client.db('miniCarDB').collection('miniCar');
    const categoryCollection = client.db('categoryDB').collection('category');

    app.get('/category', async (req, res) => {
      const result = await categoryCollection.find().toArray();
      res.send(result)
    })

    app.get('/cars', async (req, res) => {
      const result = await carCollection.find().toArray();
      res.send(result);
    })

    app.get('/cars/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const options = {
        projection: { decription: 1, photo: 1, price: 1, quantity: 1, rating: 1, sellerEmail: 1, sellerName: 1, subCategory: 1, toyName: 1 }
      };
      const result = await carCollection.findOne(query, options);
      res.send(result)
    })

    //get api for update
    app.get('/cars/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await carCollection.findOne(query);
      res.send(result);
    })

    app.get('/carss', async (req, res) => {
      let query = {};
      if (req.query?.sellerEmail) {
        query = { sellerEmail: req.query.sellerEmail }
      }
      const result = await carCollection.find(query).toArray();
      res.send(result);
    })

    //for sorting
    app.get('/carss', async (req, res) => {
      const sortParam = req.query.sort || 'asc'; // Default sorting order is ascending
    
      let sortOptions = {};
      if (sortParam === 'asc') {
        sortOptions = { price: 1 }; // Sort in ascending order by price
      } else if (sortParam === 'desc') {
        sortOptions = { price: -1 }; // Sort in descending order by price
      }
    
      const result = await carCollection.find().sort(sortOptions).toArray();
      res.send(result);
    });
    

    app.post('/carss', async (req, res) => {
      const car = req.body;
      console.log(car);
      const result = await carCollection.insertOne(car)
      res.send(result);
    })

    app.put('/cars/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedCar = req.body;
      const car = {
        $set: {
          photo: updatedCar.photo,
          toyName: updatedCar.toyName,
          sellerName: updatedCar.sellerName,
          subCategory: updatedCar.subCategory,
          rating: updatedCar.rating,
          quantity: updatedCar.quantity,
          decription: updatedCar.decription,
          price: updatedCar.price
        }
      }
      const result = await carCollection.updateOne(filter, car, options);
      res.send(result);
    })

    app.delete('/cars/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await carCollection.deleteOne(query);
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
  res.send('this server is runnint')
})

app.listen(port, () => {
  console.log(`Mini car  is running on port: ${port}`)
})