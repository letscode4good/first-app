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
    name: String,
    colour : String,
    description : String
});

var User = mongoose.model('tshirts', userSchema);

app.post('/register', function(req, res){
    var user = new User({'name' : req.body.Name, 'colour': req.body.Colour, 'description': req.body.Description}) 
    
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


app.listen(port, () => console.log(`Example app listening on port ${port}!`))
