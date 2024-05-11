import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const DBconnect = async() => {
    try{
        const connectedDB = mongoose.connect(`${process.env.DB_URL}/${process.env.DB_NAME}`)
        console.log(`DataBase server Connected success : ${((await connectedDB).connection.host)}`)
    }catch(error){
        console.log("DataBase connection failed!", error);
    }
}

export default DBconnect