const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
    from: String,
    to: String,
    msg: Array,
})

const Chat = mongoose.model("Chat",chatSchema);
module.exports = Chat;

// Chat.create({
//     from: "om",
//     to: "aditya",
//     msg: ["hii"],
// })
// Chat.create({
//     from: "om",
//     to: "aman",
//     msg: ["hii"],
// })
