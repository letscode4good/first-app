
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
    userName : String,
    phone : String,
    email : String
});


var customerDetailsSchema = new mongoose.Schema({
    customerName : String,
    customerType : String,
    custId : String,
    address : String,
    email : String,
    officialphone : String,
    contactperson : String,
    contactpersonphone : String,
    upsName: String,
    upsCapacity: String

});


var customerInventorySchema = new mongoose.Schema({
    customerName : String,
    customerType : String,
    custId : String,
    installDate : String,
    upsName : String,
    upsCapacity : String,
    numOfUps: String,
    batteryName : String,
    batteryCapacity : String,
    numOfBattery : String,
    stabilizerName : String,
    numOfStabilizer : String,
    solarPanelName : String,
    numOfSolarPanel : String,
    inverterName : String,
    numOfInverter : String,
    inverterCapacity: String,
    solarRetrofitName: String,
    numOfSolarRetrofit: String
});

var preventiveMaintenanceHistorySchema = new mongoose.Schema({
    customerName : String,
    custId : String,
    maintenanceType : String,
    dateWhenDone : String,
    engineer : String,
    maintenanceID : String,
    advanceAmount : Number,
    transportExpense : Number,
    travelExpense : Number,
    MiscellaneousExpense : Number,
    dueAmount : Number,
    returnAmount : Number,
    customerType : String,
    address : String,
    upsName: String,
    upsCapacity: String,
    description: String
});



var upcomingMaintenanceSchema = new mongoose.Schema({
    customerName : String,
    custId : String,
    maintenanceType : String,
    dateWhenScheduled : String,
    engineer : String,
    maintenanceID : String,
    customerType : String,
    address : String,
    upsName: String,
    upsCapacity: String,
    description: String
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

var pmImagesSchema = new mongoose.Schema({
    maintenanceID : String,
    serviceReport : String,
    imageLink : String
});

var countersSchema = new mongoose.Schema({
    customerCount : Number,
    maintenanceCount : Number,
    searchId : String
});

var userDetailsSchemaObject = mongoose.model('UserDetails', userDetailsSchema,'UserDetails');

var userLoginSchemaObject = mongoose.model('UserLogin', userLoginSchema,'UserLogin');

var customerDetailsSchemaObject = mongoose.model('Customer_Info', customerDetailsSchema,'Customer_Info');

var customerInventorySchemaObject = mongoose.model('Customer_Inventory', customerInventorySchema,'Customer_Inventory');

var preventiveMaintenanceHistorySchemaObject = mongoose.model('PM_History', preventiveMaintenanceHistorySchema,'PM_History');

var upcomingMaintenanceSchemaObject = mongoose.model('Upcoming_PM', upcomingMaintenanceSchema,'Upcoming_PM');

var stockDetailsSchemaObject = mongoose.model('StockDetails', stockDetailsSchema,'StockDetails');
var statusDetailsSchemaObject = mongoose.model('StatusDetails', statusDetailsSchema,'StatusDetails');

var pmImagesSchemaObject = mongoose.model('PM_Images', pmImagesSchema,'PM_Images');

var countersSchemaObject = mongoose.model('Counters', countersSchema,'Counters');

// By default, the client will authenticate using the service account file
// specified by the GOOGLE_APPLICATION_CREDENTIALS environment variable and use
// the project specified by the GOOGLE_CLOUD_PROJECT environment variable. See
// https://github.com/GoogleCloudPlatform/google-cloud-node/blob/master/docs/authentication.md
// These environment variables are set automatically on Google App Engine
const {format} = require('util');
const {Storage} = require('@google-cloud/storage');
// Instantiate a storage client
const storage = new Storage(
    {
        projectId: process.env.GOOGLE_CLOUD_PROJECT,
        keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      }
);
const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET);


// Process the file upload and upload to Google Cloud Storage.
app.post('/delfilefromgcloud', function(req, res){
    const file = bucket.file(req.body.filename);
    file.delete(function(err, apiResponse) {
        if(err)
        {
            res.send(err)
        }
        else
        {
            res.send(apiResponse)
        }
    });
})


// Process the file upload and upload to Google Cloud Storage.
app.post('/upload', multer.single('file'), (req, res, next) => {
    if (!req.file) {
      res.status(400).send('No file uploaded.');
      return;

    }
  
    // Create a new blob in the bucket and upload the file data.
    const randomNumber = Math.floor(Math.random() * Math.floor(9999999));
    const fileName = randomNumber + "_" + req.file.originalname;
    const blob = bucket.file(fileName);
    const blobStream = blob.createWriteStream();
    
  
    blobStream.on('error', err => {
      next(err);
    });
  
    blobStream.on('finish', () => {
      // The public URL can be used to directly access the file via HTTP.
      const publicUrl = format(
        `https://storage.googleapis.com/${bucket.name}/${fileName}`
      );
      res.status(200).send(publicUrl);
    });
  
    blobStream.end(req.file.buffer);
  });

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
    var newDBEntry = new userLoginSchemaObject({'userId': req.body.userId , 'password': req.body.password , 'userType':req.body.userType, 'userName':req.body.userName, 'phone':req.body.phone, 'email':req.body.email}) 
    
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
    session = req.session;
    var newDBEntry = new statusDetailsSchemaObject({'date': req.body.statusDate , 'name': session.userName , 'status':req.body.status}) 
    newDBEntry.save(function(err, savedUser){
        if(err)
            res.json({message : 'failures'})
        else
            res.json({message : 'successs'})
    });
})

app.post('/addEmployeeStatusDetail', function(req, res){
    var newDBEntry = new statusDetailsSchemaObject({'date': req.body.statusDate , 'name': req.body.userName , 'status':req.body.status}) 
    newDBEntry.save(function(err, savedUser){
        if(err)
            res.json({message : 'failures'})
        else
            res.json({message : 'successs'})
    });
})

app.post('/addPMImages', function(req, res){
    session = req.session;
    var newDBEntry = new pmImagesSchemaObject({'maintenanceID': req.body.maintenanceID , 'serviceReport': req.body.serviceReport , 'imageLink':req.body.imageLink}) 
    newDBEntry.save(function(err, savedUser){
        if(err)
            res.json({message : 'failures'})
        else
            res.json({message : 'successs'})
    });
})


app.post('/delPMImages', function(req, res){
    pmImagesSchemaObject.deleteMany({maintenanceID: req.body.maintenanceID}, function (err, docs) {
        if(err) 
        {
            res.json({message : 'failures'})
        }
        else
        {
            res.json({message : 'success'})
        }
      });
})


app.post('/addCustomerDetail', function(req, res){
    var newDBEntry = new customerDetailsSchemaObject({'customerName': req.body.custName , 'customerType' :req.body.customerType , 'custId' : req.body.custId, 'address': req.body.custAddress , 'email':req.body.custEmail, 'officialphone':req.body.custOfficialPhone, 'contactperson':req.body.contactPersonName, 'contactpersonphone':req.body.contactPersonPhone, 'upsName': req.body.upsName, 'upsCapacity': req.body.upsCapacity }) 

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
    var newDBEntry = new customerInventorySchemaObject({'customerName': req.body.customerName , 'customerType':req.body.customerType , 'custId': req.body.custId , 'installDate':req.body.installDate, 'upsName':req.body.upsName, 'upsCapacity':req.body.upsCapacity,'numOfUps': req.body.numOfUps, 'batteryName':req.body.batteryName , 'batteryCapacity':req.body.batteryCapacity, 'numOfBattery':req.body.numOfBattery , 'stabilizerName' : req.body.stabilizerName ,'numOfStabilizer':req.body.numOfStabilizer , 'solarPanelName':req.body.solarPanelName , 'numOfSolarPanel':req.body.numOfSolarPanel  , 'inverterName':req.body.inverterName  , 'numOfInverter':req.body.numOfInverter  , 'inverterCapacity':req.body.inverterCapacity  , 'solarRetrofitName':req.body.solarRetrofitName , 'numOfSolarRetrofit':req.body.numOfSolarRetrofit }) 

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
    var newDBEntry = new preventiveMaintenanceHistorySchemaObject({'customerName': req.body.customerName , 'custId': req.body.custId , 'maintenanceType':req.body.maintenanceType, 'dateWhenDone': req.body.dateWhenDone, 'engineer':req.body.engineer, 'maintenanceID':req.body.maintenanceID, 'advanceAmount':req.body.advanceAmount, 'transportExpense':req.body.transportExpense, 'travelExpense':req.body.travelExpense, 'MiscellaneousExpense':req.body.MiscellaneousExpense, 'dueAmount':req.body.dueAmount, 'returnAmount':req.body.returnAmount,'customerType':req.body.customerType, 'address':req.body.address, 'upsName':req.body.upsName, 'upsCapacity':req.body.upsCapacity, 'description': req.body.description }) 

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
    var newDBEntry = new upcomingMaintenanceSchemaObject({'customerName': req.body.customerName , 'custId': req.body.custId , 'maintenanceType':req.body.maintenanceType, 'dateWhenScheduled': req.body.dateWhenScheduled, 'engineer':req.body.engineer, 'maintenanceID':req.body.maintenanceID ,'customerType':req.body.customerType, 'address':req.body.address, 'upsName':req.body.upsName, 'upsCapacity':req.body.upsCapacity, 'description': req.body.description }) 
    
    newDBEntry.save(function(err, savedUser){
        if(err)
        {
            res.json({ error: err.message || err.toString() });
        }
        else
            res.json({message : 'successs'})
    });
})

app.get("/getCounters",function(req, res) {
    countersSchemaObject.findOne({ searchId: "keywordforsearch"}, function (err, docs) {
        if(err) return next(err);
        res.send(docs);
      });
  })


app.post('/incrementCustCounter', function(req, res){
    countersSchemaObject.findOneAndUpdate({searchId: "keywordforsearch"}, {$inc:{ customerCount: 1}}, function (err, docs) {
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

app.post('/incrementMaintenanceCounter', function(req, res){
    countersSchemaObject.findOneAndUpdate({searchId: "keywordforsearch"},{$inc:{ maintenanceCount: 1}}, function (err, docs) {
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



app.get("/getCustomerDetails",function(req, res) {
    customerDetailsSchemaObject.find({}, function (err, docs) {
        if(err) return next(err);
        res.send(docs);
      });
  })

  app.get("/getAllEngineers",function(req, res) {
    userLoginSchemaObject.find({ userType: "engineer" }, function (err, docs) {
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
    if(session.userId && (session.userType == 'admin' || session.userType == 'coordinator' )){
        preventiveMaintenanceHistorySchemaObject.find({}, function (err, docs) {
            if(err) return next(err);
            if (docs == null) {
                res.send('Preventive maintenance history not found.');
            }
            res.send(docs);
          });
    }
    else if(session.userId && (session.userType == 'engineer')){
        preventiveMaintenanceHistorySchemaObject.find({engineer: session.userName}, function (err, docs) {
            if(err) return next(err);
            if (docs == null) {
                res.send('Preventive maintenance history not found.');
            }
            res.send(docs);
          });
    }
    else{
        res.send('Please login to view data');
    }
})



app.get("/getPMHistoryForMid",function(req, res) {
        preventiveMaintenanceHistorySchemaObject.findOne({maintenanceID: req.query.maintenanceID}, function (err, docs) {
            if(err) return next(err);
            if (docs == null) {
                res.send('Preventive maintenance history not found for given M_id.');
            }
            res.send(docs);
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

app.get("/getUpcomingPMForMid",function(req, res) {
    upcomingMaintenanceSchemaObject.findOne({ maintenanceID: req.query.maintenanceID}, function (err, docs) {
      if (err){
          res.send(err);
      }
      else{
          //console.log("Result : ", docs);
          if (docs == null) {
              res.send('Upcoming maintenance record not found for given Maintenance ID.');
          }
          else
          {
              res.send(docs)
          }
      }
  });
})

app.get("/deleteFromUpcomingPM",function(req, res) {
    upcomingMaintenanceSchemaObject.findOneAndRemove({maintenanceID: req.query.maintenanceID}, function (err, docs) {
        if(err) 
        {
            return next(err);
        }
        else
        {
           res.send(docs);
        }
      });
})

app.get("/deleteFromCompletedPM",function(req, res) {
    preventiveMaintenanceHistorySchemaObject.findOneAndRemove({maintenanceID: req.query.maintenanceID}, function (err, docs) {
        if(err) 
        {
            return next(err);
        }
        else
        {
           res.send(docs);
        }
      });
})


app.get("/getAllUpcomingPM",function(req, res) {
    if(session.userId && (session.userType == 'admin' || session.userType == 'coordinator')){
        upcomingMaintenanceSchemaObject.find({}, function (err, docs) {
            if(err) return next(err);
            if (docs == null) {
                res.send('Upcoming maintenance record not found.');
            }
            res.send(docs);
          });
    }
    else if(session.userId && (session.userType == 'engineer')){
        upcomingMaintenanceSchemaObject.find({engineer: session.userName}, function (err, docs) {
            if(err) return next(err);
            if (docs == null) {
                res.send('Upcoming maintenance record not found.');
            }
            res.send(docs);
          });
    }
    else
    {
        res.send('Please login to view data');
    }
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

app.get("/getPMImages",function(req, res) {
    pmImagesSchemaObject.find({maintenanceID: req.query.maintenanceID}, function (err, docs) {
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
        res.sendFile(__dirname+'/addDailyStatus.html')
    }
    else if(session.userId && (session.userType == 'coordinator')){
        res.sendFile(__dirname+'/addEmployeeStatus.html')
    }
    else
        res.sendFile(__dirname+'/login.html')
})

app.get('/whoami',(req,res) => {
    session=req.session;
    if(session.userId && (session.userType == 'admin')){
        res.json({message : 'admin'})
    }
    else if(session.userId && (session.userType == 'engineer')){
        res.json({message : 'engineer'})
    }
    else if(session.userId && (session.userType == 'coordinator')){
        res.json({message : 'coordinator'})
    }
    else
       res.json({message : 'invalid'})
})


app.get('/index.html',(req,res) => {
    session=req.session;
    if(session.userId && (session.userType == 'admin')){
        res.sendFile(__dirname+'/index.html')
    }
    else if(session.userId && (session.userType == 'engineer')){
        res.sendFile(__dirname+'/addDailyStatus.html')
    }
    else
        res.sendFile(__dirname+'/login.html')
})


app.get('/accounts.html', (req, res) => res.sendfile(__dirname+'/accounts.html'))
app.get('/add-product.html', (req, res) => res.sendfile(__dirname+'/add-product.html'))
app.get('/edit-product.html', (req, res) => res.sendfile(__dirname+'/edit-product.html'))

app.get('/add-customer-info.html', (req, res) => res.sendfile(__dirname+'/add-customer-info.html'))
app.get('/view-customer-info.html', (req, res) => res.sendfile(__dirname+'/view-customer-info.html'))
app.get('/schedulePM.html', (req, res) => res.sendfile(__dirname+'/schedulePM.html'))


app.get('/login.html', (req, res) => res.sendfile(__dirname+'/login.html'))
app.get('/products.html', (req, res) => res.sendfile(__dirname+'/products.html'))


app.get('/upcomingCustomerPM.html', (req, res) => res.sendfile(__dirname+'/upcomingCustomerPM.html'))
app.get('/upcomingPlannedPM.html', (req, res) => res.sendfile(__dirname+'/upcomingPlannedPM.html'))
app.get('/allupcomingPM.html', (req, res) => res.sendfile(__dirname+'/allupcomingPM.html'))
app.get('/addPMTicket.html', (req, res) => res.sendfile(__dirname+'/addPMTicket.html'))

app.get('/completedPM.html', (req, res) => res.sendfile(__dirname+'/completedPM.html'))

app.get('/addDailyStatus.html', (req, res) => res.sendfile(__dirname+'/addDailyStatus.html'))
app.get('/uploadPMReport.html', (req, res) => res.sendfile(__dirname+'/uploadPMReport.html'))

app.get('/editCompletedPMReport.html', (req, res) =>
{
    if(session.userId && (session.userType == 'admin'))
    {
        res.sendfile(__dirname+'/editCompletedPMReport.html')
    }
    {
        res.sendfile(__dirname+'/addEmployeeStatus.html')
    }
})

app.get('/detailedPMReport.html', (req, res) => res.sendfile(__dirname+'/detailedPMReport.html'))

app.get('/addEmployeeStatus.html', (req, res) => res.sendfile(__dirname+'/addEmployeeStatus.html'))


app.post('/login', function(req, res){
    console.log(process.cwd())
    userLoginSchemaObject.findOne({ userId: req.body.userId , password: req.body.password, userType: req.body.userType}, function (err, docs) {
        if (err){
            //console.log(err)
            res.send(err);
        }
        else{
            //console.log("Result : ", docs);
            if (docs == null) {
                res.json({message : 'Login not found, please try again with valid credentials'})
            }
            else
            {
                session=req.session;
                session.userId=req.body.userId;
                session.userType=req.body.userType;
                session.userName = docs.userName;
                //res.sendFile(__dirname+'/index.html')
                res.json({message : 'loginsuccess'})
            }
            //res.send(docs);
        }
    });
})


app.post('/changepassword', function(req, res){
    session=req.session;
    userLoginSchemaObject.findOneAndUpdate({ userId: session.userId,userName: session.userName, userType: session.userType},{password: req.body.password}, function (err, docs) {
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
                res.send('Password updated');
                //res.sendFile(__dirname+'/index.html')
            }
            //res.send(docs);
        }
    });
})

app.get('/logout',(req,res) => {
    req.session.destroy()
    res.json({message : 'Old session removed'})
});


/*
trying email feature
*/


var nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        type: 'OAuth2',
        user: 'rspower1pmreport@gmail.com',
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        accessToken: process.env.GOOGLE_ACCESS_TOKEN,
        expires: 1484314697598
    }
});

  // Process the file upload and upload to Google Cloud Storage.
app.post('/sendmail', function(req, res){ 

    var attachmentArray = []
    

    pmImagesSchemaObject.find({maintenanceID: req.body.maintenanceID}, function (err, docs) {
        if(err) 
        {
            console.log('Error while fetching images link from DB')
        }
        
        /*
                for (var i = 0; i < docs.length; i++) {
              
                    const options = {
                        url: `${docs[i].imageLink}`,
                        dest: `/app/public/img/sendmail/${i}.jpg`             // will be saved to /path/to/dest/image.jpg
                        }
        
                        download.image(options)
                        .then(({ filename}) => {
                            console.log('Saved to', filename)  // saved to /path/to/dest/image.jpg
                            attachmentArray.push(`{  filename: '${i}', path: '${docs[i].imageLink}' }`);

                            if (docs.length == attachmentArray.length)
                            {
                                console.log(attachmentArray)
                                var customerName = req.body.customerName
                                var custId = req.body.custId
                                var maintenanceType = req.body.maintenanceType
                                var dateWhenDone  = req.body.dateWhenDone
                                var engineer = req.body.engineer
                                var maintenanceID  = req.body.maintenanceID
                                var advanceAmount = req.body.advanceAmount
                                var transportExpense = req.body.transportExpense
                                var travelExpense = req.body.travelExpense
                                var MiscellaneousExpense = req.body.MiscellaneousExpense
                                var dueAmount = req.body.dueAmount
                                var returnAmount = req.body.returnAmount
                                var customerType = req.body.customerType
                                var address = req.body.address
                                var upsName = req.body.upsName
                                var upsCapacity = req.body.upsCapacity
                                var description = req.body.description
                
                                var mailOptions = {
                                    from: 'rspower1pmreport@gmail.com',
                                    to: 'rspower1pmdatastore@gmail.com',
                                    subject: `Reports for ${customerName}  ${address} MID - ${maintenanceID}`,
                                    attachments: attachmentArray,
                                    text: `Please find the attached report- \n \n\
                                    Customer Id : ${custId} \n\
                                    Customer Name : ${customerName} \n \
                                    Address : ${address}\n\
                                    Customer Type : ${customerType}\n\
                                    Maintenance Type : ${maintenanceType}\n \
                                    Maintenance Id : ${maintenanceID}\n\
                                    Date of completion : ${dateWhenDone}\n\
                                    Engineer : ${engineer}\n\
                                    Advance Amount : ${advanceAmount}\n\
                                    Transport Expense : ${transportExpense}\n\
                                    Travel Expense : ${travelExpense}\n\
                                    Miscellaneous Expense : ${MiscellaneousExpense}\n\
                                    Due Amount : ${dueAmount}\n\
                                    Return Amount : ${returnAmount}\n\
                                    Ups Name: ${upsName}\n\
                                    Ups Capacity: ${upsCapacity}\n\
                                    Summary: ${description}\n\
                                    `
                                };
                
                                transporter.sendMail(mailOptions, function(error, info){
                
                                    if (error) {
                                    res.json({message : error})
                                    } else {
                                    res.json({message : 'emailsent'})
                                    }
                                });
                
                            }
                        })
                        .catch((err) => console.error(err))
                }

                */
                for (var i = 0; i < docs.length; i++) {

                    attachmentArray.push(`{  path: '${docs[i].imageLink}'}`);
                }
                console.log(attachmentArray)
                                var customerName = req.body.customerName
                                var custId = req.body.custId
                                var maintenanceType = req.body.maintenanceType
                                var dateWhenDone  = req.body.dateWhenDone
                                var engineer = req.body.engineer
                                var maintenanceID  = req.body.maintenanceID
                                var advanceAmount = req.body.advanceAmount
                                var transportExpense = req.body.transportExpense
                                var travelExpense = req.body.travelExpense
                                var MiscellaneousExpense = req.body.MiscellaneousExpense
                                var dueAmount = req.body.dueAmount
                                var returnAmount = req.body.returnAmount
                                var customerType = req.body.customerType
                                var address = req.body.address
                                var upsName = req.body.upsName
                                var upsCapacity = req.body.upsCapacity
                                var description = req.body.description
                
                                var mailOptions = {
                                    from: 'rspower1pmreport@gmail.com',
                                    to: 'rspower1pmdatastore@gmail.com',
                                    subject: `Reports for ${customerName}  ${address} MID - ${maintenanceID}`,
                                    attachments: {  path: 'https://storage.googleapis.com/rspowerimages/2299580_servicereport1_rajat.jpg'},
                                    text: `Please find the attached report- \n \n\
                                    Customer Id : ${custId} \n\
                                    Customer Name : ${customerName} \n \
                                    Address : ${address}\n\
                                    Customer Type : ${customerType}\n\
                                    Maintenance Type : ${maintenanceType}\n \
                                    Maintenance Id : ${maintenanceID}\n\
                                    Date of completion : ${dateWhenDone}\n\
                                    Engineer : ${engineer}\n\
                                    Advance Amount : ${advanceAmount}\n\
                                    Transport Expense : ${transportExpense}\n\
                                    Travel Expense : ${travelExpense}\n\
                                    Miscellaneous Expense : ${MiscellaneousExpense}\n\
                                    Due Amount : ${dueAmount}\n\
                                    Return Amount : ${returnAmount}\n\
                                    Ups Name: ${upsName}\n\
                                    Ups Capacity: ${upsCapacity}\n\
                                    Summary: ${description}\n\
                                    `
                                };
                
                                transporter.sendMail(mailOptions, function(error, info){
                
                                    if (error) {
                                    res.json({message : error})
                                    } else {
                                    res.json({message : 'emailsent'})
                                    }
                                });
      });

    
    });


/*
email feture code block end
*/


app.listen(port, () => console.log(`Example app listening on port ${port}!`))
