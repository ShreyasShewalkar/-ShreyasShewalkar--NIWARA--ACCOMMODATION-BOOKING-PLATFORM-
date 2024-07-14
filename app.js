if(process.env.NODE_ENV!="production"){
    require("dotenv").config();

    
}


const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
app.engine("ejs",ejsMate);
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
const methodOverride=require("method-override");
app.use(methodOverride("_method"));
const port=8080;    
app.use(express.urlencoded({extended:true}));
const listing=require("./routes/listing.js");
const review=require("./routes/review.js");
const user=require("./routes/user.js");
const session=require("express-session");
const MongoStore=require("connect-mongo");
const flash=require("connect-flash");
const passport=require("passport");
const localStrategy=require("passport-local");
const User=require("./models/user.js");
const dbUrl=process.env.ATLASDB_URL;
async function main(){

    await mongoose.connect(dbUrl);
}




main()
.then(()=>{
    console.log("connected to db");
})
.catch((err)=>{
    console.log(err);
});
const store=MongoStore.create({

    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
})

app.use(session({
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
}))



app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.failure=req.flash("failure");
    res.locals.error = req.flash('error');
    res.locals.currUser=req.user;
    next();
})



app.use("/",listing);
app.use("/",review);
app.use("/",user);

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"PAGE NOT FOUND"));
})

app.use((err,req,res,next)=>{
   let{status=500,message="SOMETHING WENT WRONG!"}=err;
   res.status(status).render("errors/error.ejs",{message});
})


app.listen(port,()=>{
    console.log("server is listening to port 8080");
})