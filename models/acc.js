const mongoose = require("mongoose");

const accSchema = new mongoose.Schema({
    username:{
        type:String,
        required: true,
        
        
    },
    password:{
        type:String,
        required: true,
    },
    email:{
        type:String,
        required: true,

    },
    msg:{
        type: Array,
    }


})

const Acc = mongoose.model("Acc",accSchema);
module.exports = Acc;