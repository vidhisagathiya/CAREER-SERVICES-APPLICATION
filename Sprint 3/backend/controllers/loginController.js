const User = require('../models/users');
const bcrypt = require('bcrypt');

const login = async (req,res) => {  
    try{
    const {email, password}=req.body;
    const userExist = await User.findOne({email})
    if(!userExist){
        return res.status(400).json({
            success:false,
            message: "E-mail doesn't exist",
            value:userExist,
            Received:req.body
        })
    }

    const isPasswordValid = await bcrypt.compare(password, userExist.password);

    if(!isPasswordValid) 
    {   
        return res.status(400).json({
            success:false,
            message:"Wrong Password"
        })
    }
    
        res.status(200).json({
            success: true,
            status: 'success',
            data: {
                userExist
            }
        })
    }catch(error){
        res.status(406).json({
            success: false,
            status:'fail',
            message: error
        })
    }
};

module.exports = {login};