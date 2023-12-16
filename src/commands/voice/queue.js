const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { asyncReply, reply, interactionBodyEmbed } = require('../../utility/helpers.js');

module.exports = 
{
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Show queue.')
        .addIntegerOption(option =>
            option.setName('limit')
            .setDescription('Max elements limit.')
            .setMinValue(5)
            .setMaxValue(15)),

    execute: async ({ client, interaction }) =>
    {
        await asyncReply(interaction, {embeds: [new EmbedBuilder()
            .setDescription(`Getting queue...`)]});
        const queue = client.player.nodes.get(interaction.guildId);
        if (!queue || !queue.isPlaying()) return reply(interaction, "The queue is empty.");

        let limit = interaction.options.getInteger('limit');
        if (limit < 5) limit = 5;
        const trackList = await queue.tracks.toArray().slice(0, limit).map((track, i) =>
        {
            return `${i}) [${track.duration}]\` ${track.title} - <@${track.requestedBy.id}>`
        }).join("\n");

        const currentTrack = queue.currentTrack;

        const str = `**Currently Playing**\n` +
        (currentTrack ? `\`[${currentTrack.duration}]\` ${currentTrack.title} - <@${currentTrack.requestedBy.id}>` : "None") +
        `\n\n**Queue**\n${trackList}`;
        await asyncReply(interaction, {embeds: [new EmbedBuilder()
            .setDescription(str)]});
    }
}