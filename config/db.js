const mongoose = require("mongoose");
// const url = process.env.DB_URL;
const DB_URL='mongodb://localhost:27017/demo-be'
const db_global = "mongodb+srv://root:root@cluster0.hehv5.mongodb.net/test"
mongoose
  .connect(db_global, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("..Database Connection is Successfull..".magenta);
  })
  .catch((e) => console.log(e));