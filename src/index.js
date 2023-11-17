require('dotenv').config() 
const { Client, GatewayIntentBits, Partials, Collection, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('./config.json');
const { Database } = require('./data/Database.js');
const { PlayerManager } = require('./managers/PlayerManager.js');
const { Leaderboard } = require('./data/LeaderBoards.js');
const db = new Database();
db.connect();
db.init();

const player_manager = new PlayerManager(db);
player_manager.init();

const leaderboard = new Leaderboard(db);
leaderboard.init();

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds, 
		GatewayIntentBits.GuildMessages, 
		GatewayIntentBits.GuildPresences, 
		GatewayIntentBits.GuildMessageReactions, 
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers
	], 
	partials: [Partials.Channel, Partials.Message, Partials.User, Partials.GuildMember, Partials.Reaction] 
});


client.commands = new Collection()
client.aliases = new Collection()
client.slashCommands = new Collection();
client.buttons = new Collection();
client.forms = new Collection();
client.prefix = config.prefix;
client.db = db;
client.player_manager = player_manager;
client.leaderboard = leaderboard;
client.tasks = new Collection();

module.exports = client;

const handlers = path.join(__dirname, 'handlers');
fs.readdirSync(handlers).forEach((handler) => {
  require(`${handlers}/${handler}`)(client)
});



client.login(process.env.DISCORD_TOKEN);