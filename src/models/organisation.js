//requiremnets -------------------require



const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const async = require('hbs/lib/async');
const jwt =require('jsonwebtoken');
const res = require('express/lib/response');

// schema --------------registration for 
const organisation = new  mongoose.Schema({
 organisationName : {
     type:String,
     required:true
 },
 CIN_Number : {
    type:Number,
    required:true
 },
 email : {
    type:String,
    required:true,
    unique:true
 },
 Contact_no : {
    type:Number,
    required:true,
    unique:true
 },
 address : {
    type:String,
    required:true,
    
 },
 city :{
   type:String
   
 },
 State :{
   type:String
 },

 Pincode :{
   type:Number,
   required:true,
},
Stablishment_year :{
   type:Number,
   required:true,
},
 password : {
    type:String,
    required:true
 },
tokens: [{
    token :{
       type:String,
       required:true
    }
 }]
})
//---------------token generation for work modulle for authentication-------
organisation.methods.generateAuthToken = async function(){

   try{
      const token = jwt.sign({_id:this.email}, process.env.SECRET_KEY);
       this.tokens = this.tokens.concat({token:token})
      await this.save();

      return token;
   }
   catch (error){
      res.send('the error part' + error);
      console.log('the error part' + error);

   }
}
//--------------- incription of password---------------
organisation.pre('save', async function(next){
   if(this.isModified('password')){
      console.log(`this password is ${this.password}`);
      this.password = await bcrypt.hash(this.password, 10);
      console.log(`this password is ${this.password}`);
   }
   
   next();
})


// create a collection regarding your  registration

const org_registration = new mongoose.model("Organisation_details",organisation);

module.exports = org_registration;

