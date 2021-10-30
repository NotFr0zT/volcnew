console.clear();
console.log(`© Fr0zT Development ${new Date().getFullYear()}`)
require('dotenv').config();
const fs = require('fs')
const { Client, Collection, Intents, MessageEmbed } = require('discord.js');
const mongoose = require('mongoose')
const userdb = require('./models/userdb')
const client = new Client({
    allowedMentions: { parse: ['users', 'roles'], repliedUser: false },
    partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'GUILD_MEMBER'],
    intents: [
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_MESSAGE_TYPING,
        Intents.FLAGS.DIRECT_MESSAGE_TYPING,
    ]
})

mongoose.connect(process.env.MONGO, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});

// ye no
client.commands = new Collection();
client.slash = new Collection();
client.aliases = new Collection();
client.snipes = new Map();
client.color = '#f56942'
client.config = require('./config.json');
client.error = async (text, message) => {
    let embed = new MessageEmbed()
        .setColor('RED')
        .setDescription(':x: | ' + text)
        .setFooter('Something went wrong.')
    await message.reply({ embeds: [embed] })
}
client.main = async (text, message) => {
    let embed = new MessageEmbed()
        .setColor(userinfo.color)
        .setDescription(text)
    await message.reply({ embeds: [embed] })
}

const eventsDir = `./` + `/events`;
if (!fs.existsSync(eventsDir) || !fs.lstatSync(eventsDir).isDirectory())
    throw new Error(`Could not find events directory! (should be in './events')`);

for (const category of fs.readdirSync(`./` + `/events`)) {
    const categoryPath = `./` + `/events/` + category;
    if (!fs.lstatSync(categoryPath).isDirectory()) continue;
    for (const eventName of fs.readdirSync(categoryPath)) {
        if (!eventName.endsWith(`.js`)) continue;
        const eventHandler = require(`./events/` + category + `/` + eventName);

        client.on(eventName.split(`.`)[0], eventHandler.bind(null, client));
    }
}

['command']?.forEach(h => {
    require(`./handlers/${h}`)(client);
});

if (client.config.slash === true) {
    require('./handlers/slashcommand')(client)
}

client.login(process.env.TOKEN);