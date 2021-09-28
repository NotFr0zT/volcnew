const { ShardingManager, MessageEmbed, WebhookClient } = require('discord.js');
const startlogs = new WebhookClient('869905797117780018', 'k6JnhBZIhRBrBi5VWQUE2EMSS64STuYGMmtHNwBeBm6CbW3VoT6ab-afJ5KilTyWaJuH')
const shardlogs = new WebhookClient('869905948821569617', 'WQR6ZWtRCpq9v3qUdgdZCVEoLBeReY-Q4vDfRAHy4FJF0EsznZYrgb_mvpoU1jTH_0gw')
require('dotenv').config();
const manager = new ShardingManager('./bot.js', {
    totalShards: 1,
    token: process.env.TOKEN,
    respawn: true
});
console.log(`© Fr0zT Development ${new Date().getFullYear()}`)
manager.on('shardCreate', async (shard) => {
    var startshard = new MessageEmbed()
        .setTitle(`Launched shard ${shard.id}/${manager.totalShards}`)
        .setColor('BLUE')
        .setFooter('Volcania')
        .setTimestamp()
    startlogs.send({ embeds: [startshard] })
    shard.on('ready', async () => {
        var shardreadyembed = new MessageEmbed()
            .setTitle(`Shard ${shard.id} ready`)
            .setColor('GREEN')
            .setFooter('Volcania')
            .setTimestamp()
        startlogs.send({ embeds: [shardreadyembed] });
    })
    shard.on('disconnect', async (a, b) => {
        let embed = new MessageEmbed()
            .setTitle(`Shard ${shard.id} disconnected`)
            .setColor('ORANGE')
            .setFooter('Volcania')
            .setTimestamp()
        shardlogs.send({ embeds: [embed] });
    })
    shard.on('reconnecting', async (a, b) => {
        let embed = new MessageEmbed()
            .setTitle(`Shard ${shard.id} reconnecting`)
            .setColor('GREEN')
            .setFooter('Volcania')
            .setTimestamp();
        shardlogs.send({ embeds: [embed] });
    })
    shard.on('death', async (p) => {
        let embed = new MessageEmbed()
            .setTitle(`Shard ${shard.id} died`)
            .addField(`PID:`, p.pid)
            .addField(`Exitcode:`, p.exitCode)
            .setColor('RED')
            .setFooter('Volcania')
            .setTimestamp();
        shardlogs.send({ embeds: [embed] });
    })

})



manager.spawn();