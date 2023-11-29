// -----------------------------------updation of School info ---------------------
const auth = require('../middleware/auth');
const dauth = require('../middleware/dauth');

//-----------------------------models to aquire for schema---------------------
const org_R = require("../models/organisation");
const Indiv_R = require("../models/Indivisual");

app.post('/updateS',auth, (req,res)=>{
   
  console.log(req.curruser.email);
    
  
  org_R.findOneAndUpdate({email:req.curruser.email}, 
    {$set:{name : req.body.pname,
            age : req.body.age,
            sex : req.body.sex,
            email : req.body.email,
            phone : req.body.phone,
            aadhar : req.body.Aadhar}},
    function(err, doc){
    if(err){
        console.log("Something wrong when updating data!");
    }
    else{
      res.render('....'); }
   });
  });
// for delete a entry in main organisation 
  app.delete('/deleteS', auth, (req, res) => {
    const userEmail = req.curruser.email;
  
    org_R.findOneAndDelete({ email: userEmail }, (err, doc) => {
      if (err) {
        console.log("Something wrong when deleting data!");
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        if (doc) {
          res.status(200).json({ message: "School information deleted successfully!" });
        } else {
          res.status(404).json({ error: "School not found" });
        }
      }
    });
  });

  // for read a entry in main organsiation 
  app.get('/readS', auth, (req, res) => {
    const userEmail = req.curruser.email;
  
    org_R.findOne({ email: userEmail }, (err, school) => {
      if (err) {
        console.log("Something wrong when reading data!");
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        if (school) {
          res.status(200).json({ school });
        } else {
          res.status(404).json({ error: "School not found" });
        }
      }
    });
  });

  // search by email

  app.get('/searchI/:email', dauth, (req, res) => {
    const user = req.currStudent;
    const searchEmail = req.params.email;
  
    org_R.findOne({ email: searchEmail }, (err, student) => {
      if (err) {
        console.log("Something wrong when searching data!");
        res.status(500).render('error', { error: "Internal Server Error" });
      } else {
        if (student) {
          res.status(200).render('individualInfo', { student });
        } else {
          res.status(404).render('error', { error: "Individual not found" });
        }
      }
    });
  });

 // updation for indivisuals
  app.post('/updateI',dauth, (req,res)=>{
  Indiv_R.findOneAndUpdate({email:req.currStudent.email},
    {$set:{
      name : req.body.dname,
      age : req.body.age,
      sex : req.body.sex,
      email : req.body.email,
      phone :req.body.phone

    }},
    function(err,doc){
      if(err){
        console.log("Something wrong when updating data!");
      }
      else{
        res.render('....'); }
    });
});
// detion for indivisuals
app.delete('/deleteI', dauth, (req, res) => {
    const user = req.currStudent;
  
    Indiv_R.findOneAndDelete({ email: user.email }, (err, doc) => {
      if (err) {
        console.log("Something wrong when deleting data!");
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        if (doc) {
          res.status(200).json({ message: "Individual information deleted successfully!" });
        } else {
          res.status(404).json({ error: "Individual not found" });
        }
      }
    });
  });

  // read or info of indivisuals
  app.get('/readI', dauth, (req, res) => {
    const user = req.currStudent;
  
    Indiv_R.findOne({ email: user.email }, (err, student) => {
      if (err) {
        console.log("Something wrong when reading data!");
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        if (student) {
          res.status(200).json({ student });
        } else {
          res.status(404).json({ error: "Individual not found" });
        }
      }
    });
  });
//search by email for indivisuals
  app.get('/searchI/:email', dauth, (req, res) => {
    const user = req.currStudent;
    const searchEmail = req.params.email;
  
  Indiv_R.findOne({ email: searchEmail }, (err, student) => {
      if (err) {
        console.log("Something wrong when searching data!");
        res.status(500).render('error', { error: "Internal Server Error" });
      } else {
        if (student) {
          res.status(200).render('individualInfo', { student });
        } else {
          res.status(404).render('error', { error: "Individual not found" });
        }
      }
    });
  });
  


  