const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Register
router.post("/register", async (req,res)=>{
    const {username,email,password} = req.body;
    let user = new User({username,email,password,followers:[]});
    await user.save();
    res.send(user);
});

// Login
router.post("/login", async (req,res)=>{
    const {email,password} = req.body;
    let user = await User.findOne({email,password});
    if(user) res.send(user);
    else res.status(401).send({error:"Invalid credentials"});
});

// Get all users
router.get("/", async (req,res)=>{
    const users = await User.find();
    res.send(users);
});

module.exports = router;