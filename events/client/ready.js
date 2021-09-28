const { Client } = require('discord.js')
const chalk = require('chalk')
/**
 * 
 * @param {Client} client 
 */
module.exports = async (client) => {
    var totalMembers = 0;

    client.guilds.cache.forEach(guild => {
        totalMembers += guild.memberCount
    })

    function logeveryguild() {
        client.guilds.cache.forEach(guild => {
            console.log(`${guild.name} (${guild.id}) with ${guild.members.cache.filter(e => e.user.bot).size} bots and ${guild.memberCount} members`)
        })
    }
    console.log(chalk.greenBright('-----------') + chalk.redBright('-----------') + chalk.yellowBright('-----------'))
    console.log(chalk.bold(chalk.blueBright(`           ${client.guilds.cache.size} guilds!`)))
    console.log(chalk.bold(chalk.blueBright(`           ${totalMembers} users!`)))
    console.log(chalk.bold(chalk.blueBright(`           ${client.commands.size} commands!`)))
    console.log(chalk.greenBright('-----------') + chalk.redBright('-----------') + chalk.yellowBright('-----------'))
    // logeveryguild()

    setInterval(function () {
        const botStatus = [
            `${client.guilds.cache.size} servers and ${totalMembers} users`,
        ];
        const status = botStatus[Math.floor(Math.random() * botStatus.length)];

        // client.user.setStatus(`${client.guilds.cache.size} servers and ${totalMembers} users`)
        client.user.setPresence({ status: 'dnd', activities: [{ type: 'WATCHING', name: status }] })
        // client.user.setPresence({ activity: { type: 'PLAYING', url: "https://www.twitch.tv/fr0zttt", name: status } });
    }, 30000);

    console.log(`Logged in as ${client.user.tag}`);

    //EXPRESS SESSION

    const clientDetails = {
        guilds: client.guilds.cache.size,
        users: client.users.cache.size,
        channels: client.channels.cache.size
    }

    const express = require('express')
    const app = express();
    const port = 3000 || 3001

    app.get('/', (req, res) => {
        res.status(200).send('Main Page')
    })

    app.get('/info', (req, res) => {
        res.status(200).send(clientDetails)
    })

    app.listen(port)
}