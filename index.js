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
	if(message.author.bot) return;
	if(message.content.indexOf(config.prefix) !== 0) return;
	console.log(message.content);
	if (message.author.id === '81385189875388416') {
		const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
		const command = args.shift().toLowerCase();
		if(command === 'ping') {
			const pingmessage = await message.channel.send(':stopwatch:');
			pingmessage.edit(`:stopwatch: Latency [${pingmessage.createdTimestamp - message.createdTimestamp}ms] API Latency [${Math.round(client.ping)}ms]`);
		}
		if (command === 'restart') {
			process.exit();
		}
		if (command === 'q') {
			let originalMessage = message;
			message.channel.fetchMessage(args[0])
				.then(message => {
					const embed = new Discord.RichEmbed()
						.setColor(0x00AE86)
						.setDescription(message.content)
						.setAuthor(message.author.username, message.author.avatarURL)
						.setTimestamp(new Date(message.createdTimestamp).toISOString())
						.setFooter('Bot by Kayda#0001', 'https://cdn.discordapp.com/avatars/81385189875388416/3b8a7ea8c412d890fa99a1481ab3c269.png?size=2048');
					originalMessage.channel.send({ embed });
				})
				.catch(console.error);
		}
		if(command === 'purge') {
			const deleteCount = parseInt(args[0], 10);
			if(!deleteCount || deleteCount < 2 || deleteCount > 100) {return message.reply(':shield: You can select anywhere from 2 to 100 messages to delete.');}
			const fetched = await message.channel.fetchMessages({ limit: deleteCount });
			message.channel.bulkDelete(fetched)
				.catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
		}
		if(command === 'invite') {
			message.channel.send('https://discordapp.com/oauth2/authorize?&client_id=460972006809141257&scope=bot&permissions=641195117');
		}

	}
});


client.login(config.token);

