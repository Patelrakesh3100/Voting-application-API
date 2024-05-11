import { Router } from "express";
import User from "../models/user.model.js";
import Candidate from "../models/candidate.model.js";
const Userroute = Router();

//User created/ Register 
Userroute.post("/signup", async (req, res) => {
    const { name, age, Aadhar_Number, password, role } = req.body;

    try {
        const existingUser = await User.findOne({ Aadhar_Number });
        if (!existingUser) {
            const userCreate = await User.create({ name, age, Aadhar_Number, password, role });
            res.status(201).json({ success: 1, message: "User Data is created", data: userCreate })
        } else {
            res.status(404).json({ success: 0, message: "User already signup in this account" })
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", Error: error });
    }
})

//login the user
Userroute.post("/login", async (req, res) => {
    const { Aadhar_Number, password } = req.body;
    try {
        const findUser = await User.findOne({ Aadhar_Number });
        if (findUser) {
            const isvalidpassCheck = findUser.password === password
            if (isvalidpassCheck) {
                res.status(200).json({ success: 1, message: "User login success", data: findUser })
            } else {
                res.status(404).json({ success: 0, message: "Invalid Password!" })
            }
        } else {
            res.status(404).json({ success: 0, message: "Invalid Aadhar_card_Number" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error })
    }
})

//Get the user's profile information
Userroute.get("/info/:Aadhar_Number", async (req, res) => {
    const { Aadhar_Number } = req.params;
    try {
        const UserInformation = await User.findOne({ Aadhar_Number });
        if (UserInformation) {
            res.status(200).json({ success: 1, data: UserInformation })
        } else {
            res.status(404).json({ success: 0, message: "User Not Found" })
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server error", error })
    }
})

//Change the user's password.
Userroute.put("/changepass/:Aadhar_Number", async (req, res) => {
    const { Aadhar_Number } = req.params;
    const { password } = req.body;
    try {
        const checkUser = await User.findOne({ Aadhar_Number })
        if (checkUser) {
            const updatePass = await User.findOneAndUpdate({ Aadhar_Number }, { password }, { new: true });
            if (updatePass) {
                res.status(201).json({ success: 1, message: "User Password is Updated", data: updatePass })
            } else {
                res.status(404).json({ success: 0, message: "Ohh Password not be changed!" })
            }
        } else {
            res.status(400).json({ message: "User not found!" })
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error })
    }
})

// Vote the candidate
Userroute.post("/vote", async (req, res) => {
    const { Aadhar_Number, Candidate_name } = req.body;
    try {
        if (!Aadhar_Number || !Candidate_name) {
            return res.status(404).json({ message: "Voter is enter the Aadhar_Number & Candidate_name" })
        }

        const CheckUserVote = await User.findOne({ Aadhar_Number })
        if (!CheckUserVote) {
            return res.status(404).json({ message: "User not found" })
        }
        if (CheckUserVote.isVoted) {
            return res.status(400).json({ success: "User Already voted. so only one time vote the user" });
        }

        if (CheckUserVote.role === "Voter") {
            CheckUserVote.isVoted = true;
            await CheckUserVote.save()
        } else {
            return res.status(404).json({ message: "Admin not be voted!" });
        }

        const candidate = await Candidate.findOne({ name : Candidate_name });
        if (!candidate) {
            return res.status(404).json({ message: "Candidate not found" })
        }

        candidate.count = (candidate.count || 0) + 1;
        await candidate.save();

        return res.status(200).json({ message: "Vote successfully" })

    } catch (error) {
        console.log("Error : " + error)
        return res.status(500).json({ message: "Internal Server error" })
    }
})

export default Userroute