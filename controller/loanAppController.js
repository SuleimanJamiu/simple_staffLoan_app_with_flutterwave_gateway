const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const staffLoan = require('../loanAppModel/staffLoanModel')
const Staff = require('../loanAppModel/staffModel');
const repAndSavings = require('../loanAppModel/runningLoanModel');


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

        //console.log("Login Time: ", staff.loginTime);
        // if(staff.loginStatus){
        //     return res.status(400).json({msg:"User already logged-In!"})
        // }

        const isMatch = await bcrypt.compare(password, staff.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: staff._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        newDate = new Date;
        await Staff.updateOne({email:email}, {$set:{loginStatus:true}}, {new:true});
                
        return res.status(200).json({ msg: 'Login successful', token });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


const applyLoan = async(req, res)=>{
    const {id} = req.staff;
    const {amount, loanTerm} = req.body;
    try{
        if(!amount || !loanTerm){
            return res.status(400).json({msg:"All fields are required!"});
        }

        const user = await Staff.findById(id);//query user (header data) authenticity
        if(!user){
            return res.status(400).json({msg:"User not found!"});
        }
        const hasLoan = await staffLoan.findOne({user:user._id})
        if(hasLoan){
            return res.status(401).json({msg: "Loan denied! Double application is not allowed!"});
        }
        loanTotal = (amount + (0.01*amount));
        repayment = (loanTotal/loanTerm);

        newLoan = new staffLoan({amount, loanTerm, loanRepayment:repayment, totalLiability:loanTotal, user:id})

        newLoan.save();

        return res.status(200).json({msg:`Loan created Successfully: Total Loan-amount: ${loanTotal}, 
            Total repayment: ${repayment}`});

    }catch(err){
        console.log(err);
        return res.status(500).json({msg:"Internal Server Error!"});
    }
}

const repayLoan = async(req, res)=>{
    const {id} = req.staff;
    const {repayments} = req.body;

    try{
        if(!repayments){
            return res.status(400).json({msg:"All fields are required!"});
        }

        //check users validity
        const user = await Staff.findById(id);
        if(!user){
            return res.status(400).json({msg:"User not found!"});
        }
        //check loan of the user
        const usersLoan = await staffLoan.findOne({user:user._id});
        //console.log(usersLoan)
        if(usersLoan){
            const userRepayment = await repAndSavings.findOne({user:usersLoan._id});
            userRepayment.updateOne({$push:{}})
            console.log(userRepayment)
        }
        // const actualRepayment = repayments - (repayments*0.02);
        // const actualSavings = repayments - actualRepayment;
        // const newRepayment = new repAndSavings({savingsAccount:actualSavings, 
        //     repayments:actualRepayment, loan:usersLoan._id, user:user._id});
        // await newRepayment.save();
        
        // const payee = await repAndSavings({user:id})
        // const choosePayee = await repAndSavings.findById(id);
        // repAndSavings.updateOne({user:id}, {$push:{repayments:repayments}});
        
        return res.json("Repayment Successful!")
    }catch(err){
        console.log(err);
        return res.status(500).json({msg:"Internal Server Error!"});
    }

}

module.exports = {
    staffRegistration,
    staffLogin,
    applyLoan,
    repayLoan
}