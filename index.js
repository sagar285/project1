
const express = require("express");
const app = express();
const route = require("./router")
const cookieparser =require("cookie-parser");

app.use(cookieparser());  // add cookie parser package
app.use(express.json());   
app.use(express.urlencoded({extended:false}))
app.set("view engine","ejs")
const port = 3000;

app.use(route);
app.listen(port,()=>{
    console.log("our server runing on port no 3000");
})