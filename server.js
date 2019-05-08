const express = require('express')
const app = express()
const port = process.env.PORT || 80


var mongoose = require('mongoose');

mongoose.connect('mongodb+srv://dbadmin:dbpassword@cluster0-v6hog.mongodb.net/test?retryWrites=true', {useNewUrlParser: true});

var userSchema = new mongoose.Schema({
    username: String,
    password : String
});

var User = mongoose.model('User', userSchema);

app.post('/register', function(req, res){
    var user = new User({'username' : req.body.username, 'password': req.body.password}) 
    
    user.save(function(err, savedUser){
        if(err)
            res.json({message : 'failures'})
        else
            res.json({message : 'successs'})
    });
})


app.get('/', (req, res) => res.sendfile(__dirname+'/index.html'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
