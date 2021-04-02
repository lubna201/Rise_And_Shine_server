const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config();

const port = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9kigp.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const eventCollection = client.db("riseAndShineGrocery").collection("products");
  const orderCollection = client.db("riseAndShineGrocery").collection("order");
  console.log("database connected");
  app.get('/products', (req, res) => {
    eventCollection.find()
      .toArray((err, items) => {
        res.send(items)
      })
  })


  app.get('/products/:id', (req, res) => {
    eventCollection.find({id: req.params._id})
      .toArray((err, items) => {
        res.send(items)
      })
  })

  app.post('/checkout',(req,res)=>{
    const newBooking=req.body;
    orderCollection.insertOne(newBooking)
    .then(result=>{
        console.log(result);
        res.send(result.insertedCount>0);
    })
    console.log(newBooking);
})

app.get('/lastCheckout',(req, res)=>{
  console.log(req.query.email);
  orderCollection.find({email:req.query.email})
  .toArray((err,documents)=>{
    res.send(documents);
  })
})

  app.post('/addProducts', (req, res) => {
    const newEvent = req.body;
    console.log('adding new event', newEvent);
    eventCollection.insertOne(newEvent)
      .then(result => {
        console.log('inserted count', result.insertedCount);
        res.send(result.insertedCount > 0);
      })

  })
  app.delete('/deleteProduct/:id', (req, res) => {
    const id = ObjectID(req.params.id);
    console.log('delete this', id);
    eventCollection.findOneAndDelete({_id: id})
    .then(documents => res.send(!!documents.value))
})
});


app.listen(port)