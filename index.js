const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express()
const port = 5000

app.use(cors());
app.use(express.json());


// mongo db code

const uri = "mongodb+srv://first-sever:first-server@cluster0.5432c9q.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
    await client.connect();
    const myFirstDB = client.db("myFirstDB");
    const userDB = client.db("userDB");
    const productCollection = myFirstDB.collection("productCollection");
    const userCollection = myFirstDB.collection("userCollection");

    // Create singel data 
    app.post("/products", async(req, res) => {
      const productData = req.body;
      const result = await productCollection.insertOne(productData);
      res.send(result);
      console.log("data added")
    })
    // Read all data
    app.get("/products", async(req, res) => {
      const productData = productCollection.find();
      const result = await productData.toArray();
      res.send(result);
    })
    // Read single data
    app.get("/products/:id", async(req, res) => {
      const id = req.params.id;
      const productData =await productCollection.findOne({_id: new ObjectId(id)});
      res.send(productData);
    })
    // update single data
    app.patch("/products/:id", async(req, res) => {
      const id = req.params.id;
      const updatedData = req.body;
      const productData =await productCollection.updateOne({_id: new ObjectId(id)}, {$set: updatedData});
      res.send(productData);
    })
    // delete single data
    app.delete("/products/:id", async(req, res) => {
      const id = req.params.id;
      const productData =await productCollection.deleteOne({_id: new ObjectId(id)});
      res.send(productData);
    })

    //USER RELATED API

    app.post("/user", async(req, res) => {
      const user = req.body;
      const isUserExit = await userCollection.findOne({email: user?.email});
      if(isUserExit?._id){
        res.send("Login Success")
      }
      const result = await userCollection.insertOne(user);
      res.send(result)
    })


  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.log);

// mongo db code

app.get('/', (req, res) => {
  res.send('Hello World!')
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})



// mongo db user and password
// user: first-server
// password: first-server