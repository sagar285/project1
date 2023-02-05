const jwt =require("jsonwebtoken");
const usermodel =require("./database");

const auth =async(req,res,next)=>{
    try {
        const token=req.cookies.jwt;
        const verify =jwt.verify(token,process.env.KEY);
        console.log(verify);
        const user = await usermodel.findOne({_id:verify._id})
        console.log(user);
        req.token =token;
        req.user=user;
        next();
    } catch (error) {
        res.status(400).send(error);
    }
}

module.exports =auth;