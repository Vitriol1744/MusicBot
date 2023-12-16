const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { asyncReply, reply, interactionBodyEmbed } = require('../../utility/helpers.js');

module.exports =
{
    data: new SlashCommandBuilder()
        .setName('shuffle')
        .setDescription('Shuffle the queue.'),

    execute: async ({ client, interaction }) =>
    {
        const queue = client.player.nodes.get(interaction.guildId);
        if (!queue || queue.nodes.getSize() == 0) return reply(interaction, interactionBodyEmbed(`The queue is empty.`));

        if (interaction.member.channel.voice.id != queue.channel.voice.id)
            return reply(interaction, interactionBodyEmbed(`You must be on the same voice channel as bot.`));
    
        await queue.nodes.enableShuffle(false);
        await asyncReply(interaction, interactionBodyEmbed(`Queue shuffled.`));
    },
};