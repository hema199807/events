const {Event,validate}=require("../Model/events");


exports.getEvents=(req,res,next)=>{
   
    Event.find().then((response)=>{
        res.status(200).json({data:response})
    }).catch((err)=>{
        res.status(500).json({message:err})
    })
    
}



exports.addEvents= (req,res,next)=>{
    const {error}=validate(req.body);
    if(error) return res.status(400).json({errorMessage:error.details.map(err=>err.message)})
    
    var addNewEvent=new Event({
        eventName:req.body.eventName,
        startTime:req.body.startTime,
        endTime:req.body.endTime
    }).save().then(result=>{
        res.status(200).json({message:"Event added successfully",eventsList:result})
    }).catch((err)=>{
        console.log(err);
    })
}