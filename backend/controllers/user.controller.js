import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req,res) => {
    try {
        const{fullname,email,contactno,password,role} =req.body;
        if(!fullname || !email || !contactno || !password || !role) {
            return res.status(400).json({
                message:"Something is missing",
                success:false
            });
        };
        const user =await User.findOne({email});
        if(user){
            return res.status(400).json({
                message:'User already exist with this email',
                success : false 
            })
        }
        const hashedPassword = await bcrypt.hash(password,10);

        await User.create({
            fullname,
            email,
            contactno,
            password:hashedPassword,
            role
        });
        return res.status(201).json({
            message:'Account created successfully',
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}

export const login = async (req,res) => {
    try {
        const {email,password,role} = req.body ;
        if(!email ||!password || !role) {
            return res.status(400).json({
                message:"Something is missing",
                success:false
            });
    }
    let user= await User.findOne({email});
    if(!user){
        return res.status(400).json({
            message:"incorrect email or password",
            success: false
        })
    }
    const ispasswordmatch= await bcrypt.compare(password, user.password);
    if(!ispasswordmatch){
        return res.status(400).json({
            message:"incorrect email or password",
            success: false
          });
 }
    if(role !== user.role ){
        return res.status(400).json({
            message:"Account doesn't exit with current role" ,
            success:false
        })
    };
    const tokendata = {
        userId:user._id
    }
    const token= jwt.sign(tokendata,process.env.SECRET_KEY,{expiresIn:'1d'});
    user = {
        _id:user._id,
        fullname:user.fullname,
        email:user.email,
        contactno:user.contactno,
        role:user.role,
        profile:user.profile

    }
    return res.status(200).cookie("token", token,{maxAge:1*24*60*60*1000,httpsOnly:true,sameSite:'strict'}).json({
        message:`Welcome back ${user.fullname}`,
        success:true
    })
 } catch (error) {
        console.log(error);
    }
}

export const logout =async (req,res)=> {
    try {
        return res.status(200).cookie('token',"",{maxAge:0}).json({
            message:"logout successfully",
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}

export const updateProfile = async (req,res) => {
    try {
        const {fullname,contactno,bio,skills} =req.body;
        const file = req.file;
        if(!fullname || !email || !contactno || !bio || !skills){
            return res.status(400).json({
                message:"something is missing",
                success:false
            });
        };

//Cloudinary content will come here

        const skillsarray = skills.split(",");
        const userId=req.id;  //middleware authentication
        let user = await User.findById(userId);
        
        if(!user){
            return res.status(400).json({
                message:"User not found",
                success:false
            })
        }
        user.fullname=fullname,
        user.email=email,
        user.contactno=contactno,
        user.profile.bio= bio,
        user.profile.skills=skillsarray

        // Resume content will come here , will do it later

        await user.save();

        user = {
            _id:user._id,
            fullname:user.fullname,
            email:user.email,
            contactno:user.contactno,
            role:user.role,
            profile:user.profile
    
        }
        return res.status(200).json({
            message:"profile updated successfully",
            user,
            success:true
        });
    } catch (error) {
        console.log(error);
    }
}