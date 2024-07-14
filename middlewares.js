const Listing=require("./models/listing");
const Review=require("./models/review");

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash("failure","You must be logged in to make changes!");
       return res.redirect("/login");
    }
    next();
}


module.exports.isOwner=async(req,res,next)=>{
let {id}=req.params;
    let listing=await Listing.findById(id);
        if(!listing.owner._id.equals(req.user._id)){
            req.flash("failure","you dont have permission to make changes");
            return res.redirect(`/listing/${id}`);
        }
        next();

}


module.exports.isReviewAuthor=async(req,res,next)=>{
    let {id,reviewId}=req.params;
        let review=await Review.findById(reviewId);
            if(!review.author._id.equals(req.user._id)){
                req.flash("failure","you dont have permission to make changes");
                return res.redirect(`/listing/${id}`);
            }
            next();
    
    }