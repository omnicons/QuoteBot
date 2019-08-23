const Discord = require('discord.js');
const { spawn } = require('child_process');
const client = new Discord.Client({ autoReconnect: true });
// config
const config = require('./config.json');

client.on('ready', () => {
	console.log(`${client.user.username} logged in!`);
	// sets nowplaying and lets the user know that the bot started correctly
	presence();
});

client.on('guildCreate', guild => {
	// This will update the nowplaying when the bot joins a guild
	console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
	presence();
});

client.on('guildDelete', guild => {
	// This will update the nowplaying when the bot leaves a guild or is kicked
	console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
	presence();
});

client.on('guildMemberAdd', member => {
    member.guild.channels.get('welcomeChannel').send(`${user.name}, welcome to the ${guild.name} Discord Server! Simply use the command **${config.sprefix}verify age** vorepref to get started! /nFor vore preference we have the options of pred, mostly pred, switch, mostly prey, prey, neither. **Please make sure you use the command in DM for your own privacy!** /n **__If you have any questions, please contact a staff member and they can assist you further!__**`); 
});



client.on('message', async message => {
	const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();
	if(message.author.bot) return;
	if(message.content.indexOf(config.prefix) !== 0) return;
	console.log(message.content);
	switch(command){
		case 'ping':
			const pingmessage = await message.channel.send(':stopwatch:');
			pingmessage.edit(`:stopwatch: Latency [${pingmessage.createdTimestamp - message.createdTimestamp}ms] API Latency [${Math.round(client.ping)}ms]`);
			break;

		case 'invite':
			invite(message);
			break;

		case 'h':
			help(message);
			break;

		case 'purge':
			const deleteCount = parseInt(args[0], 10);
			if (message.member.permissions.has("MANAGE_MESSAGES") === true) {
			if(!deleteCount || deleteCount < 2 || deleteCount > 100) {return message.reply(':shield: You can select anywhere from 2 to 100 messages to delete.');}
			const fetched = await message.channel.fetchMessages({ limit: deleteCount });
			message.channel.bulkDelete(fetched)
			.catch(error => message.reply(`Bot does not have manage messages in this channel!`))
			}
			else {message.reply(`You do not have the correct permissions to delete messages in this channel!`)}
			break;

		case 'restart':
			_restart(message);
			break;
		
		case 'update':
			update(message);
			break;

		case 'verify':
			verify(message, command, args)

		default: break;
	}
});

function verify(message, command, args) {
    	client.guilds.get(config.guild).member(message.author).roles.add(config.role)
        	.catch(console.error)
}

function help(message){
	const embed = new Discord.RichEmbed()
		.setAuthor(client.user.username, client.user.avatarURL)
		.setColor(0x00AE86)
		.setTitle('Available Commands')
		.addField(`${config.prefix}h`, 'Shows you this!')
		.addField(`${config.prefix}ping`, 'Gives you the bot\'s response time and API response time.')
		.addField(`${config.prefix}invite`, 'Provide an invite link to invite this bot to your server!')
		.addField(`${config.prefix}purge`, 'Delete between 2 and 100 messages in a channel (Needs Manage Messages)')
		.addField(`${config.sprefix}q`, `Fetch a quote from the same channel by using ${config.prefix}q <messageid> for in channel quotes and ${config.prefix}q <messageid> <channelid> for fetching quotes from other channels`)
		.setTimestamp()
		.setFooter('Bot by omnicons', 'https://i.imgur.com/vP5Azbd.png');
	message.channel.send({ embed });
}


function _restart(message){
	if (message.author.id === config.admin){
		process.exit();
	} else { 
		message.channel.send("This command is to be used by the bot administrator.")
	}
}

function update(message){
	if(message.author.id === config.admin){
		const pull = spawn ('git', ['pull'], {cwd:`${config.installdir}`});

		pull.stdout.on('data', function(data){
		const output = data.toString();
		const embed = new Discord.RichEmbed()
			.setAuthor(client.user.username, client.user.avatarURL)
			.setColor(0x00AE86)
			.setTitle("Self Updater")
			.setDescription(`${output}`)
			.addField("Status",":white_check_mark: Successful!")
			.addField("Repository",`[omnicons/QuoteBot](https://github.com/omnicons/QuoteBot/)`)
			.setTimestamp()	
			.setFooter('Bot by omnicons', 'https://i.imgur.com/vP5Azbd.png');
		message.channel.send({ embed });
	});
	}
}

function invite(message){
	const embed = new Discord.RichEmbed()
		.setAuthor(client.user.username, client.user.avatarURL)
		.setColor(0x00AE86)
		.setTitle('Invite this bot to your server!')
		.setThumbnail(client.user.avatarURL)
		.setDescription('You can invite this bot to your server using [this link](https://discordapp.com/oauth2/authorize?&client_id=460972006809141257&scope=bot)!')
		.setTimestamp()	
		.setFooter('Bot by omnicons', 'https://i.imgur.com/vP5Azbd.png');
	message.channel.send({ embed });
}

function presence(){
	client.user.setActivity(`${client.guilds.size} server${ (client.guilds.size !== 1) ? 's' : ''} | ${config.prefix}h`, { type: `WATCHING`});
}
client.login(config.token);

