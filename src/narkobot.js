const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('../config.json');
const { Player } = require('discord-player');
const { YouTubeExtractor } = require('@discord-player/extractor');


const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildVoiceStates] });

const commands = [];
client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

client.player = new Player(client,
	{
		ytdlOptions:
		{
			quality: "highestaudio",
			highWaterMark: 1 << 25
		}
	});
client.player.extractors.register(YouTubeExtractor);
const player = client.player;

player.events.on('error', (queue, error) => {
    // Emitted when the player queue encounters error
    console.log(`General player error event: ${error.message}`);
    console.log(error);
});

player.events.on('playerError', (queue, error) => {
    // Emitted when the audio player errors while streaming audio track
    if (error.name === 'ERR_NO_RESULT')
	{
		console.log(`Player error event: ${error.message}`);
		console.log(`Skipping...`);
		queue.node.skip();
		return;
	}
	console.log(error.name);
	return;
	
    console.log(error);
});
// client.verbose = true;

for (const folder of commandFolders) 
{
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) 
	{
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) 
		{
			client.commands.set(command.data.name, command);
			commands.push(command.data.toJSON());
		} 
		else 
		{
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles)
{
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) client.once(event.name, (...args) => event.execute(...args));
	else client.on(event.name, (...args) => event.execute(...args));
}

client.login(token);
