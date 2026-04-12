const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
    name:String,
    email:String,
    phone:String,
    password:String,
    loginStatus:Boolean,
    registeredAt: {
        type: Date,
        default: Date.now
    },
    userType: {
        type: String,
        enum: ['staff', 'customer', 'admin'],
        default: 'staff'
    }
})

const Staff = mongoose.model('Staff', staffSchema);

module.exports = Staff;
