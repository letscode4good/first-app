
const express = require('express')
const app = express()

const port = process.env.PORT || 80
app.use(express.static('public'))
app.use(express.urlencoded({
    extended: true
  }))


var bodyParser = require('body-parser')
        app.use(bodyParser.urlencoded({ extended: true }))
        app.use(bodyParser.json())

const cookieParser = require("cookie-parser");
const sessions = require('express-session');
app.use(cookieParser());

var session;
app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: 1000 * 60 * 60 * 2},
    resave: false 
}));

//for downloading images from google cloud to send emails
const download = require('image-downloader')

const Multer = require('multer');
  
  const multer = Multer({
    storage: Multer.MemoryStorage,
    limits: {
      fileSize: 20 * 1024 * 1024, // Maximum file size is 10MB
    },
  });

var mongoose = require('mongoose');

mongoose.connect('mongodb+srv://dbadmin:dbpassword@cluster0-v6hog.mongodb.net/hostel?retryWrites=true', {useNewUrlParser: true});


var dailyExpenseSchema = new mongoose.Schema({
    itemName : String,
    quantity : Number,
    cost : String
    dateOfExpense : Date,
});


var itemNameSchema = new mongoose.Schema({
    itemName : String
});


var dailyExpenseSchemaObject = mongoose.model('dailyExpense', dailyExpenseSchema,'dailyExpense');

var itemNameSchemaObject = mongoose.model('itemName', itemNameSchema,'itemName');

app.post('/adddailyExpense', function(req, res){
    var newDBEntry = new dailyExpenseSchemaObject({'itemName': req.body.itemName , 'quantity': req.body.quantity , 'cost':req.body.cost, 'dateOfExpense':req.body.dateOfExpense }) 

    newDBEntry.save(function(err, savedUser){
        if(err)
        {
            res.json({ error: err.message || err.toString() });
        }
        else
            res.json({message : 'successs'})
    });
})


app.get('/getItemNames',function(req, res) {
    itemNameSchema.find({}, function (err, docs) {
        if(err) return next(err);
        res.send(docs);
      });
  })


app.get('/',(req,res) => {
    res.sendFile(__dirname+'/index.html')
})



app.get('/index.html',(req,res) => {
   
    res.sendFile(__dirname+'/index.html')

})


app.listen(port, () => console.log(`Example app listening on port ${port}!`))
