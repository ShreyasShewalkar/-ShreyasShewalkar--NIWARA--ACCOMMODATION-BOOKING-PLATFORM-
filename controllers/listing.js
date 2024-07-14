const Listing=require("../models/listing");
const wrapAsync=require("../utils/wrapAsync");
const {listingSchema}=require("../schema.js");

module.exports.index=async(req,res)=>{
    let allListing=await Listing.find();
    res.render("listings/index.ejs",{allListing});
    };





module.exports.newForm=(req,res)=>{
     
    res.render("listings/new.ejs");
    
};




module.exports.showListing=wrapAsync(async(req,res)=>{
    let{id}=req.params;
   const listing= await Listing.findById(id).populate({path:"review",populate:{path:"author"}}).populate("owner");
 
   res.render("listings/show.ejs",{listing});

});




module.exports.newListing=wrapAsync(async(req,res,next)=>{
    let url=req.file.path;
    let filename=req.file.filename;
    let result=listingSchema.validate(req.body);
if(result.error){
    throw new ExpressError(404,result.error);
}
 let newListing=new Listing(req.body.listing);

newListing.owner=req.user._id;
newListing.image={url,filename};
 await newListing.save();
    console.log("save to db");
    req.flash("success","new listing saved");
    res.redirect("/listing");

});



module.exports.editform=wrapAsync(async(req,res)=>{
     
    let{id}=req.params;
    let listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});

})


module.exports.editListing=wrapAsync(async(req,res)=>{
    let{id}=req.params;

    
   let listing= await Listing.findByIdAndUpdate(id,{...req.body});

    if(typeof req.file!="undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
     listing.image={url,filename};
     await listing.save();
    }


    req.flash("success","listing Updated successfully!");

 res.redirect(`/listing/${id}`);
});



module.exports.deleteListing=wrapAsync(async(req,res)=>{
     
    let{id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing deleted successfully!");

    res.redirect("/listing");


});