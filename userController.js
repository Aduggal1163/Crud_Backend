const express=require("express")
const User=require("./user.js")
const app=express();
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
const SECRET_KEY="g15-1163-ADASK";
const register=async(req,res)=>{
    try{
        let inputData=req.body;
        if(!inputData.fullname||!inputData.password||!inputData.email)
        {
            return res.json({
                status:400,
                message:"Please fill all the fields"
            })
        }
        const checkFullName=await User.findOne({'fullname':inputData.fullname});
        const checkEmail=await User.findOne({"email":inputData.email});
        const checkPassword=await User.findOne({"password":inputData.password})
        const hashedPassword=await bcrypt.hash(inputData.password,10);
    //    console.log(await bcrypt.compare(hashedPassword,inputData.password));
        if(checkEmail||checkFullName||checkPassword)
        {
            return res.json({
                status:400,
                message:"User already exists"
            })
        }

        const token=jwt.sign({password:checkPassword},SECRET_KEY);
        if(!token)
        {
            return res.json({
                status:400,
            message:"token generation error"
          })
        }

        const newUser=await User.create({...inputData,password:hashedPassword});
        return res.json({
            status:201,
            message:"User created successfully",
            data:token
        })
    }
    catch(err){
        console.log(err);
    }
}
const deleteUser=async(req,res)=>{
    try {
        const {fullname}=req.body;
        if(!fullname)
        {
            return res.json({
                status:400,
                message:"please provide fullname"
            });
        }
        const deletedUser=await User.findOneAndDelete({
            fullname
        })
        if(!deletedUser)
        {
            return res.status(400).json({
                status:400,
                message:"User not found"
            })
        }
        return res.json({
            status:200,
            message:"User deleted successfully",
            data:deletedUser
        })
    } catch (error) {
        console.log(error)
    }
}
const updateUser=async(req,res)=>{
    try {
        const {fullname,password,email}=req.body
        if(!password)
        {
            return res.json({
                status:400,
                message:"please provide password"
                });
        }
        const updateUser=await User.findOneAndUpdate(
            {password},
            {fullname,email},
            {new:true}
        )
        if(!updateUser)
        {
            return res.status(400).json({
                status:400,
                message:"User not found"
                })
        }
        return res.json({
            status:200,
            message:"User updated successfully"
        })
    } catch (error) {
        console.log(error)
        
    }
}
module.exports={register,deleteUser,updateUser};