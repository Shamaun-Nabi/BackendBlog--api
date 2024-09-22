const express = require('express');
const { upload } = require("../auth/authController");
const { VerifyToken } = require("../auth/authMiddleware");
const { createPost, getUserPosts, likePost, unLikePost } = require('./postController');
const { addComment, deleteComment } = require('./commentController');
const router = express.Router();


// Post Routes

router.post('/create-post', VerifyToken, upload.single('image'), createPost);

router.get("/user/:userId", VerifyToken, getUserPosts);


// Like and Unlike Post
router.post('/:postId/like', VerifyToken, likePost);
router.post('/:postId/unlike', VerifyToken, unLikePost);



router.post('/:postId/comment', VerifyToken, addComment);
router.post('/:postId/deleteComment', VerifyToken, deleteComment);




module.exports = router;