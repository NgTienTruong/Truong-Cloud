const express = require('express')
const hbs = require('hbs')
const app = express();
app.set('view engine','hbs');
hbs.registerPartials(__dirname +'/views/partials')

var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb+srv://truongnt:truong2000@cluster0.zpm7r.mongodb.net/test';
app.use(express.static(__dirname + 'public'))

app.get('/',async (req,res)=>{
    let client= await MongoClient.connect(url);  
    let dbo = client.db("ToyStore");  
    let results = await dbo.collection("Toy").find({}).toArray();
    res.render('home',{model:results})
})
app.get('/insert',(req,res)=>{
    res.render('addToy');
})

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/doInsert',async (req,res)=>{
    let nameInput = req.body.txtName;
    let priceInput = req.body.txtPrice;
    let originInput = req.body.txtOrigin;
    let client= await MongoClient.connect(url);  
    let dbo = client.db("ToyStore"); 
    let addToy = {name : nameInput, price:priceInput,origin: originInput};
    await dbo.collection("Toy").insertOne(addToy);
   
    res.redirect('/');
})

app.get('/search',(req,res)=>{
    res.render('search')
})
app.post('/doSearch',async (req,res)=>{
    let nameInput = req.body.txtName;
    let client= await MongoClient.connect(url);  
    let dbo = client.db("ToyStore");  
    let results = await dbo.collection("Toy").find({name:nameInput}).toArray();
    res.render('home',{model:results})
})

app.get('/delete', async (req,res)=>{
    let id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;
    let condition = {"_id" : ObjectID(id)};

    let client= await MongoClient.connect(url);
    let dbo = client.db("ToyStore");
    await dbo.collection('Toy').deleteOne(condition)
    res.redirect('/');
})
app.get('/Edit',async (req,res)=>{
    let id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;
    let client= await MongoClient.connect(url);
    let dbo = client.db("ToyStore");
    let results = await dbo.collection("Toy").findOne({_id : ObjectID(id)});
    res.render('updateToy',{model:results});
})
app.post('/doEdit',async (req,res)=>{
    let id= req.body.id;
    let nameInput = req.body.txtName;
    let priceInput = req.body.txtPrice;
    let originInput = req.body.txtOrigin;
    let newValues ={$set : {name: nameInput,price:priceInput,origin:originInput}};
    var ObjectID = require('mongodb').ObjectID;
    let condition = {"_id" : ObjectID(id)};
    
    let client= await MongoClient.connect(url);
    let dbo = client.db("ToyStore");
    await dbo.collection("Toy").updateOne(condition,newValues);
    res.redirect('/');
})

var PORT = process.env.PORT || 3000
app.listen(PORT)
console.log("Server is running!")