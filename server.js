
const express = require('express')
const app = express()
const port = process.env.PORT || 80
app.use(express.static('public'))

var bodyParser = require('body-parser')
        app.use(bodyParser.urlencoded({ extended: false }))
        app.use(bodyParser.json())

        app.post('/login', function(req, res){
            // if username = admin, password = admin
            if(req.body.username == "admin" && req.body.password == "admin")
                res.json({'message' : 'success'});
            else
                res.json({'message': 'failure'});
        })

var mongoose = require('mongoose');

mongoose.connect('mongodb+srv://dbadmin:dbpassword@cluster0-v6hog.mongodb.net/test?retryWrites=true', {useNewUrlParser: true});

var userDetailsSchema = new mongoose.Schema({
    fName: String,
    lName : String,
    userId : String,
    emailId : String,
    phoneNumber : Number
});


var userLoginSchema = new mongoose.Schema({
    userId : String,
    password : String,
    userType : String
});


var stockDetailsSchema = new mongoose.Schema({
    itemName : String,
    quantity : Number,
    itemCode : String
});

var userDetailsSchemaObject = mongoose.model('UserDetails', userDetailsSchema,'UserDetails');

var userLoginSchemaObject = mongoose.model('UserLogin', userLoginSchema,'UserLogin');

var stockDetailsSchemaObject = mongoose.model('StockDetails', stockDetailsSchema,'StockDetails');

app.post('/addUserDetail', function(req, res){
    var newDBEntry = new userDetailsSchemaObject({'fName' : req.body.fName, 'lName': req.body.lName, 'userId': req.body.userId , 'emailId': req.body.emailId, 'phoneNumber': req.body.phoneNumber}) 
    
    newDBEntry.save(function(err, savedUser){
        if(err)
            res.json({message : 'failures'})
        else
            res.json({message : 'successs'})
    });
})

app.post('/addUserLogin', function(req, res){
    var newDBEntry = new userLoginSchemaObject({'userId': req.body.userId , 'password': req.body.password , 'userType':req.body.userType}) 
    
    newDBEntry.save(function(err, savedUser){
        if(err)
            res.json({message : 'failures'})
        else
            res.json({message : 'successs'})
    });
})

app.post('/addStockDetail', function(req, res){
    stockDetailsSchemaObject.findOne({itemCode: req.body.itemName}, function (err, docs) {
        if (err){
            console.log(err)
        }
        else{
            console.log("Result : ", docs);
            var newQuantity = docs.quantity +  req.body.quantity
            const update = { quantity: newQuantity};
            stockDetailsSchemaObject.findOneAndUpdate({ itemCode: req.body.itemName}, update, function(
                err,
                result
              ) {
                if (err) {
                  res.send(err);
                } else {
                  res.send(result);
                }
              });
        }
    });
})


app.get("/getStockItems",function(req, res) {
    stockDetailsSchemaObject.find({}, function (err, docs) {
        if(err) return next(err);
        res.send(docs);
      });
  })


app.get('/', (req, res) => res.sendfile(__dirname+'/index.html'))
app.get('/accounts.html', (req, res) => res.sendfile(__dirname+'/accounts.html'))
app.get('/add-product.html', (req, res) => res.sendfile(__dirname+'/add-product.html'))
app.get('/edit-product.html', (req, res) => res.sendfile(__dirname+'/edit-product.html'))
app.get('/login.html', (req, res) => res.sendfile(__dirname+'/login.html'))
app.get('/products.html', (req, res) => res.sendfile(__dirname+'/products.html'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
