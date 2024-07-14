const Review=require("../models/review");
const Listing=require("../models/listing");
const wrapAsync=require("../utils/wrapAsync");
const ExpressError=require("../utils/ExpressError.js"); 
const {listingSchema,reviewSchema}=require("../schema.js");

module.exports.createReview=wrapAsync(async(req,res,next)=>{

    let result=reviewSchema.validate(req.body);
    if(result.error){
        throw new ExpressError(404,result.error);
    }


    let{id}=req.params;
    let listing= await Listing.findById(id);
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    listing.review.push(newReview);
    await newReview.save();
    await listing.save();
    console.log(req.body.review);
    req.flash("success","review saved!");

    res.redirect(`/listing/${id}`)

});



module.exports.deleteReview=wrapAsync(async(req,res)=>{

    let{id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{review:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review deleted successfully!");
    
    res.redirect(`/listing/${id}`);
    
    });