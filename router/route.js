const express = require('express'); 
const { staffRegistration, staffLogin } = require('../controller/loanAppController');
const authMiddleware = require('../authentication/loginMiddleware');
const router = express.Router();

router.post('/signUp', staffRegistration);
router.post('/login', staffLogin);
//router.post('/applyLoan', applyLoan); 

console.log('Router is set up');

module.exports = router;
