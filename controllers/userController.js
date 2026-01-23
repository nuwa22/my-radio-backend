import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/user.js'; 

export const login = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        
        if (!user) return res.status(404).json("User not found");

        const validPass = await bcrypt.compare(req.body.password, user.password);
        if (!validPass) return res.status(400).json("Wrong password");

        const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY, { expiresIn: '30m' }); // expiresIn 30 minuts
        
        res.json({ token, username: user.username });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};

export const register = async (req, res) => {
    try {
        
        const existingUser = await User.findOne({ username: req.body.username });
        if(existingUser) return res.status(400).json("User already exists");

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        
        
        const newUser = new User({
            username: req.body.username,
            password: hashedPassword
        });
        
        await newUser.save();
        res.status(201).json("Admin Registered!");
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};