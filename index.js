const express = require('express');
const app = express();
const port =process.env.PORT || 5055;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;
app.use(cors());
app.use(bodyParser.json());


const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.esvfp.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const pithaCollection = client.db(`${process.env.DB_NAME}`).collection("pitha");
  const pithaUserCollection = client.db(`${process.env.DB_NAME}`).collection("order");
  console.log("db connect done")
  
  app.get('/pithas', (req, res) => {
    pithaCollection.find()
    .toArray((err, items) => {
        res.send(items)
    })    
})

app.get('/pithaAllUser', (req, res) => {
  pithaUserCollection.find()
  .toArray((err, items) => {
      res.send(items)
  })    
})

app.get('/pithaUser', (req, res) => {
  console.log(req.query.email)
  pithaUserCollection.find({email: req.query.email})
  .toArray((err, items) => {
    console.log(items)
    res.redirect('/pithaUser')
    res.send(items)
  })    
})


app.post('/addPithas', (req, res) => {
  const newEvent = req.body;
  console.log('adding new event: ', newEvent)
  pithaCollection.insertOne(newEvent)
  .then(result => {
      console.log('inserted count', result.insertedCount);
      res.send(result.insertedCount > 0)
  })
})

app.post('/addProductWithUser', (req, res) => {
  const newEvent = req.body;
  console.log('adding new event: ', newEvent)
  pithaUserCollection.insertOne(newEvent)
  .then(result => {
      console.log('inserted count', result.insertedCount);
      res.send(result.insertedCount > 0)
  })
})

app.delete('/delete/:id', (req, res) => {
  const id = (req.params.id);
  console.log('delete this', id);
  pithaUserCollection.deleteOne({_id: id})
  .then(documents => console.log(documents))
})


});




app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})