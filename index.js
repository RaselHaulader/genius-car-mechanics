const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000;
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const { ObjectID } = require('bson');
//middle wire
app.use(cors());
app.use(express.json());

/* 
user: GeniusCar
pass: taHhnnr4VwZYcKV6
*/

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_USER_PASS}@cluster0.x89oq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("GeniusCar");
        const serviceCollection = database.collection("service");
        console.log('connet to mdb');

        //POST API
        app.post('/service', async (req, res) => {
            const service = req.body;
            console.log('hit the post', service)
            const result = await serviceCollection.insertOne(service);
            res.json(result)
        })


        // GET API
        app.get('/service', async(req,res)=>{

            const query = serviceCollection.find({}) 
            const result = await query.toArray()
            
            res.json(result)
        })

        // GET SINGLE DATA
        app.get('/booking/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result =await serviceCollection.findOne(query);
            res.json(result)
       
        })

        app.delete('/delete/:id', async(req,res)=>{
            const id = req.params.id;
            const query = {_id: ObjectID(id)};
            const result = await serviceCollection.deleteOne(query);
            res.json(result);

            console.log(id)
        })





    }finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('hitted node')
})

app.listen(port, () => {
    console.log("listening port", port)
})