const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const bodyParser = require('body-parser');
const ObjectId = require('mongodb').ObjectId;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// HmcGGssRBKbYOk3N

const uri = "mongodb+srv://mongodb:HmcGGssRBKbYOk3N@cluster0.0fhwmwc.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
    useUnifiedTopology: true,
  }
});

async function run() {
  try {
    await client.connect();
    const db = client.db('mongo');
    const productCollection = db.collection("product");

    app.get('/products', (req, res) => {
      productCollection.find({})
      .toArray( (err, document) => {
        res.send(document)
      })
    })

    app.patch('/update/:id', (req, res) => {
      productCollection.updateOne({_id: ObjectId(req.params.id)},
      {
        $set: {price: req.body.price, quantity: req.body.quantity}
      })
      .then(result => {
        res.send(result.modifiedCount > 0);
      })
    })

    app.get('/product/:id', (req, res) => {
      productCollection.find({_id: ObjectId(req.params.id)})
      .toArray( (err, documents) => {
        res.send(documents[0])
      })
    })

    app.post('/addUser', (req, res) => {
      const product = req.body;
        productCollection.insertOne(product)
        .then( result => {
          console.log('data added successfully');
          res.redirect('/');
        })
    })

    app.delete('/delete/:id', (req, res) => {
      productCollection.deleteOne({_id: ObjectId(req.params.id)})
      .then(result => {
        res.send(result.deletedCount > 0);
      })
    })

  } finally {
    
  }
}
run().catch(console.dir);

      app.get('/', (req, res) => {
        res.sendFile(__dirname + '/index.html')
    });

app.listen(4200, () => {
  console.log('running to server')
});