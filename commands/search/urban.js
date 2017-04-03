const commando = require('discord.js-commando');
const Discord = require('discord.js');
const request = require('superagent');

module.exports = class UrbanDictionary extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'urban',
            aliases: [
                'urbandictionary',
                'urbandefine',
                'urbandefinition'
            ],
            group: 'search',
            memberName: 'urban',
            description: 'Searches Urban Dictionary. (;urban Cat)',
            examples: [';urban Cat'],
            args: [{
                key: 'word',
                prompt: 'What would you like to define?',
                type: 'string'
            }]
        });
    }

    async run(message, args) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES', 'EMBED_LINKS'])) return;
        }
        console.log(`[Command] ${message.content}`);
        const wordToDefine = args.word;
        try {
            const response = await request
                .get('http://api.urbandictionary.com/v0/define')
                .query({
                    term: wordToDefine
                });
            const data = response.body.list[0];
            const embed = new Discord.RichEmbed()
                .setColor(0x32a8f0)
                .setAuthor('Urban Dictionary', 'http://a1.mzstatic.com/eu/r30/Purple71/v4/66/54/68/6654683f-cacd-4a55-1784-f14257f77874/icon175x175.png')
                .setURL(data.permalink)
                .setTitle(data.word)
                .setDescription(data.definition.substr(0, 1900))
                .addField('**Example:**',
                    data.example.substr(0, 1900) || 'None');
            return message.embed(embed);
        }
        catch (err) {
            return message.say(':x: Error! Word not found!');
        }
    }
};
