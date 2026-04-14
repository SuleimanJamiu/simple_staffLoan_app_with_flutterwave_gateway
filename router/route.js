const express = require('express'); 
const { staffRegistration, staffLogin, applyLoan, repayLoan } = require('../controller/loanAppController');
const authMiddleware = require('../authentication/loginMiddleware');
const router = express.Router();

router.post('/signUp', staffRegistration);
router.post('/login', staffLogin);
router.post('/apply', authMiddleware, applyLoan); 
router.post('/repay', authMiddleware, repayLoan); 

console.log('Router is set up');

module.exports = router;
