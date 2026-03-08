const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

// Create Post
router.post("/create", async (req,res)=>{
    const {userId,content} = req.body;
    let post = new Post({userId,content,likes:[],comments:[]});
    await post.save();
    res.send(post);
});

// Get all posts
router.get("/", async (req,res)=>{
    const posts = await Post.find();
    res.send(posts);
});

// Like a post
router.post("/like/:id", async (req,res)=>{
    const post = await Post.findById(req.params.id);
    const userId = req.body.userId;
    if(!post.likes.includes(userId)){
        post.likes.push(userId);
        await post.save();
    }
    res.send(post);
});

// Comment on post
router.post("/comment/:id", async (req,res)=>{
    const post = await Post.findById(req.params.id);
    const {userId,text} = req.body;
    post.comments.push({userId,text});
    await post.save();
    res.send(post);
});

module.exports = router;

router.delete("/delete/:id/:userId", async (req,res)=>{
    const post = await Post.findById(req.params.id);
    if(post.userId === req.params.userId){
        await Post.findByIdAndDelete(req.params.id);
        res.send({message:"Post deleted"});
    }else{
        res.status(403).send({error:"Not authorized"});
    }
});

router.delete("/comment/delete/:postId/:commentIndex/:userId", async (req,res)=>{
    const post = await Post.findById(req.params.postId);
    const idx = parseInt(req.params.commentIndex);
    if(post.comments[idx].userId === req.params.userId){
        post.comments.splice(idx,1);
        await post.save();
        res.send({message:"Comment deleted"});
    }else{
        res.status(403).send({error:"Not authorized"});
    }
});