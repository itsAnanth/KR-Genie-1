const data = require('../../data');
const { MessageEmbed } = require('discord.js');
const db = require('../../modules/'),
    comma = require('../../modules/comma'),
    utils = require('../../modules/utils'),
    notify = require('../../modules/notification');

module.exports = {
    name: 'rob',
    aliases: ['steal'],
    cooldown: 120,
    execute: async(message, args) => {
        if (!args[0]) return message.reply('Who are we robbing?');
        const target = await message.guild.members.fetch(args[0].replace(/\D/g, '')).catch(() => {});
        if (!target) return message.reply('Unknown user');
        const notifs = await db.utils.notifications(target.id);
        const i = await db.utils.balance(message.author.id);
        if (i.wallet < parseInt(250)) return message.reply(`You atleast need ${data.emotes.kr}250 in your wallet!`);
        if (target.id === message.author.id) return message.reply('Did you just try to rob yourself?..');
        const { wallet } = await db.utils.balance(target.id);
        if (wallet <= 0) return message.reply('You can\'t rob a guy with empty wallet , get a standard bro');
        const padlock = await utils.findItem(target.id, 'padlock');
        if (padlock != undefined) {
            const chancetobreak = Math.floor(Math.random() * 2);

            if (chancetobreak == 1) {
                await utils.useItem(target.id, 'padlock');
                await db.utils.addKR(message.author.id, -parseInt(250));
                if (notifs == true) {
                    notify(target, 'An item broke',
                        `Your padlock broke when \`${message.author.tag}\` tried to steal from you in \`${message.guild.name}\``,
                        'RED', 'Time to buy a new padlock');
                }
            } else
                await db.utils.addKR(message.author.id, -parseInt(250));

            message.reply(new MessageEmbed()
                .setColor('RED')
                .setDescription(`You tried robbing ${target.user.username} but you realized they had a massive padlock on their wallet. The KPD fined you ${data.emotes.kr}250.`)
                .setFooter('Smh what a loser'));
            return;
        }
        const robchance = Math.floor(Math.random() * 2);
        if (robchance == 1) {
            const robbedKR = parseInt(Math.floor(Math.random() * wallet));
            await db.utils.addKR(target.id, -robbedKR);
            await db.utils.addKR(message.author.id, robbedKR);
            message.reply(`You stole a sweet amount of ${data.emotes.kr}${comma(robbedKR)} from ${target.user.username}`);
            if (notifs == true) {
                notify(target, 'You got robbed',
                    `\`${message.author.tag}\` stole ${data.emotes.kr}${comma(robbedKR)} from you in \`${message.guild.name}\``,
                    'RED', 'Smh buy a padlock already');
            }
        } else {
            await db.utils.addKR(message.author.id, -parseInt(250));
            message.reply(`You were caught stealing and lost ${data.emotes.kr}250`);
        }
    },
};
