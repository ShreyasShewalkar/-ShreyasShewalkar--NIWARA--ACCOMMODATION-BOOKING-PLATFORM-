const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const Listing=require("../models/listing.js");
const{isLoggedIn,isOwner}=require("../middlewares.js");
const listingController=require("../controllers/listing.js");
const multer=require("multer");
const{storage}=require("../cloudConfiq.js");
const upload=multer({storage});

const path=require("path");


router.get("/listing",wrapAsync(listingController.index));
router.get("/listing/new",isLoggedIn,listingController.newForm);
router.get("/listing/:id",listingController.showListing);
router.post("/listing",upload.single("listing[image]"),listingController.newListing);
router.get("/listing/:id/edit",isLoggedIn,isOwner,listingController.editform);
router.put("/listing/:id",isLoggedIn,isOwner,upload.single("image"),listingController.editListing);
router.delete("/listing/:id",isLoggedIn,isOwner,listingController.deleteListing);

module.exports=router;
