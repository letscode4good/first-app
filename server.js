const express = require('express')
const app = express()
const port = process.env.PORT || 80

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

var userSchema = new mongoose.Schema({
    employee: String,
    VisitingOrg : String,
    Dateofvisit : String,
    Issuedescription : String,
    ResolutionOfIssue : String
});

var User = mongoose.model('tshirts', userSchema);

app.post('/register', function(req, res){
    var user = new User({'employee' : req.body.employee, 'VisitingOrg': req.body.VisitingOrg, 'Dateofvisit': req.body.DOV , 'Issuedescription': req.body.IssueDescription, 'ResolutionOfIssue': req.body.ResolutionOfIssue}) 
    
    user.save(function(err, savedUser){
        if(err)
            res.json({message : 'failures'})
        else
            res.json({message : 'successs'})
    });
})

app.post('/gettodo', function(req, res){
    User.find({}, function(err, userObj){
        res.json(userObj);
    })
})


app.post('/delete', function(req, res){ 
        User.findOneAndDelete({'password' : req.body.password}).then((doc) => {
        
            res.json({message : 'successs'})
        
        })
})

app.get('/', (req, res) => res.sendfile(__dirname+'/index.html'))
app.get('/tshirts.html', (req, res) => res.sendfile(__dirname+'/tshirts.html'))
app.get('/Search.html', (req, res) => res.sendfile(__dirname+'/Search.html'))


app.get('/jquery/jquery-3.5.1.js', (req, res) => res.sendfile(__dirname+'/jquery/jquery-3.5.1.js'))
app.get('/jquery/jquery.dataTables.min.js', (req, res) => res.sendfile(__dirname+'/jquery/jquery.dataTables.min.js'))
app.get('/jquery/jquery.dataTables.min.css', (req, res) => res.sendfile(__dirname+'/jquery/jquery.dataTables.min.css'))

app.get('/css/desgin.css', (req, res) => res.sendfile(__dirname+'/css/desgin.css'))



app.get('/fetch', function(req, res){ 
    User.find(function (err, docs) {
        if (err){
            res.json({message : 'failure'})
        }
        else{
            res.json(docs);
        }
    });
   
})



app.listen(port, () => console.log(`Example app listening on port ${port}!`))
