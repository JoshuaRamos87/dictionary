
const ps = require("prompt-sync")
let http = require("https");
const prompt = ps();
let word = prompt("type word for definition ");


let options = {
    "method": "GET",
    "hostname": "api.dictionaryapi.dev",
    "path": '/api/v2/entries/en_US/',
    "headers": 
    {
        'custom': 'Custom Header Demo works'
    }
};
options["path"] += word

let req = http.request(options, function (res) {
let chunks = [];

res.on("data", function (chunk) {
    chunks.push(chunk);
});

res.on("end", function () {
        let body = Buffer.concat(chunks);
        let jsonObject = JSON.parse(body.toString())  
        
        try{
            
            if(jsonObject["title"] === "No Definitions Found")
            {
                console.log(jsonObject["title"])
                process.exit()
            }
            } catch(err){}

        for(let l = 0; l < Object.keys(jsonObject).length; l++)
            for(let i = 0; i < Object.keys(jsonObject[l]["meanings"]).length; i++)//which meaning im on
                for(let j = 0; j < Object.keys(jsonObject[l]["meanings"][i]["definitions"]).length; j++)//which def im on
                    console.log(jsonObject[l]["meanings"][i]["definitions"][j]["definition"])

    });
});

req.end();