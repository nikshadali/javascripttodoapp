const { application } = require('express');
const express = require('express');
const {MongoClient, ObjectId} = require('mongodb');
const App = express();
const sanitizeHTML = require('sanitize-html')
let db;

async function dbconnect() {
  let Client = new MongoClient("mongodb+srv://admin:admin321@cluster0.livsl.mongodb.net/fullcourse?retryWrites=true&w=majority");
  await Client.connect();
  db = Client.db();
  
}
dbconnect()

App.use(express.static('public'))
// DECLARE MIDDLE WARE TO GET JSON DATA;
App.use(express.json())
App.use(express.urlencoded({extended:false}))
 
function protectedPassword(req, res, next) {
  res.set('WWW-Authenticate', 'Basic realm="Simple Todo App"');
  console.log(req.headers.authorization)
  if(req.headers.authorization =='Basic YWxpOnBhazEyMw=='){
    next()
  }else{
    res.status(401).send('Authrization required')
  }
}
App.use(protectedPassword)


App.get('/', (req, res) => {

  db.collection('todoapp').find().toArray(function(err, items){
       
      res.send(
        `<!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Simple To-Do App</title>
          <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
        </head>
        <body>
          <div class="container">
            <h1 class="display-4 text-center py-1">To-Do App</h1>
            
            <div class="jumbotron p-3 shadow-sm">
              <form id="create-form" action ="/item-create" method="POST">
                <div class="d-flex align-items-center">
                  <input id="create-field" name ="item" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
                  <button class="btn btn-primary">Add New Item</button>
                </div>
              </form>
            </div>
            
            <ul id = "create-list" class="list-group pb-5">
          
            </ul>

           
          </div>
          <script>
            let items = ${JSON.stringify(items)}
          </script>
          <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
          <script src="test.js"></script>
          </body>
        </html>
        `
        );
      
    })
   
})


App.post('/item-create', (req, res) => {

  let cleanText = sanitizeHTML(req.body.text, {allowedTags:[], allowedAttributes:{}})
    db.collection('todoapp').insertOne({text:cleanText}, function(err, info){
    res.json({_id:info.ObjectId, text:req.body.text})
    })
})

App.post('/update-item', (req, res) => {
  let cleanText = sanitizeHTML(req.body.text, {allowedTags:[], allowedAttributes:{}})
   db.collection('todoapp').findOneAndUpdate({ _id: new ObjectId(req.body.id.trim())},{$set:{text:cleanText}},function(){
    res.send('Success')
   })
 
})
App.post('/delete-item', (req, res) => {
    db.collection('todoapp').deleteOne({_id:new ObjectId(req.body.id.trim())}, function(){
      res.send('Success')
    })
})
App.listen(3000, () => {
  console.log(`this port runing on 3000...`)
})

