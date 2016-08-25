var mongoose    =   require("mongoose");
var Accelerators = mongoose.model('Accelerators',new mongoose.Schema({
    "name" : {type : String,unique: true},
    "description":String,
    "website" : String,
    "location" : String,
    "ceo" : String,
    "email" : String,
    "logo" : String,
    "twitter" : String,
    "country" : String,
    "category" : String,
    "normalized": String
}));



module.exports = Accelerators;
