const express=require("express");
var jwt=require("jsonwebtoken");
var key="ssecretkey";

const userController=require('../Controllers/userController');
const eventController=require('../Controllers/eventController');
const router=express.Router();

function verifyToken(req,res,next){
    const bearerHeader=req.headers.authorization;
    if(typeof bearerHeader !== "undefined"){
        const bearerToken=bearerHeader.split("bearer")[1];
        jwt.verify(bearerToken.trim(),key,(err,authData)=>{
            
            if(err){
                res.sendStatus(403);
            }else{
                next()
            }
        })
    }else{
        res.sendStatus(403)
    }
}

router.post("/signup",userController.signup);
router.post("/login",userController.login);
router.post("/forgetpassword",userController.forgetPassword);
router.post("/updatePassword/:id",userController.newPassword);
router.post("/postEvent",verifyToken,eventController.addEvents);
router.get("/getEvent",verifyToken,eventController.getEvents);

module.exports=router;