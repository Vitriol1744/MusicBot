const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { asyncReply, reply } = require('../../utility/helpers.js');

module.exports = 
{
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Show queue.'),

    execute: async ({ client, interaction }) =>
    {
        const queue = client.player.nodes.get(interaction.guildId);
        if (!queue) return reply(interaction, "The queue is empty.");

        const trackCount = queue.getSize();
        for (let i = 0; i < trackCount; i++)
            asyncReply(interaction, { embeds: [new EmbedBuilder()
                .setDescription(`[${i}]: ${queue.tracks[i].title}`)]});
    }
}