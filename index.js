const Discord = require('discord.js');
const client = new Discord.Client({ autoReconnect: true });
// config
const config = require('./config.json');

client.on('ready', () => {
	console.log(`${client.user.username} logged in!`);
	// sets nowplaying and lets the user know that the bot started correctly
	client.user.setActivity(`+h | [${client.guilds.size}] servers`);
});

client.on('guildCreate', guild => {
	// This will update the nowplaying when the bot joins a guild
	console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
	client.user.setActivity(`+h | [${client.guilds.size}] servers`);
});

client.on('guildDelete', guild => {
	// This will update the nowplaying when the bot leaves a guild or is kicked
	console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
	client.user.setActivity(`+h | [${client.guilds.size}] servers`);
});

client.on('message', async message => {
	const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();
	if(message.author.bot) return;
	if(message.content.indexOf(config.prefix) !== 0) return;
	console.log(message.content);
	switch(command){
		case 'ping':
			ping(message);
			break;

		case 'invite':
			message.channel.send('https://discord.io/quotebot');
			break;

		case 'h':
			help(message);
			break;

		case 'q':
			quote(message);
			break;

		case 'purge':
			purge(message);
			break;

		case 'restart':
			_restart(message);
			break;

		default: break;
	}
});

function ping(message){
	const pingmessage = await message.channel.send(':stopwatch:');
	pingmessage.edit(`:stopwatch: Latency [${pingmessage.createdTimestamp - message.createdTimestamp}ms] API Latency [${Math.round(client.ping)}ms]`);
}


function help(message){
	const embed = new Discord.RichEmbed()
		.setAuthor(client.user.username, client.user.avatarURL)
		.setColor(0x00AE86)
		.setTitle('Available Commands')
		.addField(`${config.prefix}h`, 'Shows you this!')
		.addField(`${config.prefix}ping`, 'Gives you the bot\'s response time and API response time.')
		.addField(`${config.prefix}invite`, 'Provide an invite link to invite this bot to your server! (Not available yet)')
		.addField(`${config.prefix}purge`, 'Delete between 2 and 100 messages in a channel (Admin Only)')
		.addField(`${config.prefix}q`, 'Fetch a qoute from the same channel by using `+q <messageid>`(Admin Only)')
		.setTimestamp()
		.setFooter('Bot by Kayda#0001', 'https://cdn.discordapp.com/avatars/81385189875388416/2db9d70f0f9f0d48eb42935e0d25f04d.png?size=2048');
	message.channel.send({ embed });
}

function quote(message){
	const originalMessage = message;
	const channel = message.guild.channels.get(args[1]);
	if(args[1] !== undefined) {
		channel.fetchMessage(args[0])
			.then(message => {
				const Attachment = (message.attachments).array();
				let embed = new Discord.RichEmbed()
					.setColor(0x00AE86)
					.setTitle(`Quote from #${message.channel.name}:`)
					.setDescription(message.content)
					.setAuthor(message.author.username, message.author.avatarURL)
					.setTimestamp(new Date(message.createdTimestamp).toISOString())
					.setFooter('Bot by Kayda#0001', 'https://cdn.discordapp.com/avatars/81385189875388416/2db9d70f0f9f0d48eb42935e0d25f04d.png?size=2048');
				if (Attachment[0] !== undefined) { embed.setImage(Attachment[0].url); }
				originalMessage.channel.send({ embed });
			})
			.catch(console.error);
	}
	else {
		message.channel.fetchMessage(args[0])
			.then(message => {
				const Attachment = (message.attachments).array();
				let embed = new Discord.RichEmbed()
					.setColor(0x00AE86)
					.setTitle(`Quote from #${message.channel.name}:`)
					.setDescription(message.content)
					.setAuthor(message.author.username, message.author.avatarURL)
					.setTimestamp(new Date(message.createdTimestamp).toISOString())
					.setFooter('Bot by Kayda#0001', 'https://cdn.discordapp.com/avatars/81385189875388416/2db9d70f0f9f0d48eb42935e0d25f04d.png?size=2048');
				if (Attachment[0] !== undefined) { embed.setImage(Attachment[0].url); }
				originalMessage.channel.send({ embed });
			})
			.catch(console.error);
	}
}

function purge(message){
	const deleteCount = parseInt(args[0], 10);
	if(!deleteCount || deleteCount < 2 || deleteCount > 100) {return message.reply(':shield: You can select anywhere from 2 to 100 messages to delete.');}
	const fetched = await message.channel.fetchMessages({ limit: deleteCount });
	message.channel.bulkDelete(fetched)
		.catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
}


function _restart(message){
	if (message.author.id === config.admin){
		process.exit();
	}
}


client.login(config.token);

