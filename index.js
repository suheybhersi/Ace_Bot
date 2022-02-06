const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");


const express = require('express')
const app = express();
const port = 3000

app.get('/', (req, res) => res.send('Yo boi!!'))

app.listen(port, () =>
console.log(`Your app is listening a http://localhost:${port}`)
);


const mySecret = process.env["TOKEN"];

const client = new Discord.Client({
  intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_PRESENCES", "GUILD_MEMBERS"],
});

client.on("ready", () => {
  console.log(`Logged in as: ${client.user.tag}`);
  client.user.setActivity("#help", { type: "PLAYING" });
});

var prefix = "#";
var memsWithRole = 0;
var shushed = false;

// Member update event
client.on("guildMemberUpdate", (oldMember, newMember) => {
  if (oldMember.roles.cache.size > newMember.roles.cache.size) {
    // Role removed
    memsWithRole -= 1;

    const Embed = new MessageEmbed();
    Embed.setColor("RED");

    // Looping through the role and checking which role was removed.
    oldMember.roles.cache.forEach((role) => {
      if (!newMember.roles.cache.has(role.id)) {
        Embed.setDescription(
          `<@${newMember.user.id}> doesn't have the ${role} role anymore`
        );
      }
    });
    client.channels.cache.get(`835890789586174018`).send({ embeds: [Embed] });
  } else if (oldMember.roles.cache.size < newMember.roles.cache.size) {
    //Role added
    memsWithRole += 1;

    const Embed = new MessageEmbed();
    Embed.setColor("GREEN");

    // Looping through the role and checking which role was added.
    newMember.roles.cache.forEach((role) => {
      if (!oldMember.roles.cache.has(role.id)) {
        Embed.setDescription(
          `<@${newMember.user.id}> now has the ${role} role`
        );
      }
    });
    client.channels.cache.get(`835890789586174018`).send({ embeds: [Embed] });
  }
});

var arcArray = [];

//Main message handling

client.on("messageCreate", (message) => {
  const msgSplit = message.content.split(" ");
  if (message.author.tag == "Ace_Bot#3226") {
  }
  else {
    if (message.content == `${prefix}help`) {
      message.channel.send({
        embeds: [
          {
            type: "rich",
            title: `The following commands are available:`,
            color: 0x00b7ff,
            fields: [
              {
                name: `Change prefix:`,
                value: `${prefix}cp «prefix»`,
              },
              {
                name: `Show role count:`,
                value: `${prefix}rc «role»`,
              },

              {
                name: `Show all role counts:`,
                value: `${prefix}arc`,
              },
            ],
          },
        ],
      });
    } else if (msgSplit[0] == `${prefix}cp` && msgSplit.length == 2) {
      prefix = msgSplit[1];

      message.channel.send({
        embeds: [
          {
            type: "rich",
            description: `The new prefix is [${prefix}]`,
            color: 0x00b7ff,
          },
        ],
      });
    } else if (msgSplit[0] == `${prefix}rc` && msgSplit.length == 2) {
      var role = msgSplit[1];
      var roleId = 0;
      var roleExists = false;
      var memsCount = 0;

      message.guild.roles.cache.forEach((r) => {
        if (role.toLowerCase() == r.name.toLowerCase()) {
          roleId = r.id;
          roleExists = true;
          message.guild.roles.cache.get(`${roleId}`).members.forEach(() => {
            memsCount += 1;
          });
        }
      });

      function pluralTest() {
        if (memsCount == 1) {
          return "person has";
        } else {
          return "people have";
        }
      }

      if (roleExists && memsCount == 0) {
        message.channel.send({
          embeds: [
            {
              type: "rich",
              description: `No one has the <@&${roleId}> role.`,
              color: 0x00b7ff,
            },
          ],
        });
      } else if (roleExists) {
        message.channel.send({
          embeds: [
            {
              type: "rich",
              description: `${memsCount} ${pluralTest()} the <@&${roleId}> role!`,
              color: 0x00b7ff,
            },
          ],
        });
      } else {
        message.channel.send({
          embeds: [
            {
              type: "rich",
              title: `This role doesn't exist :(`,
              color: 0x00b7ff,
            },
          ],
        });
      }
    } else if (message.content == `${prefix}arc`) {
      arcArray = [];
      message.guild.roles.cache.forEach((r) => {
        memsCount = 0;
        roleId = r.id;
        message.guild.roles.cache.get(`${roleId}`).members.forEach(() => {
          memsCount += 1;
        });
        arcArray.push({
          roleId: roleId,
          roleName: r.name,
          memsCount: memsCount,
        });
      });

      var Embed = new MessageEmbed();
      Embed.setColor("0x00b7ff").setTitle(
        "Here is the role count for each role"
      );

      for (i = 1; i < arcArray.length; i++) {
        function pluralTest2() {
          if (arcArray[i].memsCount == 1) {
            return "member";
          } else {
            return "members";
          }
        }
        Embed.addField(
          "\u200b",
          `<@&${arcArray[i].roleId}> has ${
            arcArray[i].memsCount
          } ${pluralTest2()}`
        );
      }

      message.channel.send({
        embeds: [Embed],
      });
    } 
    else if (msgSplit[0] == `${prefix}kick`) {
      targetUser = msgSplit[1];
      message.guild.members.cache.find((u) => {
        if (u.user.username == targetUser) {
          u.kick();
        }
      });
    } else if (
      msgSplit[0] == `${prefix}shush` &&
      message.author.username == "Suheyb"
    ) {
      targetUser = msgSplit[1];
      message.guild.members.cache.find((u) => {
        if (u.user.username.toLowerCase() == targetUser.toLowerCase() && shushed == false) {
          shushed = true;
          u.voice.setMute(true);
          u.voice.setDeaf(true);
        } else if (u.user.username.toLowerCase() == targetUser.toLowerCase() && shushed == true) {
          shushed = false;
          u.voice.setMute(false);
          u.voice.setDeaf(false);
        }
      });
    }
  }
});

client.login(mySecret);
