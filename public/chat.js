const mongoose = require("mongoose");



const Chat = require("./models/chatboxSchema.js");



let btn = document.querySelector("button");
let inp = document.querySelector("input");
let h4 = document.querySelector("h4");
console.log(inp.value);
    

    b.addEventListener("click",()=>{
        console.log("working");
        let p = document.createElement("p");
        p.className="text-msg"
        // p.setAttribute("name","msg");
        p.innerText = inp.value;
        h4.append(p);
        inp.value = "";
                
        Scrolling
        window.setInterval(function() {
            let elem = document.querySelector('.textarea');
            elem.scrollTop = elem.scrollHeight;
        }, 250);
    
    })


        