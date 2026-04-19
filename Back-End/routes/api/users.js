const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const Product=require("../../models/Product")
const Order=require("../../models/Order")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authenticateToken = require('../../middleware/auth')

//* create a user
router.post("/create", async(req, res) => { 
    try {
        const pass=req.body.password
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(pass, salt);

        const userObj = {
            fname: req.body.fname,
            lname: req.body.lname,
            email: req.body.email,
            password: hash,
            role: req.body.role ?? 'customer',
        };
        const user = new User(userObj);
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

//login a user
router.post("/login", async(req, res) => {
    try {
        const { type, email, password, refreshToken } = req.body;
        if (type == "email") {
            await handleEmailLogin(email, res, password);
        } else {
            handleRefreshTokenLogin(refreshToken, res);
        }
    } catch (error) {
        res.status(500).json({ message: "Something went wrong." });
    }
});

module.exports = router;

function handleRefreshTokenLogin(refreshToken, res) {
    if (!refreshToken) {
        res.status(401).json({ message: 'Refresh token is not defined' });
    } else {
        jwt.verify(refreshToken, process.env.JWT_SECRET, async(err, payload) => {
            if (err) {
                res.status(401).json({ message: "Unauthorized" });
                return;
            } else {
                const id = payload.id;
                const user = await User.findById(id);
                if (!user) {
                    res.status(401).json({ message: "User not found" });
                } else {
                    getUserTokens(user, res);
                }
            }
        });
    }
}

async function handleEmailLogin(email, res, password) {
    const user = await User.findOne({ email: email });
    if (!user) {
        res.status(401).json({ message: "User not found" });
    } else {
        // Step3: If user is found match password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            res.status(401).json({ message: "Password is wrong" });
        } else {
            getUserTokens(user, res);
        }
    }
}

function getUserTokens(user, res) {
    const accessToken = jwt.sign({ email: user.email, id: user._id, type: user.type },
        process.env.JWT_SECRET, { expiresIn: "1d" }
    );
    const refreshToken = jwt.sign({ email: user.email, id: user._id, type: user.type },
        process.env.JWT_SECRET, { expiresIn: "3d" }
    );
    const userObj = user.toJSON();
    userObj['accessToken'] = accessToken;
    userObj['refreshToken'] = refreshToken;
    res.status(200).json(userObj);
} 