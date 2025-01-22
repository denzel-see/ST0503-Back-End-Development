// DAAA1B07 Denzel See P2222840
var app = require('./controller/app')
var port=8081
var server = app.listen(port,function(){
    console.log("Back End Server hosted at localhost:"+port);    
});