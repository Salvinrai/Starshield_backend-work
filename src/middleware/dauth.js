const async = require('hbs/lib/async');
const jwt = require('jsonwebtoken');

const User_Verify = require('../models/Indivisual');

const dauth = async (req,res,next) =>{
    try {

        const token = req.cookies.jwtd;

        const verifyUser = jwt.verify(token, process.env.SECRET_WAY);

        const curruser = await User_Verify.findOne({email:verifyUser._id});

        req.dtoken = token;
        req.currdoctor = curruser;
        
        next();
        
        
    } catch (error) {
        res.status (401).send(error);
       //res.render('/loginP');
    }


}

module.exports = dauth;