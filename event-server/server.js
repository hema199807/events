const express=require("express");
const mongoose=require("mongoose");
var router=require("./Routes/router");
const bodyParser=require("body-parser");
var cors = require('cors');
const port=8080;
const host="localhost";
var app = express();
 
app.use(cors())
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

const dbUri=`mongodb+srv://root:38CWz9iKbRCEF8ya@cluster0.29oaz.mongodb.net/UserDb?retryWrites=true&w=majority`;
const options={
    useNewUrlParser:true,
    useUnifiedTopology:true
}
app.use("/",router);

mongoose.connect(dbUri,options).then(() =>{
    app.listen(port,()=> console.log(`server running on http://${host}:${port}`));
}).catch((err)=>{
    console.log(err);
})