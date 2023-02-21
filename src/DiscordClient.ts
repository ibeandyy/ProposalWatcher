import {
  Client,
  EmbedBuilder,
  ForumChannel,
  GuildChannel,
  ThreadChannel,
} from "discord.js";

import { TOKEN } from "./config.json";

export class DiscordClient extends Client {
  constructor() {
    super({ intents: 131071 });
    this.listenButtons();
  }
  async initialize() {
    await this.login(TOKEN);
  }
  listenButtons() {
    this.on("threadCreate", async (thread: ThreadChannel) => {
      if (thread.type === 11) {
        if (thread.parent?.id == "1055706684636545117") {
          const channel = await this.channels.fetch("1077689664447729754");

          if (channel && channel?.isTextBased()) {
            const author = await this.users.fetch(thread.ownerId as string);
            const url = thread.url;
            const message = await thread.fetchStarterMessage();
            const content = message?.content;
            const title = thread.name;
            const parentChannel = thread.parent as ForumChannel;
            const usedTags = parentChannel.availableTags.filter((tag) => {
              return thread.appliedTags.includes(tag.id);
            });
            const embed = new EmbedBuilder()
              .setTitle(`New Proposal: ${title}`)
              .setDescription(content || "")
              .setAuthor({
                name: `Proposed By: ${author.username}`,
                iconURL: author.displayAvatarURL(),
              })
              .setURL(url)
              .setTimestamp();
            if (usedTags.length > 0) {
              embed.addFields({
                name: "Tags",
                value: usedTags.map((tag) => tag.name).join(", "),
                inline: true,
              });
            }
            channel.send({
              embeds: [embed],
            });
            // try {
            //   const guild = this.guilds.cache.get("914959481849380945");
            //   const members = await guild?.members.fetch();
            //   members?.forEach((user) => {
            //     thread.members.add(user.id);
            //   });
            // } catch (e) {}
          }
        }
      }
    });
  }
}
