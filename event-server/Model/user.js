const mongoose=require("mongoose");
const joi=require("joi");

const userSchema=new mongoose.Schema({
    UserName:String,
    Email:String,
    Password:String,
    ConfirmPassword:String
},{strict:false})

const User=mongoose.model("userevent",userSchema);

function validate(user){
    const joiSchema=joi.object({
        UserName: joi.string().min(3).max(25).trim(true).required(),
        Email: joi.string().email({ minDomainSegments: 1, tlds: { allow: ['com'] } }).trim(true).required(),
        Password: joi.string().min(8).trim(true).regex(/[a-zA-Z!@#\$%\^&\*0-9]{8,20}/).required(),
        ConfirmPassword:joi.string().valid(joi.ref('Password')).required(),
    }).options({abortEarly:false})
    return joiSchema.validate(user)
}

module.exports={User,validate}
