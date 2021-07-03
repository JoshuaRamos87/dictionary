
const mySecret = process.env['TOKEN']
const Discord = require("discord.js");
const http = require("https");
const client = new Discord.Client();


client.on("ready", () => {
  console.log(`Logged in as
  ${client.user.tag}!`)
});
client.on("message", msg => {
    
    if(msg.author.bot) return;

    try{
      if(msg.toString().includes("$define"))
      {
        let word ="";
        for(let i = 1; msg.toString().split(" ")[i] !== undefined; ++i)
          word = word + msg.toString().split(" ")[i].toLowerCase() + "%20";
      
        console.log(word)

        findWord(word,msg,1)
        word = "";
      }
      else if(msg.toString().includes("$synonym"))
      {
        let word ="";
        for(let i = 1; msg.toString().split(" ")[i] !== undefined; ++i)
          word = word + msg.toString().split(" ")[i].toLowerCase() + "%20";

        console.log(word)

        findWord(word,msg,2)
        word = "";
      }
      else if(msg.toString().includes("$help"))
      {
         msg.channel.send(`$define word`);
         msg.channel.send(`$synonym word`);

      }
    }
    catch(err){}

});
client.login(mySecret);


function displaySyn(jsonObject,msg)
{
            for(let l = 0; l < Object.keys(jsonObject).length; l++)
              for(let i = 0; i < Object.keys(jsonObject[l]["meanings"]).length; i++)
                  for(let j = 0; j < Object.keys(jsonObject[l]["meanings"][i]["definitions"]).length; j++)
                    for(let n = 0; n < Object.keys(jsonObject[l]["meanings"][i]["definitions"][j]["synonyms"]).length; n++)
                      msg.channel.send("- " + jsonObject[l]["meanings"][i]["definitions"][j]["synonyms"][n]);
}

function displayDef(jsonObject,msg)
{
  for(let l = 0; l < Object.keys(jsonObject).length; l++)
              for(let i = 0; i < Object.keys(jsonObject[l]["meanings"]).length; i++)
                  for(let j = 0; j < Object.keys(jsonObject[l]["meanings"][i]["definitions"]).length; j++)
                      msg.channel.send("- " + jsonObject[l]["meanings"][i]["definitions"][j]["definition"])

}


function findWord(word,msg,choice)
{

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
              
              if(jsonObject["title"] === "No Definitions Found"){
                  msg.channel.send(jsonObject["title"])
                  return
              }
              

          switch(choice)
          {
            case 1: displayDef(jsonObject,msg); break;
            case 2: displaySyn(jsonObject,msg); break;
            
          }
          } catch(err){}
      });

  });

  req.end();
}