<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
<style>
body {
  margin: 0;
  min-width: 250px;
}

/* Include the padding and border in an element's total width and height */
* {
  box-sizing: border-box;
}

/* Remove margins and padding from the list */
ul {
  margin: 0;
  padding: 0;
}

/* Style the list items */
ul li {
  cursor: pointer;
  position: relative;
  padding: 12px 8px 12px 40px;
  list-style-type: none;
  background: #eee;
  font-size: 18px;
  transition: 0.2s;
  
  /* make the list items unselectable */
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* Set all odd list items to a different color (zebra-stripes) */
ul li:nth-child(odd) {
  background: #f9f9f9;
}

/* Darker background-color on hover */
ul li:hover {
  background: #ddd;
}

/* When clicked on, add a background color and strike out text */
ul li.checked {
  background: #888;
  color: #fff;
  text-decoration: line-through;
}

/* Add a "checked" mark when clicked on */
ul li.checked::before {
  content: '';
  position: absolute;
  border-color: #fff;
  border-style: solid;
  border-width: 0 2px 2px 0;
  top: 10px;
  left: 16px;
  transform: rotate(45deg);
  height: 15px;
  width: 7px;
}

/* Style the close button */
.close {
  position: absolute;
  right: 0;
  top: 0;
  padding: 12px 16px 12px 16px;
}

.close:hover {
  background-color: #f44336;
  color: white;
}

/* Style the header */
.header {
  background-color: #f44336;
  padding: 30px 40px;
  color: black;
  text-align: center;
}

/* Clear floats after the header */
.header:after {
  content: "";
  display: table;
  clear: both;
}

/* Style the input */
input {
  margin: 0;
  border: none;
  border-radius: 0;
  width: 75%;
  padding: 10px;
  float: left;
  font-size: 16px;
}

/* Style the "Add" button */
.addBtn {
  padding: 10px;
  width: 25%;
  background: #d9d9d9;
  color: #555;
  float: left;
  text-align: center;
  font-size: 16px;
  cursor: pointer;
  transition: 0.3s;
  border-radius: 0;
}

.addBtn:hover {
  background-color: #bbb;
}
</style>
    <script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
<script>
  (adsbygoogle = window.adsbygoogle || []).push({
    google_ad_client: "ca-pub-8460520131192129",
    enable_page_level_ads: true
  });
 
  
</script>
  
  
  <meta name="google-signin-scope" content="profile email">
    <meta name="google-signin-client_id" content="478247907950-5obturgcg5ah1or25mts0eedm9gv534b.apps.googleusercontent.com">
    <script src="https://apis.google.com/js/platform.js?onload=renderButton" async defer></script>
  
  

</head>
<body>
  <div id="my-signin2" style="float: left;"></div>
  <script>
    function onSuccess(googleUser) {
        var auth2 = gapi.auth2.getAuthInstance();
        var profile = auth2.currentUser.get().getBasicProfile();
        var email_id = profile.getEmail();

        var http = new XMLHttpRequest();
        var url = 'https://todo-list-rk.herokuapp.com/gettodo';
        var params = `username=${email_id}`;
        http.open('POST', url, true);

        //Send the proper header information along with the request
        http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        http.onreadystatechange = function() {//Call a function when the state changes.
            if(http.readyState == 4 && http.status == 200) {

                    var objJSON = JSON.parse(http.responseText);

                    for (var i = 0, len = objJSON.length; i < len; ++i) 
                    {
                        var user = objJSON[i];
                       if(user.username == email_id)
                       {
                            var li = document.createElement("li");
                            var inputValue = user.password ;
                            var t = document.createTextNode(inputValue);
                            li.appendChild(t);
                            document.getElementById("myUL").appendChild(li);
                            var span = document.createElement("SPAN");
                                var txt = document.createTextNode("\u00D7");
                                span.className = "close";
                                span.appendChild(txt);
                                li.appendChild(span);
                               
                       }
                    }

                    for (i = 0; i < close.length; i++) {
  close[i].onclick = function() {
    var div = this.parentElement;
    
    div.parentNode.removeChild(div);
    //div.style.display = "none";


    var auth2 = gapi.auth2.getAuthInstance();
        var profile = auth2.currentUser.get().getBasicProfile();
        var coordinates = div.innerText.split( "\n" );
        var tmp = coordinates[0]
        var newStr = tmp.substr(0, tmp.length-1);
        var email_id = newStr
        window.alert(email_id);

        var http = new XMLHttpRequest();
        var url = 'https://todo-list-rk.herokuapp.com/delete';
        var params = `password=${email_id}`;
        http.open('POST', url, true);

        //Send the proper header information along with the request
        http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        http.onreadystatechange = function() {//Call a function when the state changes.
            if(http.readyState == 4 && http.status == 200) {

            }
        }
        http.send(params);

  }
}
                       
            }
        }
        http.send(params);
    }
    function onFailure(error) {
      console.log(error);
    }
    function renderButton() {
      gapi.signin2.render('my-signin2', {
        'scope': 'profile email',
        'width': 240,
        'height': 50,
        'longtitle': true,
        'theme': 'dark',
        'onsuccess': onSuccess,
        'onfailure': onFailure
      });
    }
  </script>

  <script src="https://apis.google.com/js/platform.js?onload=renderButton" async defer></script>
    <script>
      function onSignIn(googleUser) {
        // Useful data for your client-side scripts:
        var profile = googleUser.getBasicProfile();
        console.log("ID: " + profile.getId()); // Don't send this directly to your server!
        console.log('Full Name: ' + profile.getName());
        console.log('Given Name: ' + profile.getGivenName());
        console.log('Family Name: ' + profile.getFamilyName());
        console.log("Image URL: " + profile.getImageUrl());
        console.log("Email: " + profile.getEmail());

        // The ID token you need to pass to your backend:
        var id_token = googleUser.getAuthResponse().id_token;
        console.log("ID Token: " + id_token);
        

        var auth2 = gapi.auth2.getAuthInstance();
        var profile = auth2.currentUser.get().getBasicProfile();
        var email_id = profile.getEmail();

        var http = new XMLHttpRequest();
        var url = 'https://todo-list-rk.herokuapp.com/gettodo';
        var params = `username=${email_id}`;
        http.open('POST', url, true);

        //Send the proper header information along with the request
        http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        http.onreadystatechange = function() {//Call a function when the state changes.
            if(http.readyState == 4 && http.status == 200) {
          
                    var objJSON = JSON.parse(http.responseText);
                    alert(JSON.stringify(objJSON));

                    for (var i = 0, len = objJSON.length; i < len; ++i) 
                    {
                        var user = objJSON[i];
                    
                        alert(user.password);
                    
                        var li = document.createElement("li");
                        var inputValue = user.password ;
                        var t = document.createTextNode(inputValue);
                        li.appendChild(t);
                        document.getElementById("myUL").appendChild(li);
                    }

            }
        
        http.send(params);

      }
    </script>

  <div class="container" align="right">
        <a href="#" style="float: right;" onclick="signOut();" class="btn btn-info btn-lg">
          <span class="glyphicon glyphicon-log-out"></span> Log out
        </a>
    </div>
<script>
  function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {

    var list = document.getElementById("myUL");
    while (list.hasChildNodes()) {
        list.removeChild(list.firstChild);
    }

      console.log('User signed out.');

    });
  }
</script>
  
<div id="myDIV" class="header">
  <h2 style="margin:5px">My To Do List</h2>
  <input type="text" id="myInput" placeholder="Title...">
  <span onclick="newElement()" class="addBtn">Add</span>
</div>

<ul id="myUL">
</ul>

<script>
// Create a "close" button and append it to each list item
var myNodelist = document.getElementsByTagName("LI");
var i;
for (i = 0; i < myNodelist.length; i++) {
  var span = document.createElement("SPAN");
  var txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  myNodelist[i].appendChild(span);
}

// Click on a close button to hide the current list item
var close = document.getElementsByClassName("close");
var i;
for (i = 0; i < close.length; i++) {
  close[i].onclick = function() {
    var div = this.parentElement;
    
    div.parentNode.removeChild(div);
    //div.style.display = "none";


    var auth2 = gapi.auth2.getAuthInstance();
        var profile = auth2.currentUser.get().getBasicProfile();
      var coordinates = div.innerText.split( "\n" );
       
       var tmp = coordinates[0]
        var newStr = tmp.substr(0, tmp.length-1);
        var email_id = newStr
    
    window.alert(email_id);
        

        var http = new XMLHttpRequest();
        var url = 'https://todo-list-rk.herokuapp.com/delete';
        var params = `password=${email_id}`;
        http.open('POST', url, true);

        //Send the proper header information along with the request
        http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        http.onreadystatechange = function() {//Call a function when the state changes.
            if(http.readyState == 4 && http.status == 200) {

            }
        }
        http.send(params);

  }
}

// Add a "checked" symbol when clicking on a list item
var list = document.querySelector('ul');
list.addEventListener('click', function(ev) {
  if (ev.target.tagName === 'LI') {
    ev.target.classList.toggle('checked');
  }
}, false);

// Create a new list item when clicking on the "Add" button
function newElement() {
  var auth2 = gapi.auth2.getAuthInstance();
  if (auth2.isSignedIn.get()) {
      var li = document.createElement("li");
      var inputValue = document.getElementById("myInput").value;
      var t = document.createTextNode(inputValue);
      li.appendChild(t);
      if (inputValue === '') {
        alert("You must write something!");
      } 
      else {

        var profile = auth2.currentUser.get().getBasicProfile();
        var email_id = profile.getEmail();

        var http = new XMLHttpRequest();
        var url = 'https://todo-list-rk.herokuapp.com/register';
        var params = `username=${email_id}&password=${inputValue}`;
        http.open('POST', url, true);

        //Send the proper header information along with the request
        http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        http.onreadystatechange = function() {//Call a function when the state changes.
            if(http.readyState == 4 && http.status == 200) {
                
            }
        }
        http.send(params);

        document.getElementById("myUL").appendChild(li);
      }
      document.getElementById("myInput").value = "";

      var span = document.createElement("SPAN");
      var txt = document.createTextNode("\u00D7");
      span.className = "close";
      span.appendChild(txt);
      li.appendChild(span);

for (i = 0; i < close.length; i++) {
  close[i].onclick = function() {
    var div = this.parentElement;
    
    div.parentNode.removeChild(div);
    //div.style.display = "none";


    var auth2 = gapi.auth2.getAuthInstance();
        var profile = auth2.currentUser.get().getBasicProfile();
        var coordinates = div.innerText.split( "\n" );
       
        var tmp = coordinates[0]
        var newStr = tmp.substr(0, tmp.length-1);
        var email_id = newStr
    window.alert(email_id);
        

        var http = new XMLHttpRequest();
        var url = 'https://todo-list-rk.herokuapp.com/delete';
        var params = `password=${email_id}`;
        http.open('POST', url, true);

        //Send the proper header information along with the request
        http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        http.onreadystatechange = function() {//Call a function when the state changes.
            if(http.readyState == 4 && http.status == 200) {

            }
        }
        http.send(params);

  }
}

  }
  else
    {
      window.alert("Please login with gmail to add todo items.");
    }
}
</script>


</body>
</html>
