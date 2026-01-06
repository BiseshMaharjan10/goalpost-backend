const RegisterUser = require("../models/userModel");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt= require("jsonwebtoken")

const sendEmail = require("../helpers/sendEmail");

const registerUser = async(req, res) =>{
    try{
    const{username, email, password} = req.body;

    if(!username || !email || !password){
        return res.status(400).json({
            message: "please fill the fields"
        })
    }
    
    const user = await RegisterUser.findOne({where:{username:username}})
    if(user){
        return res.status(400).json({
            message: `${username} already exists`
        })
        
    }

    //genereate verificTION TOKEN
    const verificationToken =  crypto.randomBytes(32).toString("hex")

    //verification token expire
    const verificationTokenExpires = new Date(Date.now() + 1 * 60 * 60 * 1000);

    
    // hashing password
    const hashedPassword = bcrypt.hashSync(password, 10)


    //passing data to model
    const createUser = await RegisterUser.create({
        username,
        email,
        password:  hashedPassword,
        verificationToken,
        verificationTokenExpires
    });

    const verifyLink = `http://localhost:3000/api/user/verify-email?token=${verificationToken}`
    await sendEmail(
        email,
        "Verify your email",
        `
        <p>click below to verify yourself</p>
        <a href = ${verifyLink}> click here to verify</a>
        `
    )


    return res.status(201).json({
        success: true,
        message: " register successfully",
        user:{
            username: createUser.username,
            email: createUser.email
        }
    })
}catch(error){
    return res.status(404).json({
        error: "user not registered ",
        error: error.message
    });

}
}

const loginUser = async(req,res) =>{
    try{
        const {email,password} = req.body
        const user = await RegisterUser.findOne({where:{email}})
        if(!user){
            return res.status(404).json({
                message: "User not found"
            })
        }
        const isvalidUser = await bcrypt.compare(password,user.password)
        if(!isvalidUser){
            return res.status(400).json({
                message:"Invalid email or password"
            })
        }

        const token = jwt.sign(
            {
                id: user.id, 
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_ID
            }
        )

        return res.status(200).json({
            success: true,
            message:"Login sccessful", token
        })


    }catch(error){
        res.status(500).json({
            message:"Error logging user",
            error: error.message
        })
    }
} 

module.exports = {
    registerUser,
    loginUser
};