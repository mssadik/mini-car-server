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
    await client.connect();

    const carCollection = client.db('miniCarDB').collection('miniCar');

    app.get('/cars', async(req, res) =>{
      const result = await carCollection.find().toArray();
      res.send(result);
    })

    app.get('/cars/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const options = {
        projection: {decription:1, photo:1, price:1, quantity:1, rating:1, sellerEmail:1, sellerName:1, subCategory:1, toyName:1}
      };
      const result = await carCollection.findOne(query, options);
      res.send(result)
    })

    app.post('/cars', async(req, res) =>{
      const car = req.body;
      console.log(car);
      const result = await carCollection.insertOne(car)
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


app.get('/', (req, res)=>{
    res.send('this server is runnint')
})

app.listen(port, () =>{
    console.log(`Mini car  is running on port: ${port}`)
})