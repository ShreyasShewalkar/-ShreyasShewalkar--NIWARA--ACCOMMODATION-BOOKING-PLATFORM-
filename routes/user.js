const express=require("express");
const router=express.Router();
const User=require("../models/user");
const wrapAsync=require("../utils/wrapAsync");
const passport=require("passport");
const userController=require("../controllers/users");



router.get("/signup",userController.userSignupForm);
router.post("/signup",userController.userSignup);
router.get("/login",userController.loginForm);
router.post("/login",passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),userController.login);
router.get("/logout",userController.logout);

module.exports=router;