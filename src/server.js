//************---------------------requiremants -----------------------------------************
require('dotenv').config();

const express = require('express');
const session = require('express-session');
const { stat, truncate } = require('fs');
const app = express()
const http = require('http').createServer(app)
const path = require('path');
const hbs= require('hbs');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const auth = require('./middleware/auth');
const dauth = require('./middleware/dauth');



// ------------------------------connection to database ------------------------
require('./db/connect');

//-----------------------------models to aquire for schema---------------------
const Organisation = require("./models/organisation");
const User = require("./models/Indivisual");

// ------------------------extended requiremnts------------------
const async = require('hbs/lib/async');
const { append, cookie } = require('express/lib/response');

const { json } =require('express');
const { send } = require('process');
const { Console, error } = require('console');


// ----------------------------port local host--------------------
const PORT = process.env.PORT || 4000;

http.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})
//------------------path finder--------------------------
const static_path =path.join(__dirname,'../public');

const template_path =path.join(__dirname,'../templates/views');

const partial_path =path.join(__dirname,'../templates/partials');




//-----------------------------using express json file 
app.use(express.json());
//cookie parser--
app.use(cookieParser());
app.use(express.urlencoded({extended:false}));

app.use(express.static(static_path));
// app.use(express.static(main_path));
app.use(express.static(__dirname + ''))


//------------------handlebars view engine---------------------------
app.set('view engine','hbs');
app.set('views',template_path);
hbs.registerPartials(partial_path);



// ------------------server ------register paths ------------------------------
app.get('/', (req,res)=>{
  res.render('mainpage')
});

// deserialization---work - for -- working module
//------------------- logout work for organisation--------------
app.get('/logout', auth , async(req,res) =>{
  try {
       req.curruser.tokens = req.curruser.tokens.filter((currElement) => {
         return currElement.token ===! req.token
        })
        res.clearCookie();
        console.log('logout successful');
        await req.curruser.save();
        res.render('mainpage');
    
  } catch (error) {
    res.status(500).send(error);
  }
});
//------------------- logout work for Indivisuals--------------
app.get('/logoutd', dauth , async(req,res) =>{
  try {
       req.currdoctor.tokens = req.currdoctor.tokens.filter((currElement) => {
         return currElement.token ===! req.dtoken
        })
        res.clearCookie();
        console.log('logout successful');
        await req.currdoctor.save();
        res.render('mainpage');
    
  } catch (error) {
    res.status(500).send(error);
  }
});



// ------------------server ------register paths **end**------------------------------

// creating a new database for Organisation registration===> in database
app.post('/register_O', async(req,res)=>{  // register_O for organisation to redirect
  try{
      const organisation_register = new Organisation({
       // name : req.body.pname, to be set as per the data
       
      })

      const token =await organisation_register.generateAuthToken();
      console.log('the token part'+ token);
      
      res.cookie('jwt',token,{
        expires:new Date(Date.now()+6000000),
        httpOnly:true
      });

      console.log(cookie);

    const regiatered = await Organisation.save();
    res.status(201).render('Organisation_page'); //organisation page for the entry after login
  }
  catch(error){
      res.status(400).send(error);

  }
})
// creating a new database for User registration===> in database
app.post('/register_U', async(req,res)=>{ // register_U for User Indivisuals to redirect
   try{
       const UserRegister = new User({
        // name : req.body.pname, to be set as per the data
        
       })

       const token =await UserRegister.generateAuthToken();
       console.log('the token part'+ token);
       
       res.cookie('jwtd',token,{
         expires:new Date(Date.now()+6000000),
         httpOnly:true
       });
 
       console.log(cookie);

     const regiatered = await UserRegister.save();
     res.status(201).render('indivisuals'); //USER page-------
   }
   catch(error){
       res.status(400).send(error);

   }
})
// checking Organisation login--------------> from database ------------------
app.post('/org', async(req,res)=>{ //org redirecct for login of school
   try{
         const email =req.body.email;
         const password =req.body.password;
    const useremail = await Organisation.findOne({email:email});

    const isMatch = await bcrypt.compare(password, useremail.password);
    
    const token =await useremail.generateAuthToken();
      console.log('the token part'+ token);
    
      res.cookie('jwt',token,{
        expires:new Date(Date.now()+600000),
        httpOnly:true,
        //secure:true
      });



    if(isMatch){
        res.status(202).render('organisation');
       
             
   }
    else{
       res.send("invalid password details");
   
   }
   }   
   catch(error){
     res.status(404).send("invalid login details");
    }
   });
// checking User login--------------> from database ------------------
app.post('/login_User', async(req,res)=>{
   try{
         const email =req.body.email;
         const password =req.body.password;
    const useremail = await User.findOne({email:email});

    const isMatch = await bcrypt.compare(password, useremail.password);
    
    const token =await useremail.generateAuthToken();
      console.log('the token part'+ token);
    
      res.cookie('jwtd',token,{
        expires:new Date(Date.now()+600000),
        httpOnly:true,
        //secure:true
      });
   
    if(isMatch){
        res.status(202).render('User');
       
             
   }
    else{
      res.send("invalid password details");
   
   }
   }  
   
     
   catch(error){
    res.status(404).send("invalid login details");
    }
   });
//-------------------------------updation work--------------------
//-----------------------------------updation of School info ---------------------
// app.post('/updateP',auth, (req,res)=>{
   
//   console.log(req.curruser.email);
    
  
//   Register.findOneAndUpdate({email:req.curruser.email}, 
//     {$set:{name : req.body.pname,
//             age : req.body.age,
//             sex : req.body.sex,
//             email : req.body.email,
//             phone : req.body.phone,
//             aadhar : req.body.Aadhar}},
//     function(err, doc){
//     if(err){
//         console.log("Something wrong when updating data!");
//     }
//     else{
//       res.render('patientv'); }
//    });
//   });

// //-----------------------------------updation of patient important info ---------------------
// app.post('/importantP',auth, (req,res)=>{
//   Register.findOneAndUpdate({email:req.curruser.email}, 
//     {$set:{info : req.body.message}},
//     function(err, doc){
//     if(err){
//         console.log("Something wrong when updating data!");
//     }
//     else{
//       res.render('patientv'); }
//    });
//   });

// //-----------------------------------updation of patient important info ---------------------
// app.post('/issue',auth, (req,res)=>{
//   Register.findOneAndUpdate({email:req.curruser.email}, 
//     {$set:{smoke : req.body.smoke,
//       drink : req.body.drink,
//       tabacco : req.body.tabacco,
//       allergy : req.body.allergy,
//       surgery : req.body.surgery
//     }},
//     function(err, doc){
//     if(err){
//         console.log("Something wrong when updating data!");
//     }
//     else{
//       res.render('patientv'); }
//    });
//   });


  //-------------------------------patient updation work  **end**--------------------

//-------------------------------doctor updation work  **start**--------------------
  
//---------------------------doctor updation info--------------------
// app.post('/updateD',dauth, (req,res)=>{
//   DRegister.findOneAndUpdate({email:req.currdoctor.email},
//     {$set:{
//       name : req.body.dname,
//       age : req.body.age,
//       sex : req.body.sex,
//       email : req.body.email,
//       phone :req.body.phone

//     }},
//     function(err,doc){
//       if(err){
//         console.log("Something wrong when updating data!");
//       }
//       else{
//         res.render('doctorv'); }
//     });
// });
// //---------------------------doctor work  updation --------------------
// app.post('/updatework',dauth, (req,res)=>{
//   DRegister.findOneAndUpdate({email:req.currdoctor.email},
//     {$set:{
//       degree : req.body.Degree,
//       specialist : req.body.specialist,
//       Experience : req.body.experience,
//       Phandle : req.body.handle
//     }},
//     function(err,doc){
//       if(err){
//         console.log("Something wrong when updating data!");
//       }
//       else{
//         res.render('doctorv'); }
//     });
// });
// //---------------------------doctor updation important --------------------
// app.post('/updateI',dauth, (req,res)=>{
//   DRegister.findOneAndUpdate({email:req.currdoctor.email},
//     {$set:{
//       dinfo : req.body.Dinfo
      
//     }},
//     function(err,doc){
//       if(err){
//         console.log("Something wrong when updating data!");
//       }
//       else{
//         res.render('doctorv'); }
//     });
// });

// //-------------------------------doctor updation work  **end**--------------------
// //----------------------------------------- Socket---------------------------
// //---------------------------------------------communication work 
// // Socket 
// const io = require('socket.io')(http)

// io.on('connection', (socket) => {
//     console.log('Connected...')
//     socket.on('message', (msg) => {
//         socket.broadcast.emit('message', msg)
//     })

// }) 


//----------comunication work done------------------------
