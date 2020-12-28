const express = require('express');
const router = express.Router();
const {check,validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');

const User = require('../models/user');

router.post('/',[
    check('email','Please enter valid email').isEmail(),
    check('password','Password is Required').exists(),
],async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    const {email,password} = req.body;

    try{
        let user = await User.findOne({email: email});
        if(!user){
            return res.status(400).json({errors: [{msg: 'Invalid Credentials'}]});
        }

        const isMatch = await bcrypt.compare(password,user.password);

        if(!isMatch){
            return res.status(400).json({errors: [{msg: 'Invalid Credentials'}]});
        }

        const  payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(payload,config.get('jwtSecret'),{expiresIn: 360000},(err,token) => {
            if(err){
                throw err;
            }
            res.json({token: token})
        });

    }catch (err) {
        console.error(err.toString());
        return res.status(500).send('Server error');
    }


});

module.exports = router;