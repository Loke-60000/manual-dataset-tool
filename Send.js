const fs = require('fs');
const readline = require('readline');
const Discord = require('discord.js');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Please enter token (available on the discord server in the files channel): ', token => {
  const client = new Discord.Client();

  client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);

    const channelId = '1138518791840616539';
    const channel = client.channels.cache.get(channelId);
    if (!channel) {
      console.error(`Channel with ID ${channelId} not found.`);
      return;
    }

    rl.question('Which files do you want to send? Please provide the file path: ', answer => {
      rl.close();

      const filePaths = answer.split(',').map(filePath => filePath.trim());

      const promises = [];
      let errorOccurred = false; // Flag to track errors

      for (const filePath of filePaths) {
        if (!fs.existsSync(filePath)) {
          console.error(`File not found: ${filePath}`);
          errorOccurred = true;
          continue;
        }

        const fileAttachment = new Discord.MessageAttachment(filePath);
        const fileName = filePath.split('/').pop();
        const messageContent = `New dataset received: ${fileName} ヽ(*ﾟдﾟ)ノｶｲﾊﾞｰ`;

        promises.push(
          channel.send(messageContent)
            .then(() => channel.send({ files: [fileAttachment] }))
            .catch(error => {
              console.error('Error sending file:', error);
              errorOccurred = true;
            })
        );
      }

      Promise.all(promises)
        .then(() => {
          if (!errorOccurred) {
            console.log('All files sent successfully');
          } else {
            console.error('Some files were not sent successfully');
          }
          client.destroy();
        })
        .catch(error => {
          console.error('Error sending files:', error);
          client.destroy();
        });
    });
  });

  client.login(token);
});
