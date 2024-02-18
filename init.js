const mongoose = require("mongoose");

const Acc = require("./models/acc");

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/instagram");
}
main().then(()=>{
    console.log("Database Connection Successful");
}).catch((err)=>{
    console.log(err);
});

Acc.insertMany([
    {
        username: "om",
        password: "om",
    },
    {
        username: "aditya",
        password: "aditya",
        
    },
    {
        username: "aman",
        password: "aman",
        
    }
])