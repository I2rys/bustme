//Dependencies
const Axios = require("Axios")
const Delay = require("delay")
const Fs = require("fs")

//Variables
const Self_Args = process.argv.slice(2)

var Self = {
    max: 0,
    valid: []
}

//Functions
async function check(dictionary, i){
    await Delay(1000)

    if(!dictionary[i]){
        return Self.max++
    }

    try{
        const response = await Axios({
            method: "GET",
            url: `${Self_Args[0]}/${dictionary[i]}`
        })
        
        if(response.status === 200 || response.status === 201 || response.status === 202 || response.status === 203 || response.status === 204){
            console.log(`${Self_Args[0]}/${dictionary[i]} - Got status 200/201/202/203/204`)
            Self.valid.push(`${Self_Args[0]}/${dictionary[i]}`)
        }

        Self.max++
    }catch{
        Self.max++
    }

    if(Self.max === dictionary.length){
        if(Self.valid.length){
            console.log(`Saving the results to ${Self_args[2]}`)
            Fs.writeFileSync(Self_args[2], Self.valid.join("\n"), "utf8")
            console.log(`Results successfully saved to ${Self_args[2]}`)
        }else{
            console.log("No valid paths found.")
        }

        console.log("Finished checking.")
        process.exit()
    }
}

//Main
if(!Self_Args.length){
    console.log("node index.js <url> <dictionary> <output>")
    process.exit()
}

if(!Fs.existsSync(Self_Args[1])){
    console.log("Invalid dictionary")
    process.exit()
}

if(!Self_Args[2]){
    console.log("Invalid output.")
    process.exit()
}

const dictionary_data = Fs.readFileSync(Self_Args[1], "utf8").replace(/\r/g, "").split("\n")

if(!dictionary_data.length){
    console.log("Dictionary data is empty.")
    process.exit()
}

console.log("Scanning the website, please wait.")
for( i = 0; i <= dictionary_data.length-1; i++ ){
    check(dictionary_data, i)
}
