const express = require('express');
const colors = require('colors');
const bodyparser=require('body-parser');
const cookieParser=require('cookie-parser');
const cors = require('cors')
const app = express();
const productRouter = require('./router/product')
const port = process.env.PORT || 9001;
require("./config/db")
app.use(bodyparser.urlencoded({extended : false}));
app.use(bodyparser.json());
app.use(cors()) 
app.use(cookieParser());
app.use(express.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
  });
app.use("/api/product", productRouter);


app.listen(port, () => {
    console.log("server is started at port: ".bold.brightYellow+ `${port}`.brightYellow)
})