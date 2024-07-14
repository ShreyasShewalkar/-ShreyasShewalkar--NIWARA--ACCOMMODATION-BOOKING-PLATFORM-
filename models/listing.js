const mongoose=require("mongoose");
const review=require("./review");
const { string } = require("joi");
const listingSchema=new mongoose.Schema({
title:{
    type:String,
    required:true
},
description:{
    type:String
},
image:{
   url:String,
   filename:String,
},
price:{
    type:Number
},
location:String,
country:String,
review:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Review"
}],
owner:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
}
})


listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await review.deleteMany({_id:{$in:listing.review}});
    }
})

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;

