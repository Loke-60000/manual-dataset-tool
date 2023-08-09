const fs = require('fs');
const readline = require('readline');
const Discord = require('discord.js');

const client = new Discord.Client();
// you wont be able to spam my server I added security measures and it doesnt have any admin roles so dont waste your time :
const token = 'MTEzODg0NDY4MzEwODM1MjA4Mg.GupMTc.VIIF7rpDWgrQ6I5DjAB0Hxsha8naBcQPFaX9PQ'; 
const channelId = '1138518791840616539';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
  
  const channel = client.channels.cache.get(channelId);
  if (!channel) {
    console.error(`Channel with ID ${channelId} not found.`);
    return;
  }
  
  rl.question('Which files do you want to send? Please provide the file path: ', answer => {
    rl.close();
    
    const filePaths = answer.split(',').map(filePath => filePath.trim());
    
    const promises = [];
    
    for (const filePath of filePaths) {
      const fileAttachment = new Discord.MessageAttachment(filePath);
      const fileName = filePath.split('/').pop();
      const messageContent = `New dataset received: ${fileName} ヽ(*ﾟдﾟ)ノｶｲﾊﾞｰ`;
      
      promises.push(
        channel.send(messageContent)
          .then(() => channel.send({ files: [fileAttachment] }))
          .catch(error => {
            console.error('Error sending file:', error);
          })
      );
    }
    
    Promise.all(promises)
      .then(() => {
        console.log('All files sent successfully');
        client.destroy();
      })
      .catch(error => {
        console.error('Error sending files:', error);
        client.destroy();
      });
  });
});

client.login(token);
