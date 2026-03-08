const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("public"));

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/socialApp")
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err));

// Routes
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

// Frontend
app.get("/", (req,res)=>{
    res.sendFile(path.join(__dirname,"views","index.html"));
});

app.listen(3000,()=>console.log("Server running on http://localhost:3000"));