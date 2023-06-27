const express = require("express");
const app = express();
const createError = require("http-errors");
const routes = require("./Routes/index.js");
const {PORT,HOST_NAME} = require("./api/Config/constant.js")
require("./api/Config/mongoose.config.js");
app.use(express.json())
app.use("/",routes);


app.use((req,res,next)=>{

    next(createError.NotFound());
});

app.use((err,req,res,next)=>{
    res.status(err.status|| 500);
    res.send({
        error:{
            status:err.status||500,
            message:err.message,
        }
    })
})

app.listen(PORT,HOST_NAME,(error)=>{
    if(error){
        console.log("Problem while running server")
    }else{
        console.log(`Server Running in PORT ${PORT} `);
        console.log("press ctrl + c to end ")
    }
})

