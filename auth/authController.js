const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const { cloudinary } = require('../config/cloudinaryConfig');
const jwt = require('jsonwebtoken');

// Multer Setup
const multer = require('multer');
const { storage } = require('../config/cloudinaryConfig');

const upload = multer({ storage });



// *****************************Register User********************************

const register = async (req, res) => {
    // const errors= validationResult(req);

    // if(!errors.isEmpty()){
    //     return res.status(400).json({
    //         errors:errors.array()
    //     })
    // }


    const { email, password, firstName, lastName } = req.body;

    try {
        let user = await User.findOne({ email });

        if (user) {
            res.send({
                msg: "User Already  Exits"
            })
        }

        const uploadImage = await cloudinary.uploader.upload(req.file.path, {
            folder: "user_images"
        });


        user = new User({
            email,
            password: await bcrypt.hash(password, 10),
            firstName,
            lastName,
            profileImage: uploadImage.secure_url,
        })

        await user.save();
        res.send({
            msg: "User Registered Successfully",
            user
        })

    } catch (error) {

        console.log(error
        )
        res.status(500).json({
            msg: "Server Error"
        })
    }
}


//*******************************************Login A User ****************************************** */

const login = async (req, res) => {

    const { email, password } = req.body;
    try {

        const user = await User.findOne({ email });

        if (!user) {
            res.send({
                msg: "Invalid Credentials"
            })
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
            const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" });
            const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET);
            user.refreshToken = refreshToken;
            await user.save();
            res.send({
                msg: "Login Successful",
                user,
                accessToken,
            })
        }
        else {
            res.send({
                msg: "Invalid Credentials"
            })
        }
    } catch (error) {
        res.send({
            msg: error.message
        })
    }
}


// ************************Refresh Token*******************************

const refreshToken = async (req, res) => {

    const { refreshToken } = req.body

    if (!refreshToken) {
        res.send({
            msg: "Access Denied"
        })
    }

    try {

        const user = await User.findOne({ refreshToken });

        if (!user) {
            res.send({
                msg: "Access Denied"
            })
        }


        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                return res.send({
                    msg: "Access Denied"
                })
            }

            const newAccessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
            res.send(
                {
                    accessToken: newAccessToken
                }
            )
        })
    } catch (error) {
        res.send({
            msg: error.message
        })
    }
}


// ****************************************Get profile By ID**************************************

const getProfile = async (req, res) => {
    try {

        const userId = req.params.id;
        const user = await User.findById(userId);

        if (!user) {
            res.send({
                msg: "User Not Found"
            })
        }


        res.send({
            msg: "Profile Found",
            user
        })



    } catch (error) {

        res.send({
            msg: error
        })
    }
}


// ***********************Update Profile*****************************************
const updateProfile = async (req, res) => {

    try {

        const userId = req.params.id;

        if (req.user.id != userId) {
            return res.send({
                msg: "You can only Update Your Profile"
            })
        }

        let user = await User.findById(userId);

        const { firstName, lastName } = req.body;
        if (firstName) {
            user.firstName = firstName
        }
        if (lastName) {
            user.lastName = lastName
        }

        if (req.file) {
            const uploadImage = await cloudinary.uploader.upload(req.file.path, {
                folder: "user_new_images"
            })

            user.profileImage = uploadImage.secure_url
        }

        await user.save();


        res.send({
            msg: "success",
            user
        })
    } catch (error) {
        res.send({
            msg: "Sever Error"
        })
    }
}





module.exports = { register, upload, login, refreshToken, getProfile, updateProfile }
