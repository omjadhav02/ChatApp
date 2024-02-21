//Express
const express = require("express");
const app = express();

app.listen(1000,()=>{
    console.log("Server Working");
});

//Mongodb Connection
const mongoose = require("mongoose");


if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}

let uri = process.env.ATLAS_URL;


async function main(){
    await mongoose.connect(uri);
}
main().then(()=>{
    console.log("Database Connection Successful");
}).catch((err)=>{
    console.log(err);
});
const Acc = require("./models/acc.js");



//Addtional 
const path = require("path");
app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");

app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));

const methodOverride = require("method-override");
app.use(methodOverride("_method"));

const passwordHash = require("password-hash");


//ROUTES

app.get("/",(req,res)=>{
    res.render("root.ejs");
})

app.get("/login",(req,res)=>{
    res.render("login.ejs");
})
app.get("/signup",(req,res)=>{
    res.render("signUp.ejs");
})

app.delete("/:id",async(req,res)=>{
    let {id} = req.params;
    let deleteAcc = await Acc.findByIdAndDelete(id);
    let deleteChatFrom = await Chat.findOneAndDelete({from:deleteAcc.username});
    let deleteChatTo = await Chat.findOneAndDelete({to:deleteAcc.username});
    console.log(deleteAcc);
    res.redirect("/signUp");
})

//Home - Sign up
app.post("/home",async(req,res)=>{
    let {username, email, password} = req.body;
    let hashedPass = passwordHash.generate(password);
    // console.log(hashedPass);
    const User = new Acc({
        username: username,
        email: email,
        password: hashedPass,
    }); 

    User.save().then((data)=>{
        console.log("data saved");
    }).catch((err)=>{
        console.log(err);
    })
    
    let user = await Acc.find({username: User.username});
    console.log(user);
    if(user.length > 1){  
        console.log("Try another username");
        // console.log(user);
        let delUser = await Acc.findByIdAndDelete(User._id);
        
        console.log(delUser);
        
        res.redirect("/signup");
    }else{
        let userOne = User;
        res.render("home.ejs",{userOne});
    }
})

//Home - Login
app.post("/home/login",async(req,res)=>{
    try{
        let {username, password} = req.body;
        let userOne = await Acc.findOne({username:username});
        if(userOne){
            let pass = passwordHash.verify(password,userOne.password);
            if(pass){
                console.log("Login successful")
                res.render("home.ejs",{userOne});
            }else{
                console.log("not found!");
                res.redirect("/login");
                return;
            }
        }
        else{
            console.log("not found!");
            res.redirect("/login");
        }
    }catch(e){
        console.log(e);
    }
    
})

//All - Users
app.get("/home/:id",async(req,res)=>{
    try{
        let {id} = req.params;
        let userOne = await Acc.findById(id);
        let accs = await Acc.find();
        // console.log(accs)
        res.render("allusers.ejs",{accs ,userOne});
        
    }catch(e){
        console.log(e);
    }
})

const Chat = require("./models/chatboxSchema.js");

//Chatbox
app.get("/:id/:from",async(req,res)=>{
    try{
        let {id} = req.params;
        let {from} = req.params;
        // console.log(id);
        // console.log(from);

        let user = await Acc.findById(id);
        // console.log(user.username);

        let findBoth = await Chat.findOne({from:from, to:user.username});
        // console.log("wroking here",findBoth);

        let findAlterBoth = await Chat.findOne({from:user.username, to: from});
        // console.log("working here",findAlterBoth);

        let newChat = {};
        if(findBoth){
            console.log("FIND BOTH -> Schema is already Created!");
        }
        else if(findAlterBoth){
            console.log("FIND ALTER BOTH -> Schema is already Created!");
            
        }
        else{
            newChat = new Chat({
                from: from,
                to: user.username,
                
            })
            newChat.save().then((data)=>{
                console.log("New Schema Created!");
            }).catch((e)=>{
                console.log(e);
            })
        }
        

        res.render("chatbox.ejs",{findBoth, findAlterBoth,user,from});
    }catch(e){
        console.log(e);
    }
    
})


//
app.patch("/chat/:receiver/:sender",async(req,res)=>{
        let {receiver,sender} = req.params;
        let {msg} = req.body;
        console.log(msg);
        
 
        let rec = await Acc.findById(receiver);

        console.log(rec.username);
        console.log(sender);

        if(await Chat.findOne({from:sender,to:rec.username})){
            Chat.updateOne({from:sender,to:rec.username},{$push:{msg: msg}}).then(()=>{
                console.log("from : ",sender);
                console.log("to : ",rec.username);
                console.log("Chat saved!");
            }).catch((e)=>e);
        }
        else if(await Chat.findOne({from:rec.username,to:sender})){
            Chat.updateOne({from:rec.username,to:sender},{$push:{msg: msg}}).then(()=>{
                console.log(sender);
                console.log(rec.username);
                console.log("Chat saved!");
            }).catch((e)=>e);
        }
    res.redirect(`/${receiver}/${sender}`);
    
})
