const botconfig = require("./prefix.json");
const tokenfile = require("./token.json");
const Discord = require("discord.js");

const bot = new Discord.Client({disableEveryone: true});


// Checks if the bot is ready to Launch if not shown up in the logs then there is a error in the code.
bot.on("ready", async () =>{
console.log(`${bot.user.username} is online!`);
bot.user.setGame("Type $command")
});

bot.on('guildMemberAdd', member => {
   member.send("Welcome to CAMELOT public Discord!");
});


bot.on("message", async message => {
  if(message.author.bot) return;
  if(message.channel.type ==="dm") return;

  let prefix = botconfig.prefix;
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);



// This command removes all messages from all users in the channel, up to 100.
  if(cmd === `${prefix}purge`){


    // get the delete count, as an actual number.
    const deleteCount = parseInt(args[0], 10);

    // Ooooh nice, combined conditions. <3
    if(!deleteCount || deleteCount < 2 || deleteCount > 100)
      return message.reply("Please provide a number between 2 and 100 for the number of messages to delete");

    // gets message and then deletes them
    const fetched = await message.channel.fetchMessages({count: deleteCount});
    message.channel.bulkDelete(fetched)
      .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
  }


// Kick command
if(cmd === `${prefix}kick`){

//kick @user reason

let kUser = message.guild.member(message.mentions.users.first() || message.guild.member.get(args[0]));
if(!kUser) return message.channel.send("Can't find user!");
let kReason = args.join(" ").slice(22);
if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("No can do pal!");
if(kUser.hasPermission("MANAGE_MESSAGES")) return message.channel.send("That person can't be kicked!");

let kickEmbed = new Discord.RichEmbed()
.setDescription("~Kick~")
.setColor("#f70800")
.addField("Kicked User", `${kUser} with ID: ${kUser.id}`)
.addField("Kicked By", `<@${message.author.id}> with ID ${message.author.id}`)
.addField("Kicked In", message.channel)
.addField("Time", message.createdAt)
.addField("Reason", kReason);

let kickChannel = message.guild.channels.find(`name`, "incidents");
if (!kickChannel) return message.channel.send("Can not find incidents channel.");

message.guild.member(kUser).kick(kReason);
kickChannel.send(kickEmbed);


  return;
}

// Ban Command
if(cmd === `${prefix}ban`){

//Ban @user reason

  let bUser = message.guild.member(message.mentions.users.first() || message.guild.member.get(args[0]));
  if(!bUser) return message.channel.send("Can't find user!");
  let bReason = args.join(" ").slice(22);
  if(!message.member.hasPermission("MANAGE_MEMBERS")) return message.channel.send("No can do pal!");
  if(bUser.hasPermission("MANAGE_MESSAGES")) return message.channel.send("That person can't be banned!");

  let banEmbed = new Discord.RichEmbed()
  .setDescription("~Banned~")
  .setColor("#f77f00")
  .addField("Banned User", `${bUser} with ID: ${bUser.id}`)
  .addField("Banned By", `<@${message.author.id}> with ID ${message.author.id}`)
  .addField("Banned In", message.channel)
  .addField("Time", message.createdAt)
  .addField("Reason", bReason);

  let incidentchannel = message.guild.channels.find(`name`, "incidents");
  if (!incidentchannel) return message.channel.send("Can not find incidents channel.");

message.guild.member(bUser).ban(bReason);
incidentchannel.send(banEmbed);


  return;
}






// Report Command
if(cmd === `${prefix}report`){

//$Creport @user for this reason

let rUser = message.guild.member(message.mentions.users.first() || message.guild.member.get(args[0]));
if(!rUser) return message.channel.send("Could not find user.");
let reason = args.join(" ").slice(22);


//Embed for the report reason
let reportEmbed = new Discord.RichEmbed()
.setDescription("Reports")
.setColor("#5942f4")
.addField("Reported User", `${rUser} with ID: ${rUser.id}`)
.addField("Reported By", `${message.author} with ID: ${message.author.id}`)
.addField("Channel", message.channel)
.addField("Time", message.createdAt)
.addField("Reason", reason);


let reportschannel = message.guild.channels.find(`name`, "reports");
if(!reportschannel) return message.channel.send("Cound not find Reports Channel.");

// Catchs message.
message.delete().catch(O_o=>{});
reportschannel.send(reportEmbed);

  return;
}





//Command for the server you are in
  if(cmd === `${prefix}serverinfo`){

     let sicon = message.guild.iconURL;
     let serverembed = new Discord.RichEmbed()
     .setDescription("Server Information")
     .setColor("#42f4e5")
     .setThumbnail(sicon)
     .addField("Server Name", message.guild.name)
     .addField("Created On,", message.guild.createdAt)
     .addField("You Joined", message.member.joinedAt)
     .addField("Total Members", message.guild.memberCount);


    return message.channel.send(serverembed);
  }

  if(cmd === `${prefix}command`){

     let sicon = message.guild.iconURL;
     let commandembed = new Discord.RichEmbed()
     .setTitle("Command List")
     .setColor("#1cf700")
     .setThumbnail(sicon)
     .addField("Command1", "botinfo")
     .addField("Command2", "serverinfo")
     .addField("Command3", "kick")
     .addField("Command4", "ban")
     .addField("Command5", "report")
     .addField("Command6", "purge")
     .addField("More Commands", "Soon!");


    return message.channel.send(commandembed);
  }



// Information about the bot
  if(cmd === `${prefix}botinfo`){

let bicon = bot.user.displayAvatarURL;
let botembed = new Discord.RichEmbed()
.setDescription("Bot Informatiom")
.setColor("#f44242")
.setThumbnail(bicon)
.addField("Bot Name", bot.user.username)
.addField("Bot Onwer", "Prince")
.addField("Bot Created On", message.guild.createdAt);

    return message.channel.send(botembed);
  }

});

bot.login(tokenfile.token);
