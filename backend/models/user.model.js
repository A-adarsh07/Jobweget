import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    fullname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        Unique:true
    },
    contactNumber:{
        type:Number,
        required:true
    },
    password:{
        type:Number,
        required:true
    },
    role:{
        type:String,
        enum:['Candidate','Recuiter'],
        required:true
    },
    profile:{
        bio:{type:String},
        skills:{type:String},
        resume:{type:String},
        resumeOriginalName:{type:String},
        company:{type:mongoose.Schema.Types.ObjectId,ref:'Company'}, //Only for candidate
        profilePhoto:{
            type:String,
            default: ""
        }
        },
    
},{timestamps:true});

export const User = mongoose.model('User',userSchema);