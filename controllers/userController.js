const RegisterUser = require("../models/userModel");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

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
        message: " register successfully",
        user:{
            username: createUser.username,
            email: createUser.email
        }
    })
}catch(error){
    return res.status(404).json({
        errror: "user not registered ",
        error: error.message
    });

}
}


module.exports = {registerUser};