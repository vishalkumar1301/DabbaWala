// import 3rd party modules
const dotenv = require('dotenv');
const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');

// import custom modules
const configuration = require('./config');
const {logger} = require('./Config/winston');
const { verifyLocalToken } = require('./Authentication/verifyLocalToken');
const authenticationRoutes = require('./Routes/Routes');
const addressRoute = require('./Routes/Address');
const mealRoute = require('./Routes/Meal');
require('./database');

dotenv.config();

const port = process.env.PORT;
const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

app.use('/auth', authenticationRoutes);

app.use(verifyLocalToken);
app.use('/', mealRoute);
app.use('/address', addressRoute);

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

// start sever
app.listen(port, function() {
    logger.info(`App running on port ${port}`)
});


