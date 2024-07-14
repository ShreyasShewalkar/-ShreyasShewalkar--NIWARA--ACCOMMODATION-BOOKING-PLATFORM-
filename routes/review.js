const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const Review=require("../models/review.js");
const Listing=require("../models/listing.js");
const{isLoggedIn,isOwner,isReviewAuthor}=require("../middlewares.js");
const reviewController=require("../controllers/reviews.js");


router.post("/listing/:id/review",isLoggedIn,reviewController.createReview);
router.delete("/listing/:id/review/:reviewId",isLoggedIn,isReviewAuthor,reviewController.deleteReview);

module.exports=router;