const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

require('dotenv').config();
const port = 5000 || process.env.PORT;


app.use(cors());
app.use(express.json());


// const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ccvftfc.mongodb.net/?retryWrites=true&w=majority`
const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fqvwdta.mongodb.net/?retryWrites=true&w=majority`

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri);


async function run() {
    try {
      await client.connect();
      const database = client.db("transportation");
      const busroutesCollection = database.collection("busroute");
      const groupCollection = database.collection("groups");
      const suggestionCollection = database.collection("suggestions");
      const requestCollection = database.collection("request");



    
    //   const contactCollection = database.collection("contact");
      const usersCollection = database.collection("users");
    
  
  
  
      app.get("/users/:email", async (req, res) => {
        const email = req.params.email;
        const query = { email: email };
        const user = await usersCollection.findOne(query);
        let isAdmin = false;
        if (user?.role === "admin") {
          isAdmin = true;
        }
        res.send({ admin: isAdmin });
      });
  
  
      app.post("/users", async (req, res) => {
        const user = req.body;
        const result = await usersCollection.insertOne(user);
        console.log(result);
        res.send(result);
      });
      app.put("/users", async (req, res) => {
        const user = req.body;
        const filter = { email: user.email };
        const options = { upsert: true };
        const updateDoc = { $set: user };
        const result = await usersCollection.updateOne(
          filter,
          updateDoc,
          options
        );
        res.send(result);
      });
  
      app.put("/users/:email", async (req, res) => {
        const email = req.params.email;
        const filter = { email: email };
        const found = await usersCollection.findOne(filter);
        if (!found) {
          res.send({ isRegistered: false });
          return;
        }
        if (found?.role === "admin") {
          res.send({ isAdmin: true });
          return;
        }
        const updateRole = {
          $set: {
            role: "admin",
          },
        };
        const result = await usersCollection.updateOne(filter, updateRole);
        res.send(result);
      });
  
  
  
  
  
      app.post('/addroutes', async (req, res) => {
        const result = await busroutesCollection.insertOne(req.body);
        res.send(result);
        console.log(result);
      });
      app.get('/addroutes', async (req, res) => {
        const result = await busroutesCollection.find({}).toArray();
        res.json(result);
      });
      app.get('/addroutes/:id', async (req, res) => {
        const query = { _id: ObjectId(req.params.id) }
        const products = await busroutesCollection.findOne(query);
        res.send(products);
      });
  
  

      app.post('/groups', async (req, res) => {
        const result = await groupCollection.insertOne(req.body);
        res.send(result);
        console.log(result);
      });
      app.get('/groups', async (req, res) => {
        const result = await groupCollection.find({}).toArray();
        res.json(result);
      });
      app.get('/groups/:id', async (req, res) => {
        const query = { _id: ObjectId(req.params.id) }
        const products = await groupCollection.findOne(query);
        res.send(products);
      });


      app.post('/suggestions', async (req, res) => {
        const result = await suggestionCollection.insertOne(req.body);
        res.send(result);
        console.log(result);
      });
      app.get('/suggestions', async (req, res) => {
        const result = await suggestionCollection.find({}).toArray();
        res.json(result);
      });
      app.get('/suggestions/:id', async (req, res) => {
        const query = { _id: ObjectId(req.params.id) }
        const suggestions = await suggestionCollection.findOne(query);
        res.send(suggestions);
      });


      app.post('/request', async (req, res) => {
        const result = await requestCollection.insertOne(req.body);
        res.send(result);
        console.log(result);
      });
      app.get('/request', async (req, res) => {
        const result = await requestCollection.find({}).toArray();
        res.json(result);
      });
      app.get('/request/:id', async (req, res) => {
        const query = { _id: ObjectId(req.params.id) }
        const request = await requestCollection.findOne(query);
        res.send(request);
      });
      
  
    }
    finally { }
  }
  run().catch(console.dir)
  
  app.get('/', (req, res) => {
    res.send('Hello omar')
  })
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })