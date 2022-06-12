const express = require('express')
const app = express()

const port = process.env.PORT || 80
app.use(express.static('public',{ maxAge:86400000}))
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






var dailyExpenseSchema = new mongoose.Schema({
    itemName : String,
    quantity : Number,
    cost : Number,
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
            res.json({message : 'success'})
    });
})


app.post('/addNewItem', function(req, res){
  var newDBEntry = new itemNameSchemaObject({'itemName': req.body.itemName }) 

  newDBEntry.save(function(err, savedUser){
      if(err)
      {
          res.json({ error: err.message || err.toString() });
      }
      else
          res.json({message : 'success'})
  });
})


app.get('/getItemNames',function(req, res) {
  itemNameSchemaObject.find({}, function (err, docs) {
        if(err) return next(err);
        res.send(docs);
      });
  })


  app.get('/getDailyExpense',function(req, res) {
    dailyExpenseSchemaObject.find({}, function (err, docs) {
          if(err) return next(err);
          res.send(docs);
        });
    })


app.get('/',(req,res) => {
    res.sendFile(__dirname+'/index.html')
})

app.get('/pricing.html',(req,res) => {
    res.sendFile(__dirname+'/pricing.html')
})

app.get('/addItem.html',(req,res) => {
  res.sendFile(__dirname+'/addItem.html')
})


app.get('/index.html',(req,res) => {
   
    res.sendFile(__dirname+'/index.html')

})

app.get('/chart.html',(req,res) => {
   
  res.sendFile(__dirname+'/chart.html')

})


app.post('/addNewEnquiry', function(req, res){

    var mailOptions = {
        from: 'rspower1pmreport@gmail.com',
        to: 'rspower1pmdatastore@gmail.com',
        subject: `Customer Inquiry by ${req.body.customerName}`,
        text: `Please find the inquiry info- \n \n\
Customer Name : ${req.body.customerName} \n \
Customer Email : ${req.body.customerEmail} \n \
Customer Phone : ${req.body.customerPhone} \n \
Customer Inquiry Subject  : ${req.body.customerInquirySubject} \n \
Customer msg  : ${req.body.customerInquiryMsg} \n \
        `      
    };


    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
        //res.json({message : error})
        console.log("could not send email")
        res.json({ error: error.message || error.toString() });
        } else {
            //res.json({message : 'emailsent'})
            console.log("emailsent")
            res.json({message : 'success'})
        }
    });

})

function sendEmail()
{

    var mailOptions = {
        from: 'rspower1pmreport@gmail.com',
        to: 'rspower1pmdatastore@gmail.com',
        subject: `Customer Inquiry by ${customerName}`,
        text: `Please find the inquiry info- \n \n\
        Customer Id : ${custId} \n\
        Customer Name : ${customerName} \n \
        Customer Email : ${customerEmail} \n \
        Customer Phone : ${customerPhone} \n \
        Customer Inquiry Subject  : ${customerInquirySubject} \n \
        Customer msg  : ${customerInquiryMsg} \n \
        `      
    };


    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
        //res.json({message : error})
            console.log("could not send email")
        } else {
            //res.json({message : 'emailsent'})
            console.log("emailsent")
        }
    });

}


app.listen(port, () => console.log(`Example app listening on port ${port}!`))