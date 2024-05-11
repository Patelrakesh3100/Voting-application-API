import mongoose, { Schema } from "mongoose";

const candidateSchema = new Schema({
    name : {
        type : String,
        required : true,
        unique : true
    },
    age : {
        type : Number,
        required : true,
        // validate: {
        //     validator: function(value) {
        //         const limitage = 35;
        //         return value >= limitage;
        //     },
        //     message: console.log(`Candidate enter the age not a valid age. Age must be at least 35.`)
        // }
    },
    party : {
        type : String,
        required : true
    },
    count : {
        type : Number,
        default : 0
    }
},{timestamps : true})

const Candidate = mongoose.model("Candidate",candidateSchema);

export default Candidate
