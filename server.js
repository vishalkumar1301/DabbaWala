// import 3rd party modules
const dotenv = require('dotenv');
const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const cors = require('cors');

// import custom modules
const configuration = require('./config');
const {logger} = require('./Config/winston');
const { verifyLocalToken } = require('./Authentication/verifyLocalToken');
const authenticationRoutes = require('./Routes/Routes');
const addressRoute = require('./Routes/Address');
const mealRoute = require('./Routes/Meal');
const userRoute = require('./Routes/User');
require('./database');
var admin = require("firebase-admin");


dotenv.config();

const port = process.env.PORT || 8000;
const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
}));

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());





////////////////////// notifications //////////////////



var serviceAccount = require('./dabbawala-307114-firebase-adminsdk-1t0n7-8710d78c88.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://dabbawala-307114-default-rtdb.firebaseio.com"
});

var topic = 'general';

var message = {
  "notification":{
    "title":"Portugal vs. Denmark",
    "body":"great match!"
  },
  "data":{
    "Nick" : "Mario",
    "body" : "great match!",
    "Room" : "PortugalVSDenmark"
  },
  topic: topic
};

// Send a message to devices subscribed to the provided topic.
admin.messaging().send(message, true)
  .then((response) => {
    // Response is a message ID string.
    console.log('Successfully sent message:', response, message);
  })
  .catch((error) => {
    console.log('Error sending message:', error);
});


////////////////////////////////////////////////////////////////////////










app.use('/auth', authenticationRoutes);

app.use('/image', function (req, res) {
  const db = mongoose.connection;
  
  const collection = db.collection('Images.files');    
  const collectionChunks = db.collection('Images.chunks');
  
  collection.find({filename: req.query.name}).toArray(function(err, docs){
    if(err){        
      return res.render('index', {
        title: 'File error', 
        message: 'Error finding file', 
            error: err.errMsg});      
        }
      if(!docs || docs.length === 0){        
        return res.render('index', {
         title: 'Download Error', 
         message: 'No file found'});      
       }else{
      
       //Retrieving the chunks from the db          
       collectionChunks.find({files_id : docs[0]._id})
         .sort({n: 1}).toArray(function(err, chunks){   
           if(err){            
              return res.render('index', {
               title: 'Download Error', 
               message: 'Error retrieving chunks', 
               error: err.errmsg});          
            }
          if(!chunks || chunks.length === 0){            
            //No data found            
            return res.render('index', {
               title: 'Download Error', 
               message: 'No data found'});          
          }
        
        let fileData = [];          
        for(let i=0; i<chunks.length;i++){            
          //This is in Binary JSON or BSON format, which is stored               
          //in fileData array in base64 endocoded string format               
         
          fileData.push(chunks[i].data.toString('base64'));          
        }
         //Display the chunks using the data URI format          
         var img = Buffer.from(fileData.join(''), 'base64');

         res.writeHead(200, {
            'Content-Type': 'image/png',
            'Content-Length': img.length
        });
        res.end(img); 
         });      
        }          
       });  

}); 

app.use(verifyLocalToken);

app.get('/home', function (req, res) {
  res.status(200).send(req.headers);
})

app.use('/meal', mealRoute);
app.use('/user', userRoute);
app.use('/address', addressRoute);

// start sever
app.listen(port, function() {
    logger.info(`App running on port ${port}`)
});


