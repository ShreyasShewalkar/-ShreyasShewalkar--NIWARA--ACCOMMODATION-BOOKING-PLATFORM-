
const User=require("../models/user");
const wrapAsync=require("../utils/wrapAsync");

module.exports.userSignupForm=(req,res)=>{
    res.render("users/signup.ejs");
};


module.exports.userSignup=wrapAsync(async(req,res)=>{

    try{
let{username,email,password}=req.body;
let newUser=new User({username,email});
let registeredUser=await User.register(newUser,password);
req.login(registeredUser,(err)=>{
    if(err){
        return next(err);
    }
    req.flash("success","Welcome to Wanderlust");
res.redirect("/listing");
})

    }
catch(err){
    req.flash("failure",err.message);
    res.redirect("/signup");
}
})




module.exports.loginForm=(req,res)=>{
    res.render("users/login.ejs");
};


module.exports.login=async(req,res)=>{
    req.flash("success","Welcome back to wanderlust");


    
    res.redirect("/listing");

};


module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
if(err){
    return next(err);
}



req.flash("success","You are  Logged out successfully");
res.redirect("/listing");
    })

    
};