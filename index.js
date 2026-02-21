const { REST } = require("@discordjs/rest");
const { WebSocketManager } = require("@discordjs/ws");

const TOKEN = process.env.TOKEN;

// === YOUR IDs ===
const MESSAGE_ID = "1474770960850903163";
const VERIFIED_ROLE_ID = "1474485699522564173";
const EMOJI = "kralsei_hug_2:1474489822133604355";

const rest = new REST({
  api: "https://api.fluxer.app",
  version: "1"
}).setToken(TOKEN);

const gateway = new WebSocketManager({
  token: TOKEN,
  intents: 127,
  version: "1",
  rest
});

gateway.on("debug", console.log);
gateway.on("error", console.error);

gateway.on("MESSAGE_REACTION_ADD", async (payload) => {
  if (payload.message_id !== MESSAGE_ID) return;

  const emojiString = payload.emoji.id
    ? `${payload.emoji.name}:${payload.emoji.id}`
    : payload.emoji.name;

  if (emojiString !== EMOJI) return;

  try {
    await rest.put(
      `/guilds/${payload.guild_id}/members/${payload.user_id}/roles/${VERIFIED_ROLE_ID}`
    );

    console.log(`Assigned role to ${payload.user_id}`);
  } catch (err) {
    console.error("Role assign error:", err);
  }
});

console.log("Reaction role bot online...");
gateway.connect();

// ====== REACTION ROLE HANDLER ======
// gateway.on("MESSAGE_REACTION_ADD", (payload) => {
  // This will log everything for you to see in Railway
  // console.log("Reaction detected:", payload);

  // Only continue if it's the correct message and emoji
  // if (payload.message_id !== "1474770960850903163") return;
  // if (payload.emoji.name !== "kralsei_hug_2") return;

  // try {
    // rest.put(`/guilds/${payload.guild_id}/members/${payload.user_id}/roles/1474485699522564173`);
    // console.log(`Assigned verification role to ${payload.user_id}`);
  // } catch (err) {
    // console.error("Role assign error:", err);
  // }
// });
