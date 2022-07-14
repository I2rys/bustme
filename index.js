"use strict";

// Dependencies
const axios = require("Axios")
const delay = require("delay")
const Fs = require("fs")

//Variables
const args = process.argv.slice(2)

var BustMe = {
    max: 0,
    valid: []
}

//Functions
async function check(path){
    await delay(1000)

    if(!path) return BustMe.max++

    try{
        const response = await axios({
            method: "GET",
            url: `${args[0]}/${path}`
        })
        
        if(response.status === 200 || response.status === 201 || response.status === 202 || response.status === 203 || response.status === 204){
            console.log(`${args[0]}/${path}`)
            BustMe.valid.push(`${args[0]}/${path}`)
        }

        BustMe.max++
    }catch{
        BustMe.max++
    }

    if(BustMe.max === dictionary.length){
        if(BustMe.valid.length){
            console.log(`Saving the results to ${args[2]}`)
            Fs.writeFileSync(args[2], BustMe.valid.join("\n"), "utf8")
            console.log(`Results successfully saved to ${args[2]}`)
        }else{
            console.log("No valid paths found.")
        }
    }
}

//Main
if(!args.length) return console.log("node index.js <url> <dictionary> <output>")
if(!Fs.existsSync(args[1])) return console.log("Invalid dictionary")
if(!args[2]) return console.log("Invalid output.")

const dictionary = Fs.readFileSync(args[1], "utf8").replace(/\r/g, "").split("\n")

if(!dictionary.length) return console.log("Dictionary data is empty.")
console.log("Scanning the website, please wait.")
for( const path of dictionary ) check(path)