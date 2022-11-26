const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Middlewares
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Gamicon server is running");
});

// MongoDB connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.5a1umhj.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const categories = client.db("Gamicon").collection("categories");
    const userCollection = client.db("Gamicon").collection("users");
    const productCollection = client.db("Gamicon").collection("products");
    const bookingCollection = client.db("Gamicon").collection("bookings");

    // Get categories data
    app.get("/categories", async (req, res) => {
      const query = {};
      const result = await categories.find(query).toArray();
      res.send(result);
    });

    // Add user to database
    app.post("/users", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const userExist = await userCollection.findOne(query);
      if (userExist) {
        return;
      }
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    // Get user role
    app.get("/users", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const result = await userCollection.findOne(query);
      res.send(result);
    });

    // Add product data to database
    app.post("/products", async (req, res) => {
      const product = req.body;
      const result = await productCollection.insertOne(product);
      res.send(result);
    });

    // Get a specific user products data
    app.get("/products", async (req, res) => {
      const email = req.query.email;
      const filter = { sellerEmail: email };
      const result = await productCollection.find(filter).toArray();
      res.send(result);
    });

    // delete a product data
    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await productCollection.deleteOne(filter);
      res.send(result);
    });

    //update product advertise status
    app.patch("/products-advertise/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const updatedDoc = {
        $set: { advertised: true },
      };
      const result = await productCollection.updateOne(filter, updatedDoc);
      res.send(result);
    });

    // get all advertised products
    app.get("/advertised-products", async (req, res) => {
      const filter = { advertised: true };
      const result = await productCollection.find(filter).toArray();
      res.send(result);
    });

    // Get specific category data
    app.get("/categories/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { category_id: id };
      const result = await productCollection.find(filter).toArray();
      res.send(result);
    });

    // update product report
    app.patch("/report/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const updatedDoc = {
        $set: { report: true },
      };
      const result = await productCollection.updateOne(filter, updatedDoc);
      res.send(result);
    });

    // get all reported products
    app.get("/reported-items", async (req, res) => {
      const filter = { report: true };
      const result = await productCollection.find(filter).toArray();
      res.send(result);
    });

    // get all seller data
    app.get("/allseller", async (req, res) => {
      const filter = { role: "seller" };
      const result = await userCollection.find(filter).toArray();
      res.send(result);
    });

    // get all buyer data
    app.get("/allbuyer", async (req, res) => {
      const filter = { role: "buyer" };
      const result = await userCollection.find(filter).toArray();
      res.send(result);
    });

    // delete a seller
    app.delete("/user/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await userCollection.deleteOne(filter);
      res.send(result);
    });

    // Add booking data to database
    app.post("/bookings", async (req, res) => {
      const booking = req.body;
      const result = await bookingCollection.insertOne(booking);
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Gamicon server is ruuning on port ${port}`);
});
