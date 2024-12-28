const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middlewere

app.use(cors({
  origin:['https://gadget-heaven-bpi.netlify.app','http://localhost:5173'],
  credentials:true
}));

app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_USER}@cluster0.dsq3s3c.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const contestdb = client.db("gadget-heaven");
    const allProductsCollection = contestdb.collection("Products");
    const userCollection = contestdb.collection("user");


    app.post("/api/v1/user", async (req, res) => {
      const user = req.body;
      console.log(user);
      const find = {email:user?.email};
      const IfExist = await userCollection.findOne(find)
      if(IfExist){
        return res.send('Alredy Exist')
      }
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

     app.get('/api/v1/user', async (req,res)=>{
      const result = await userCollection.find().toArray()
      res.send(result);
    })

    app.get("/api/v1/usercount", async (req, res) => {
      const result = await userCollection.estimatedDocumentCount();
      res.send({ result });
      // console.log(result);
    });

     app.get('/api/v1/user/:email', async (req,res)=>{
      const {email} = req.params;
      const filter = {email:email}
      const result = await userCollection.findOne(filter)
      res.send(result);
    })
     app.put('/api/v1/user', async (req,res)=>{
      const {email} = req.query;
      const {role} = req.body;
      const filter = {email:email}
      console.log(email);
      // const options = { upsert: true };
      const update = {
            $set: {
              role:role
            },
          };
      const result = await userCollection.updateOne(filter,update)
      res.send(result);
    })

    app.post("/api/v1/product", async (req, res) => {
      const {contest} = req.body;
      console.log(contest);
      const result = await allProductsCollection.insertOne(contest);
      res.send(result);
    });

    app.get('/api/v1/product/:email', async (req,res)=>{
      const {email} = req.params;
      const filter = {email:email}
      const result = await allProductsCollection.find(filter).toArray()
      res.send(result);
    })

    app.delete("/api/v1/product/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const find = { _id: new ObjectId(id) };
      const result = await allProductsCollection.deleteOne(find);
      res.send(result);
    });


    app.get("/api/v1/productcount", async (req, res) => {
      const result = await allProductsCollection.estimatedDocumentCount();
      res.send({ result });
      // console.log(result);
    });

  
    app.get("/api/v1/product/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const find = { _id: new ObjectId(id) };
      const result = await allProductsCollection.findOne(find);
      res.send(result);
    });
    // payment 
   

    console.log("successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send(`gadget-heaven is Running ${port}`);
});

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
