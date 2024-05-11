import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import DBconnect from "./db/index.js";

import Userroute from "./routes/user.route.js";
import adminRoute from "./routes/admin.route.js";

dotenv.config()
const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({extended : true}))

//user route 
app.use("/user",Userroute); 

//admin route
app.use("/admin",adminRoute);

//Admin follow Candidate route
app.use("/candidate",adminRoute)


DBconnect()
    .then(
        app.listen((process.env.PORT || 8080), () => {
            console.log(`Server Running successfully : http://localhost:${process.env.PORT}`)
        })
    ).catch(
        console.log("Connection Connected Server error")
    )
