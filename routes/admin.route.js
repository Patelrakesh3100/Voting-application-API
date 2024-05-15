import { Router } from "express";
import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import Candidate from "../models/candidate.model.js";

const adminRoute = Router();

//admin login via users
adminRoute.post("/login",async(req,res)=>{
    const {Aadhar_Number,password} = req.body;
    try{
        const findAdmin = await User.findOne({Aadhar_Number})
        if(findAdmin){
            bcrypt.compare(password,findAdmin.password,(err,result) =>{
                if(result){
                    res.status(200).json({success : 1, message : "Admin login success", data : findAdmin});
                }else if(err){
                    res.status(400).json({success : 0, message : "Error hashing password!",Error : err});
                }else{
                    res.status(404).json({success : 0, message : "Invalid Password!"})
                }
            })
        }else{
            res.status(404).json({success : 0, message : "Invalid Aadhar_Card_Number!"})
        }
    }catch(error){
        res.status(500).json({message : "Internal Server error",error})
    }
})

//New create Candidate 
adminRoute.post("/signup", async (req, res) => {
    const { name, age, party } = req.body;
    try {
        const findexisting = await Candidate.findOne({ name });
        if (!findexisting) {
            const checkage = req.body.age;
            if (checkage >= 35) {
                const candidateSave = await Candidate.create({ name, age, party });
                if (candidateSave) {
                    res.status(201).json({ success: 1, message: "Candidate Signup success", data: candidateSave });
                } else {
                    res.status(404).json({ success: 0, message: "Candidate not be signup!" })
                }
            } else {
                res.status(404).json({ message: "Age must be at least 35 year!" })
            }
        } else {
            res.status(404).json({ message: "Candidate already exist!" })
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error!" })
    }
})

//Update the Candidate
adminRoute.put("/update/:Aadhar_Number",async (req,res)=>{
    const { Aadhar_Number } = req.params;
    const {name} = req.body;
    const {age,party} = req.body;
    try {
        const Checkadmin = await User.findOne({Aadhar_Number});
        if(Checkadmin){
            if(Checkadmin.role === "Admin"){
                const updateCandidate = await Candidate.findOneAndUpdate({name},{age,party},{new : true});
                if(updateCandidate){
                    res.status(201).json({success : 1, message : "Candidate data Updated success", data : updateCandidate})
                }else{
                    res.status(404).json({success : 0, message : "Not Candidate exist data record!"})
                }
            }else{
                res.status(400).json({message : "You are not acciable for this data! Only admin access."})
            }
        }else{
            res.status(400).json({message : "Admin User not exist in data records!"})
        }
    } catch (error) {
        res.status(500).json({message: "Internal Server Error!",error})
    }
})

//Delete Candidate by list
adminRoute.delete("/delete/:Aadhar_Number",async (req,res)=>{
    const {Aadhar_Number} = req.params;
    const { name } = req.body;
    try {
        const Checkadmin = await User.findOne({Aadhar_Number});
        if(Checkadmin){
            if(Checkadmin.role === "Admin"){
                const cand_Delete = await Candidate.findOneAndDelete({ name });
                if(cand_Delete){
                    res.status(200).json({success : 1, message : "Candidate delete successfully.",data : cand_Delete})
                }else{
                    res.status(404).json({success : 0, message : "Candidate not found!"})
                }
            }else{
                res.status(404).json({success : 0 , message : "You are not delete the Candidate! Only for admin access"})
            }
        }else{
            res.status(400).json({message : "Admin not existed in the record!"})
        }
    } catch (error) {
        res.status(500).json({message : "Internal Server Error"})
    }
})

//Get Candidate information for name & party
adminRoute.get("/candInfo",async(req,res)=>{
    try {
        const getCandidate = await Candidate.find().select("-_id -age -count -__v -createdAt -updatedAt");
        if(getCandidate){
            res.status(200).json({success :  1, message : "list of candidates", data : getCandidate})
        }else{
            res.status(404).json({success : 0, message : "Candidate List not found"})
        }
    } catch (error) {
        res.status(500).json({message : "Internal server Error",error})
    }
})

//Get the list of candidates sorted by their vote counts.
adminRoute.get("/vote/count",async(req,res)=>{
    const findVotingCount = await Candidate.find().select("-_id -age -__v -createdAt -updatedAt");
    try {
        if(findVotingCount){
            const countByvote = findVotingCount.filter(candidate => candidate.count >= 1)
            if(countByvote){
                res.status(200).json({success : 1, message : "Voted Candidate list", data : countByvote})
            }else{
                res.status(404).json({success : 0, message : "No candidates have been voted yet!"})
            }
        }else{
            res.status(400).json({message : "Not Candidate found!"})
        }
    } catch (error) {
        res.status(400).json({message : "Internal Server Error", Error : error})
    }
})

export default adminRoute