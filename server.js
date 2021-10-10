
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
    cookie: { maxAge: 1000 * 60 * 60 * 24},
    resave: false 
}));

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


var customerDetailsSchema = new mongoose.Schema({
    customerName : String,
    address : String,
    email : String,
    officialphone : String,
    contactperson : String,
    contactpersonphone : String
});

var stockDetailsSchema = new mongoose.Schema({
    itemName : String,
    quantity : Number,
    itemCode : String
});

var userDetailsSchemaObject = mongoose.model('UserDetails', userDetailsSchema,'UserDetails');

var userLoginSchemaObject = mongoose.model('UserLogin', userLoginSchema,'UserLogin');

var customerDetailsSchemaObject = mongoose.model('Customer_Info', customerDetailsSchema,'Customer_Info');

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
    stockDetailsSchemaObject.findOneAndUpdate({itemCode: req.body.itemName},{$inc:{ quantity: req.body.quantity}}, function (err, docs) {
        if (err){
            //console.log(err)
            res.send('failure');
        }
        else{
            //console.log("Result : ", docs);
            res.send(docs);   
        }
    });
})


app.post('/addCustomerDetail', function(req, res){
    var newDBEntry = new customerDetailsSchemaObject({'customerName': req.body.custName , 'address': req.body.custAddress , 'email':req.body.custEmail, 'officialphone':req.body.custOfficialPhone, 'contactperson':req.body.contactPersonName, 'contactpersonphone':req.body.contactPersonPhone     }) 
    
    newDBEntry.save(function(err, savedUser){
        if(err)
        {
            //res.json({message : 'failures'})
            // find error in api
            res.json({ error: err.message || err.toString() });
        }
        else
            res.json({message : 'successs'})
    });
})


app.get("/getCustomerDetails",function(req, res) {
    customerDetailsSchemaObject.find({}, function (err, docs) {
        if(err) return next(err);
        res.send(docs);
      });
  })

app.get("/getStockItems",function(req, res) {
    stockDetailsSchemaObject.find({}, function (err, docs) {
        if(err) return next(err);
        res.send(docs);
      });
  })

app.post('/addNewStock', function(req, res){
    var newDBEntry = new stockDetailsSchemaObject({'itemName' : req.body.itemName, 'quantity': req.body.quantity, 'itemCode': req.body.itemCode}) 
    newDBEntry.save(function(err, savedUser){
        if(err)
            res.json({message : 'failures'})
        else
            res.json({message : 'successs'})
    });
})


//app.get('/', (req, res) => res.sendfile(__dirname+'/index.html'))

app.get('/',(req,res) => {
    session=req.session;
    if(session.userId && (session.userType == 'admin')){
        res.send('Welcome User')
    }
    else
        res.sendFile(__dirname+'/login.html')
})


app.get('/accounts.html', (req, res) => res.sendfile(__dirname+'/accounts.html'))
app.get('/add-product.html', (req, res) => res.sendfile(__dirname+'/add-product.html'))
app.get('/edit-product.html', (req, res) => res.sendfile(__dirname+'/edit-product.html'))

app.get('/add-customer-info.html', (req, res) => res.sendfile(__dirname+'/add-customer-info.html'))
app.get('/view-customer-info.html', (req, res) => res.sendfile(__dirname+'/view-customer-info.html'))
app.get('/index.html', (req, res) => res.sendfile(__dirname+'/index.html'))


app.get('/login.html', (req, res) => res.sendfile(__dirname+'/login.html'))
app.get('/products.html', (req, res) => res.sendfile(__dirname+'/products.html'))


app.post('/login', function(req, res){
    userLoginSchemaObject.findOne({ userId: req.body.userId , password: req.body.password, userType: req.body.userType}, function (err, docs) {
        if (err){
            //console.log(err)
            res.send(err);
        }
        else{
            //console.log("Result : ", docs);
            if (docs == null) {
                res.send('Login not found');
            }
            else
            {
                session=req.session;
                session.userId=req.body.userId;
                session.userType=req.body.userType;
                console.log(req.session)
                res.send('Hey there, welcome');
            }
            //res.send(docs);
        }
    });
})

app.get('/logout',(req,res) => {
    req.session.destroy()
    res.session = null
    res.redirect('/')
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`))
