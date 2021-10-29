const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config()
const app = express();
const cors = require('cors');
const port = 5000; // or process.env.PORI || 3000; 


//MIDDLEWARE
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

      //GET TOURPRODUCTS API===============
      app.get('/tourProducts', async (req,res)=>{
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
  res.send('Hello From my first ever node')
})
 
app.listen(port, () => {
//   console.log(`Example app listening at http://localhost:${port}`)
  console.log('server running at port', port)
})
