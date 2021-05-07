// eslint-disable-next-line no-unused-vars
const { MessageEmbed } = require('discord.js'),
    comma = require('../../modules/comma'),
    db = require('../../modules'),
    emotes = require('../../data').emotes,
    items = require('../../data/items'),
    { createEmbed } = require('../../modules/messageUtils');

module.exports = {
    name: 'buy',
    aliases: ['cop', 'purchase'],
    cooldown: 10,
    description: 'A command used to buy items/collectables/skins from the shop',
    expectedArgs: 'k/buy (item name)',
    manualStamp: true,
    execute: async(message, args) => {
        if (!args[0]) return message.reply(createEmbed(message.author, 'RED', 'What are you buying lmao'));
        const { wallet } = await db.utils.balance(message.author.id);
        if (wallet <= 0) return message.reply(createEmbed(message.author, 'RED', 'You can\'t even get thin air for an empty wallet smh'));
        const arg = args.join(' ').toLowerCase();
        const combinedArr = items.concat(items.items);
        const found = combinedArr.find(x => x.name.toLowerCase() === arg);
        if (found) {
            if (wallet < found.price) return message.reply(createEmbed(message.author, 'RED', `You do not have ${emotes.kr}${comma(found.price)} in your wallet!`));
            if (found.type === 'c') {
                await db.utils.addCollectable(message.author.id, found.id);
                await db.utils.addKR(message.author.id, -parseInt(found.price));
                message.channel.send(new MessageEmbed()
                    .setColor('GREEN')
                    .setAuthor(`Successfully purchased ${found.name}`, message.author.displayAvatarURL({ dynamic: true }))
                    .setDescription(`<@${message.author.id}> bought **${found.icon} ${found.name}** and paid ${emotes.kr}${comma(found.price)}`)
                    .setFooter('Thank you for the purchase!'));
            } else if (found.type === 'b') {
                await db.utils.addKR(message.author.id, -parseInt(found.price));
                await db.utils.getPremium(message.author.id);
                message.channel.send(new MessageEmbed()
                    .setColor('GREEN')
                    .setAuthor(`Successfully purchased ${found.name}`, message.author.displayAvatarURL({ dynamic: true }))
                    .setDescription(`<@${message.author.id}> bought **${found.icon} ${found.name}** and paid ${emotes.kr}${comma(found.price)}`)
                    .setFooter('Thank you for the purchase!'));
            } else if (found.type === 's') {
                await db.utils.addKR(message.author.id, -parseInt(found.price));
                await db.utils.addSkin(message.author.id, found.index);
                message.channel.send(new MessageEmbed()
                    .setColor('GREEN')
                    .setAuthor(`Successfully purchased ${found.name}`, message.author.displayAvatarURL({ dynamic: true }))
                    .setDescription(`<@${message.author.id}> bought **${found.icon} ${found.name}** and paid ${emotes.kr}${comma(found.price)}`)
                    .setFooter('Thank you for the purchase!'));
            } else if (found.type === 'i') {
                await db.utils.addKR(message.author.id, -parseInt(found.price));
                await db.utils.addItem(message.author.id, parseInt(found.id));
                message.channel.send(new MessageEmbed()
                    .setColor('GREEN')
                    .setAuthor(`Successfully purchased ${found.name}`, message.author.displayAvatarURL({ dynamic: true }))
                    .setDescription(`<@${message.author.id}> bought **${found.icon} ${found.name}** and paid ${emotes.kr}${comma(found.price)}`)
                    .setFooter('Thank you for the purchase!'));
            }
        } else
            message.reply(createEmbed(message.author, 'RED', 'That item does not exist?'));
        message.timestamps.set(message.author.id, Date.now());
    },
};
