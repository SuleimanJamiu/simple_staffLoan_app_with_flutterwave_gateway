const mongoose = require("mongoose");

const runningLoanSchema = new mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId, ref:"Staff"},
    loan:{type:mongoose.Schema.Types.ObjectId, ref:"staffLoan"},
    repayments:[String],
    paymentDates:{type:[String], default: new Date},
    currentLiability:Number,
    savingsAccount:[String],
    savingsDates:{type:[String], default: new Date},
});

const repAndSavings = mongoose.model("repAndSavings", runningLoanSchema);

module.exports = repAndSavings;