const mongoose = require("mongoose");
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');
const timespan = require("jsonwebtoken/lib/timespan");
const salt=10;
const userSchema = new mongoose.Schema({
  u_name: {
    type: String,
    required: true,
  },
  u_password: {
    type: String,
    required: true,
  },
  u_email: {
    type: String,
    required: true,
  },
  u_pic: {
    type: String,
    required: true,
  },
  u_phone: {
    type: Number,
    required: true,
  },
  u_token: {
    type: String,
  },
  created_at: {
    type: Date
  }, 
  updated_at:{
    type: Date
  }
});



userSchema.pre('save',function(next){
    console.log("----before save")
    var user=this;
    
    if(user.isModified('u_password')){
        bcrypt.genSalt(salt,function(err,salt){
            if(err)return next(err);

            bcrypt.hash(user.u_password,salt,function(err,hash){
                if(err) return next(err);
                user.u_password=hash;
                next();
            })

        })
    }
    else{
        console.log("-----cppptttttttp")
        next();
    }
});
userSchema.methods.comparepassword= async function(u_password,cb){
    console.log("-----cpppp")
    bcrypt.compare(u_password,this.u_password,function(err,isMatch){
        if(err) return cb(next);
        cb(null,isMatch);
    });
}

module.exports = mongoose.model("User", userSchema);