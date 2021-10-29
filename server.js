
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
    userType : String,
    userName : String
});


var customerDetailsSchema = new mongoose.Schema({
    customerName : String,
    custId : String,
    address : String,
    email : String,
    officialphone : String,
    contactperson : String,
    contactpersonphone : String
});


var customerInventorySchema = new mongoose.Schema({
    customerName : String,
    custId : String,
    installDate : String,
    upsName : String,
    upsCapacity : String,
    batteryName : String,
    batteryCapacity : String,
    numOfBattery : String,
    stabilizer : String
});

var preventiveMaintenanceHistorySchema = new mongoose.Schema({
    customerName : String,
    custId : String,
    maintenanceType : String,
    dateWhenDone : String,
    engineer : String,
    maintenanceID : String
});



var upcomingMaintenanceSchema = new mongoose.Schema({
    customerName : String,
    custId : String,
    maintenanceType : String,
    dateWhenScheduled : String,
    engineer : String,
    maintenanceID : String
});


var stockDetailsSchema = new mongoose.Schema({
    itemName : String,
    quantity : Number,
    itemCode : String
});

var statusDetailsSchema = new mongoose.Schema({
    date : String,
    name : String,
    status : String
});

var userDetailsSchemaObject = mongoose.model('UserDetails', userDetailsSchema,'UserDetails');

var userLoginSchemaObject = mongoose.model('UserLogin', userLoginSchema,'UserLogin');

var customerDetailsSchemaObject = mongoose.model('Customer_Info', customerDetailsSchema,'Customer_Info');

var customerInventorySchemaObject = mongoose.model('Customer_Inventory', customerInventorySchema,'Customer_Inventory');

var preventiveMaintenanceHistorySchemaObject = mongoose.model('PM_History', preventiveMaintenanceHistorySchema,'PM_History');

var upcomingMaintenanceSchemaObject = mongoose.model('Upcoming_PM', upcomingMaintenanceSchema,'Upcoming_PM');

var stockDetailsSchemaObject = mongoose.model('StockDetails', stockDetailsSchema,'StockDetails');
var statusDetailsSchemaObject = mongoose.model('StatusDetails', statusDetailsSchema,'StatusDetails');


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
    var newDBEntry = new userLoginSchemaObject({'userId': req.body.userId , 'password': req.body.password , 'userType':req.body.userType, 'userName':req.body.userName}) 
    
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

app.post('/addStatusDetail', function(req, res){
    var newDBEntry = new statusDetailsSchemaObject({'date': req.body.date , 'name': req.body.name , 'status':req.body.status}) 
    
    newDBEntry.save(function(err, savedUser){
        if(err)
            res.json({message : 'failures'})
        else
            res.json({message : 'successs'})
    });
})

app.post('/addCustomerDetail', function(req, res){
    var newDBEntry = new customerDetailsSchemaObject({'customerName': req.body.custName , 'custId' : req.body.custId, 'address': req.body.custAddress , 'email':req.body.custEmail, 'officialphone':req.body.custOfficialPhone, 'contactperson':req.body.contactPersonName, 'contactpersonphone':req.body.contactPersonPhone     }) 
    
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

app.post('/addCustomerInventory', function(req, res){
    var newDBEntry = new customerInventorySchemaObject({'customerName': req.body.customerName , 'custId': req.body.custId , 'installDate':req.body.installDate, 'upsName':req.body.upsName, 'upsCapacity':req.body.upsCapacity, 'batteryName':req.body.batteryName , 'batteryCapacity':req.body.batteryCapacity, 'numOfBattery':req.body.numOfBattery , 'stabilizer':req.body.stabilizer }) 
    newDBEntry.save(function(err, savedUser){
        if(err)
        {
            res.json({ error: err.message || err.toString() });
        }
        else
            res.json({message : 'successs'})
    });
})


app.post('/addPMHistory', function(req, res){
    var newDBEntry = new preventiveMaintenanceHistorySchemaObject({'customerName': req.body.customerName , 'custId': req.body.custId , 'maintenanceType':req.body.maintenanceType, 'dateWhenDone': req.body.dateWhenDone, 'engineer':req.body.engineer, 'maintenanceID':req.body.maintenanceID}) 
    newDBEntry.save(function(err, savedUser){
        if(err)
        {
            res.json({ error: err.message || err.toString() });
        }
        else
            res.json({message : 'successs'})
    });
})

app.post('/addupcomingPM', function(req, res){
    var newDBEntry = new upcomingMaintenanceSchemaObject({'customerName': req.body.customerName , 'custId': req.body.custId , 'maintenanceType':req.body.maintenanceType, 'dateWhenScheduled': req.body.dateWhenScheduled, 'engineer':req.body.engineer, 'maintenanceID':req.body.maintenanceID}) 
    newDBEntry.save(function(err, savedUser){
        if(err)
        {
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


  app.get("/getCustomerInventory",function(req, res) {
      customerInventorySchemaObject.findOne({ custId: req.query.custId}, function (err, docs) {
        if (err){
            res.send(err);
        }
        else{
            //console.log("Result : ", docs);
            if (docs == null) {
                res.send('Customer Inventory not found.');
            }
            else
            {
                res.send(docs)
            }
        }
    });
  })

  app.get("/getPMHistory",function(req, res) {
    preventiveMaintenanceHistorySchemaObject.findOne({ custId: req.query.custId}, function (err, docs) {
      if (err){
          res.send(err);
      }
      else{
          //console.log("Result : ", docs);
          if (docs == null) {
              res.send('Preventive maintenance history not found.');
          }
          else
          {
              res.send(docs)
          }
      }
  });
})

app.get("/getUpcomingPMForCust",function(req, res) {
    upcomingMaintenanceSchemaObject.findOne({ custId: req.query.custId}, function (err, docs) {
      if (err){
          res.send(err);
      }
      else{
          //console.log("Result : ", docs);
          if (docs == null) {
              res.send('Upcoming maintenance record not found.');
          }
          else
          {
              res.send(docs)
          }
      }
  });
})

app.get("/getAllUpcomingPM",function(req, res) {
    upcomingMaintenanceSchemaObject.find({}, function (err, docs) {
        if(err) return next(err);
        if (docs == null) {
            res.send('Upcoming maintenance record not found.');
        }
        res.send(docs);
      });
})


app.get("/getAllUpcomingPlannedPM",function(req, res) {
    upcomingMaintenanceSchemaObject.find({ maintenanceType: 'Planned'}, function (err, docs) {
        if(err) return next(err);
        if (docs == null) {
            res.send('Upcoming planned maintenance record not found.');
        }
        res.send(docs);
      });
})

app.get("/getAllUpcomingCustPM",function(req, res) {
    upcomingMaintenanceSchemaObject.find({ maintenanceType: 'Customer'}, function (err, docs) {
        if(err) return next(err);
        if (docs == null) {
            res.send('Upcoming customer requested maintenance record not found.');
        }
        res.send(docs);
      });
})



app.get("/getStockItems",function(req, res) {
    stockDetailsSchemaObject.find({}, function (err, docs) {
        if(err) return next(err);
        res.send(docs);
      });
  })


app.get("/getStatusDetail",function(req, res) {
    statusDetailsSchemaObject.find({}, function (err, docs) {
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
        res.sendFile(__dirname+'/index.html')
    }
    else if(session.userId && (session.userType == 'engineer')){
        res.sendFile(__dirname+'/accounts.html')
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


app.get('/upcomingCustomerPM.html', (req, res) => res.sendfile(__dirname+'/upcomingCustomerPM.html'))
app.get('/upcomingPlannedPM.html', (req, res) => res.sendfile(__dirname+'/upcomingPlannedPM.html'))
app.get('/allupcomingPM.html', (req, res) => res.sendfile(__dirname+'/allupcomingPM.html'))
app.get('/addCustomerRequestPM.html', (req, res) => res.sendfile(__dirname+'/addCustomerRequestPM.html'))
app.get('/addDailyStatus.html', (req, res) => res.sendfile(__dirname+'/addDailyStatus.html'))





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
                session.userName = docs.userName;
                //res.sendFile(__dirname+'/index.html')
                console.log(session.userName)
                res.redirect('/index.html')
            }
            //res.send(docs);
        }
    });
})

app.get('/logout',(req,res) => {
    req.session.destroy()
    res.redirect('/')
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`))
