const express = require('express');
const {check, body}=require('express-validator/check')

const User=require('../models/user')

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/signup',authController.getSignup)
router.get('/login', authController.getLogin);

router.post('/signup',
[
check('email')
.isEmail()
.withMessage('Please enter a valid email')
.custom((value,{req})=>{
   return User.findOne({ email: value })
    .then(userDoc => {
      if (userDoc) {
        return Promise.reject("E-Mail already exists!");
      }
    })
})
.normalizeEmail(),
 
body(
    'password',
    'Please enter a password with alphanumeric characters only and at least 5 characters'
    )
.isLength({min:5})
.isAlphanumeric()
.trim(),

body('confirmPassword')
.trim()
.custom((value,{req})=>{
    
    if(value!==req.body.password){
        throw new Error("Password did not match");
    }
    return true;
})
],
authController.postSignup);


router.post('/login',
[
  body('email')
  .isEmail()
  .withMessage('Please enter a valid email address.')
   .normalizeEmail(),

   body('password','Invalid Password.')
    .isLength({min:5})
    .isAlphanumeric()
    .trim()

] ,
authController.postLogin);


router.post('/logout', authController.postLogout);

module.exports = router;