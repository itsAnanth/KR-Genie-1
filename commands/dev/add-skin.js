const data = require('../../data'),
    devs = data.devs,
    staff = data.staff,
    logger = require('./modules/logger.js'),
    skins = require('../../modules/skins'),
    db = require('../../modules');
module.exports = {
    name: 'addskin',
    dev: true,
    execute: async(message, args) => {
        if (!(devs.includes(message.author.id) || staff.includes(message.author.id))) return;
        if (!args[0]) return;
        const target = await message.client.users.fetch(args[0].replace(/\D/g, '')).catch(() => {});
        if (!target) return message.channel.send('Unknown user');
        args.shift();
        const skin = args.join(' ').toLowerCase();
        const found = await skins.allSkins.find(x => x.name.toLowerCase() == skin);
        if (found == undefined) return message.channel.send('Unknown skin');
        await db.utils.addSkin(target.id, found.index);
        message.channel.send(`Successfully added \`${skin}\` to \`${target.username}\``);
        logger.commandsLog(message.author, 'addskin', `**${message.author.tag}** added \`${skin}\` to **${target.tag}**`, message.guild, args.join(' '), `Skin: ${skin}`);
    },
};
