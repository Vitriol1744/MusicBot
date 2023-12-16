const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports =
{
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skip current track.')
        .addIntegerOption(option =>
            option
                .setName('count')
                .setDescription('Number of tracks to skip.')
                .setRequired(false)),

    execute: async ({ client, interaction }) =>
    {
        const queue = client.player.nodes.get(interaction.guildId);
        if (!queue) return interaction.reply("The queue is empty.");

        let count = interaction.options.getInteger('count');
        if (!count) count = 1;

        const currentTrack = queue.currentTrack;
        
        const skipTrack = async (firstEnumeration) =>
        {
            const currentTrack = queue.currentTrack;
            if (!currentTrack) return;
            const embed = new EmbedBuilder()
                .setDescription(`Skipping ${currentTrack.title}...`)
                .setThumbnail(currentTrack.thumbnail);

            await queue.node.skip();
            
            if (firstEnumeration) await interaction.reply({ embeds: [embed]});
            else await interaction.update({ embeds: [embed]});
        }

        skipTrack(true);
        for (let i = 1; i < count; i++)
            skipTrack(false);
    }
}