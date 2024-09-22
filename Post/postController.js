const Post = require("../models/Post");
const { cloudinary } = require('../config/cloudinaryConfig');




// *****************************Create Post********************************


const createPost = async (req, res) => {

    try {

        const { content } = req.body;
        if (!content && !req.file) {
            return res.send({ message: "Content or Image is required" });
        }

        let imageUrl = "";


        if (req.file) {
            const uploadImage = await cloudinary.uploader.upload(req.file.path, {
                folder: "user_images"
            });
            imageUrl = uploadImage.secure_url;
        }

        const newPost = new Post({
            content,
            userId: req.user.id,
            imageUrl: imageUrl
        })

        await newPost.save();

        res.send({ message: "Post Created Successfully", newPost });

    } catch (error) {

        res.send({ message: error.message });
    }
}



// *******GET ALL POST BY A USER********
const getUserPosts = async (req, res) => {
    try {

        const userId = req.params.userId;

        const userPosts = await Post.find({ userId }).populate("userId", "firstName lastName profileImage");


        if (Post.length === 0) {
            return res.send({ message: "No Posts Found" });
        }

        return res.send({ userPosts });

    } catch (error) {
        res.send({
            message: error.message
        })
    }

}


const likePost = async (req, res) => {
    try {
        const postId = req.params.postId;
        const post = await Post.findById(postId);

        if (!post) {
            return res.send({ message: "Post not found" })
        }
        if (post.likes.includes(req.user.id)) {
            return res.send({ message: "Post already liked" })
        }

        post.likes.push(req.user.id);
        await post.save();
        res.send({ message: "Post liked successfully" })

    } catch (error) {
        res.send({
            message: error.message
        })
    }
}
const unLikePost = async (req, res) => {
    try {
        const postId = req.params.postId;
        const post = await Post.findById(postId);

        if (!post) {
            return res.send({ message: "Post not found" })
        }

        if (!post.likes.includes(req.user.id)) {
            return res.send({ message: "Post not liked" })
        }

        post.likes = post.likes.filter((userId) => userId.toString() !== req.user.id);

        await post.save();

        res.send({ message: "Post unLiked successfully" })

    } catch (error) {
        res.send({
            message: error.message
        })
    }
}







module.exports = { createPost, getUserPosts, likePost, unLikePost };