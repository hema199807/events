const mongoose=require("mongoose");
const joi=require("joi");

const eventsSchema=new mongoose.Schema({
    eventName:String,
    startTime:String,
    endTime:String
},{strict:false})

const Event=mongoose.model("event",eventsSchema);

function validate(event){
    const joiSchema=joi.object({
        eventName: joi.string().trim(true).required(),
        startTime: joi.string().trim(true).required(),
        endTime: joi.string().trim(true).required()
    }).options({abortEarly:false})
    return joiSchema.validate(event)
}

module.exports={Event,validate}
