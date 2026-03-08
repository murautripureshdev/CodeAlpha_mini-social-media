const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    userId:String,
    content:String,
    likes:[String],
    comments:[{
        userId:String,
        text:String
    }]
});

module.exports = mongoose.model("Post",postSchema);