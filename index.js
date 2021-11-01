const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId;
const app = express();
const cors = require('cors');

const port = process.env.PORT || 5000;


//MIDDLEWARE ======
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5yjkp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    await client.connect();
    console.log('database connected successfully');
    const database = client.db("tourPlan");
    const tourPlanCollection = database.collection("tourProducts");
    const orderCollection = database.collection('orders')

    app.get('/ordernow/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const tourProducts = await tourPlanCollection.findOne(query);
      // console.log('load user id', id);
      res.json(tourProducts);
    });

    //Get api(orders) detabase to ui ======
      app.get('/orders', async (req, res)=>{
        const cursor = orderCollection.find({});
        const orders = await cursor.toArray();
        res.send(orders);
      });

    //  DELETE API======================
    app.delete('/orders/:id', async (req,res)=>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const result = await orderCollection.deleteOne(query);
      console.log('delete user with id',result );
      res.json(result);
    } );

    // UPDATE ORDERS pt-01==========================
    app.get('/orders/:id', async (req, res)=>{
     const id = req.params.id;
     const query = {_id: ObjectId(id)};
     const order = await orderCollection.findOne(query);
     console.log('load with id', id);
     res.send(order);
    });
  //  Update user and email pt-02===================
  app.put('/orders/:id', async (req, res)=>{
   const id = req.params.id;
   const updatedUser = req.body;
   const filter = {_id:ObjectId(id)};
   const options = {upsert: true};
   const updateDoc = {
     $set:{
       name: updatedUser.name,
       email: updatedUser.email,
     },
   };
   const result = await orderCollection.updateOne(filter, updateDoc,options)
   console.log('updating user', req);
   res.send(result);
  });

    //ADD ORDERS API  ui to database =========================
    app.post('/orders',async (req,res)=>{
     const newOrder = req.body;
     const result = await orderCollection.insertOne(newOrder);
     console.log('got newOrder', req.body);
     res.send(result);
    })

    //GET TOURPRODUCTS API===============
    app.get('/tourProducts', async (req, res) => {
      const cursor = tourPlanCollection.find({});
      const tourProducts = await cursor.toArray();
      res.send(tourProducts);
    })



    //   const result = await haiku.insertOne(doc);
    //   console.log(`A document was inserted with the _id: ${result.insertedId}`);
  } finally {
    //   await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello sun tours india node')
})

app.listen(port, () => {
  //   console.log(`Example app listening at http://localhost:${port}`)
  console.log('server running at port', port)
})
