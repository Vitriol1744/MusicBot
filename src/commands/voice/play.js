const { SlashCommandBuilder } = require('@discordjs/builders');

const { generateDependencyReport, getVoiceConnection, AudioPlayerStatus, entersState, joinVoiceChannel, createAudioPlayer, createAudioResource, VoiceConnectionStatus } = require('@discordjs/voice');
const { createReadStream } = require('node:fs');
const { ChannelType, EmbedBuilder } = require('discord.js');
const { QueryType } = require('discord-player');
const { join } = require('node:path');
const ytdl = require('ytdl-core');
const { validateYoutubeUrl } = require('../../utility/validation.js');
const { YouTubeExtractor } = require('@discord-player/extractor');
const { asyncReply, reply, interactionBodyEmbed } = require('../../utility/helpers.js');



module.exports = {
    cooldown: 2,
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Plays music.')
        .addStringOption(option =>
            option
                .setName('query')
                .setDescription('your youtube video query')
                .setRequired(true)),


    execute: async ({client, interaction}) =>
    {
        try
        {
            const voice = interaction.member.voice;
            if (!voice.channel)
                return reply(interaction, 'You need to be in a voice channel to play a song.');
            
            console.log("Creating the queue and joining the voice channel");
            const queue = await client.player.nodes.create(interaction.guild);
            if (!queue.connection) await queue.connect(voice.channel);

            const query = interaction.options.getString('query');
            console.log(`Querying for '${query}'...`);
            await asyncReply(interaction, {embeds: [new EmbedBuilder()
                .setDescription(`Querying for '${query}'...`)]});

            // let guildQueue = client.player.getQueue(interaction.guildId);

            const tracks = await client.player.search(query,
                {
                    requestedBy: interaction.user,
                });
            if (tracks.tracks.length === 0)
                return reply(interaction, interactionBodyEmbed(`No videos found with url: ${query}`));
            await queue.addTrack(tracks.tracks);

            // const embed = new EmbedBuilder()
                // .setDescription(`${track.title} has been added to the queue.`)
                // .setThumbnail(track.thumbnail)
                // .setFooter({ text: `Duration: ${track.duration}`});
            
            console.log("Playing the track")
            
            if (!queue.playing)
            {
                console.log('not playing...');
                await queue.play(query).catch(err => 
                {
                    console.log(`Error: ${err}`);
                    // if(!guildQueue) queue.stop();
                });
            }
            // await asyncReply(interaction, { embeds: [embed]});
        }
        catch (error)
        {
            console.error(error);
        }
    },
};