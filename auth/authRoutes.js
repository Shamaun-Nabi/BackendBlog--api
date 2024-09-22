const express = require('express');
const { check } = require('express-validator');
const { register, upload, login, refreshToken, getProfile, updateProfile } = require("./authController.js");
const router = express.Router();
const { VerifyToken } = require("./authMiddleware.js")



router.post('/register', upload.single('profileImage'), register);
router.post('/login', login);




// Refresh Token
router.post('/refresh-token', refreshToken);


// Get User By Id

router.get('/profile/:id', VerifyToken, getProfile);
// Update Profile
router.patch('/profile/update/:id', VerifyToken, updateProfile)



module.exports = router;