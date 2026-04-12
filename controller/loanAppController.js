const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Staff = require('../loanAppModel/staffModel');


const staffRegistration = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        if(!name || !email || !phone || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existingStaff = await Staff.findOne({ email });
        if(existingStaff) {
            return res.status(400).json({ message: 'Staff already exists' });
        }

        const hashPass = await bcrypt.hash(password, 10);

        const newStaff = new Staff({ name, email, phone, password: hashPass });
        await newStaff.save();

        return res.status(201).json({ message: 'Staff registered successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


const staffLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const staff = await Staff.findOne({ email });
        if (!staff) {
            return res.status(400).json({ message: 'Invalid credentials', });
        }

        if(staff.loginStatus){
            return res.status(400).json({msg:"User already logged-In!"})
        }

        const isMatch = await bcrypt.compare(password, staff.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: staff._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        await Staff.updateOne({email:email}, {$set:{loginStatus:true}}, {new:true});

        return res.status(200).json({ msg: 'Login successful', token });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


module.exports = {
    staffRegistration,
    staffLogin,
    //applyLoan
}