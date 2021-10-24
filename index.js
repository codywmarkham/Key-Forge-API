const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");

dotenv.config();

mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true}, ()=>{
    console.log("Connected to key-forge-api")
});


app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.user("/api/users", userRoute)
app.user("/api/auth", authRoute)



app.listen(3002,()=>{
    console.log("server is up")
})