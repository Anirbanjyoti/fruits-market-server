const express = require("express");
const cors = require("cors");
// const jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Verify JWToken
// function verifyJWT(req, res, next){
//         // sending token
//         const authHeader = req.headers.authorization;
//         if(!authHeader){
//           return res.status(401).send({message: 'Unauthorized Access'});
//         }
//         const token = authHeader.split(' ')[1];
//         jwt.verify(token, process.env.ACCESS_TOKEN_SECRETE, (err, decoded)=>{
//             if(err){
//               return res.status(403).send({message: 'Forbidden access'})
//              }
//              console.log(`decoded`, decoded);
//              req.decoded = decoded;             
//         }) 
//         console.log('iNSIDE verifyJWT', authHeader);
//         next(); 
// }
// Database connection

// DB_USER=fruits
// DB_PASS=Mfv1ZCD9sBDUFkcV
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xqdnv85.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


//
async function run() {
  try {
    await client.connect();
    const vegCollection = client.db("fruitsDB").collection("veg-product");

    // login token API
    // app.post("/login", async (req, res) => {
    //   const user = req.body;
    //   const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRETE, {
    //     expiresIn: "1d",
    //   });
    //   res.send({ accessToken });
    // });
    //  create API to get Multiple data
    app.get("/fruits", async (req, res) => {
      const query = {};
      const cursor = vegCollection.find(query);
      const products = await cursor.toArray();
      res.send(products);
    });
    //  create API to get single data
    app.get("/fruits/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const product = await vegCollection.findOne(query);
      res.send(product);
    });

    // Post API-- to create / add Fruit to all Fruits
    app.post("/fruits", async (req, res) => {
      const newFruit = req.body;
      const result = await vegCollection.insertOne(newFruit);
      res.send(result);
    });
    // get all Orders
    // app.get("/orders", verifyJWT,  async (req, res) => {
    //   //  je shdhu mstro login korsa ache tar info onujayi tar ordergulo dekhabe.
    //   const decodedEmail = req.decoded.email;
    //   const email = req.query.email;
    //   console.log(email);

    //   if(email===decodedEmail){
    //     const query = { email: email };
    //     const cursor = orderCollection.find(query);
    //     const orders = await cursor.toArray();
    //     res.send(orders);
    //   }
    //   else{
    //     res.status(403).send({message: 'Forbidden Access'});
    //   }
    // });
    // Post API-- to create / add Order to all VegCollection
    // app.post("/order", async (req, res) => {
    //   const newOrder = req.body;
    //   const result = await orderCollection.insertOne(newOrder);
    //   res.send(result);
    // });

    // Post API-- to Delete Fruit
    app.delete("/fruits/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await vegCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);
// api declare
app.get("/", (req, res) => {
  res.send("Running Genius Car Server");
});
// api Heroku check
app.get("/hero", (req, res) => {
  res.send("Running Genius Car Server on Heroku");
});

// Listening port
app.listen(port, () => {
  console.log(`Listening to port`, port);
});
