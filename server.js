
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

app.get('/', (req, res) => res.sendfile(__dirname+'/index.html'))
app.get('/accounts.html', (req, res) => res.sendfile(__dirname+'/accounts.html'))
app.get('/add-product.html', (req, res) => res.sendfile(__dirname+'/add-product.html'))
app.get('/edit-product.html', (req, res) => res.sendfile(__dirname+'/edit-product.html'))
app.get('/login.html', (req, res) => res.sendfile(__dirname+'/login.html'))
app.get('/products.html', (req, res) => res.sendfile(__dirname+'/products.html'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
