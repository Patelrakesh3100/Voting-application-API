import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    name : {
        type : String,
        required : true
    },
    age : {
        type : Number,
        required : true,
        default : 18,
        validate: {
            validator: function(value) {
                return value >= 18; // Only allows values greater than or equal to 18
            },
            message: props => `${props.value} is not a valid age. Age must be 18 or greater.`
        }
    },
    Aadhar_Number : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type :  String,
        required : true
    },
    role : {
        type : String,
        default : "Voter" //["Admin", "Voter"]
    },
    isVoted : {
        type : Boolean,
        default : false
    }
})

const User = mongoose.model("User", userSchema);

export default User