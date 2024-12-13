const express=require("express")
const mongoose=require("mongoose")
const app=express()
const {register,deleteUser,updateUser}=require("./userController.js")


const jwt=require("jsonwebtoken")
const SECRET_KEY="g15-1163-ADASK";

app.use(express.json())


const username = 'abhishekduggal04';
const password = 'abhishekd2';
const url = `mongodb+srv://${username}:${password}@cluster0.l2qopy3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
mongoose.connect(url,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(()=>{
    console.log("Connected to MongoDB")
})
.catch((error)=>{
    console.log(error)
})
const authorize = (req, res, next) => {
    const token = req.headers["authorization"];
    if (!token) return res.status(401).send("Unauthorized");

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            status: 401,
            message: "Invalid Token"
        });
    }
};
app.get("/features",authorize,(req,res)=>{
    res.send("Features");
})
app.post("/register",register);
app.delete("/deletee",deleteUser);
app.post("/update",updateUser);

app.listen(3333,()=>{
    console.log("Server is running on port 3333")
})