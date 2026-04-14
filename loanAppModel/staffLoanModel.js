const mongoose = require("mongoose");

const loanSchema = new mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId, ref:"Staff"},
    amount:Number, 
    loanTerm:{type:Number, default:3}, 
    loanRepayment:Number, 
    totalLiability:Number,
    loanStatus:{type:String, enum:['pending', 'processing', 'approved', 'reject'], default:'pending'},
    loanRequestDate:{type:Date, default:new Date}
})

const staffLoan = mongoose.model("staffLoan", loanSchema);

module.exports = staffLoan;
