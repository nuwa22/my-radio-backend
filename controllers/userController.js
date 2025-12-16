import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// 1. මෙතන නම වෙනස් කරන්න (Small 'u' වෙනුවට Capital 'U' පාවිච්චි කරන්න)
// ෆයිල් එකේ නම user.js වුනාට කමක් නෑ, Import කරන නම User වෙන්න ඕන.
import User from '../models/user.js'; 

export const login = async (req, res) => {
    try {
        // 2. දැන් අපි Database එකෙන් හොයන්න 'User' (Capital) පාවිච්චි කරනවා.
        // ලැබෙන උත්තරේ 'user' (Simple) එකට දාගන්නවා.
        const user = await User.findOne({ username: req.body.username });
        
        if (!user) return res.status(404).json("User not found");

        const validPass = await bcrypt.compare(req.body.password, user.password);
        if (!validPass) return res.status(400).json("Wrong password");

        const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY, { expiresIn: '1d' });
        
        res.json({ token, username: user.username });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};

export const register = async (req, res) => {
    try {
        // මෙතනත් User (Capital) පාවිච්චි කරන්න
        const existingUser = await User.findOne({ username: req.body.username });
        if(existingUser) return res.status(400).json("User already exists");

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        
        // අලුත් යූසර් කෙනෙක් හදනකොටත් 'User' මොඩල් එක ගන්න
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