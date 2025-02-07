const express = require("express")
const app = express()
require("dotenv").config()
const PORT = process.env.PORT
const path = require("path")
const hbs = require("hbs")
const DBURL = process.env.URL
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const cookieparer = require("cookie-parser")

app.use(cookieparer())
mongoose.connect(DBURL).then(()=>{
    console.log("DB connected...");
}).catch(err=>{
    console.log(err);
})



app.use(bodyParser())
const viewPath = path.join(__dirname,"../Templates/views")
const partialPath = path.join(__dirname,"../Templates/partials")
const publicPath = path.join(__dirname,'../public')

app.set("view engine","hbs")
app.set("views",viewPath)
hbs.registerPartials(partialPath)


app.use(express.static(publicPath))


app.use("/",require("../router/userrouter"))

app.use("/",require("../router/adminrouter"))


hbs.registerHelper("multiple",function(index,value){
    return index * value;
})



app.listen(PORT,()=>{
    console.log(`server running on port : ${PORT}`);
})