const { REST } = require("@discordjs/rest");
const { WebSocketManager } = require("@discordjs/ws");

const TOKEN = process.env.TOKEN;

// ===== CONFIG =====
const MESSAGE_ID = "1474770960850903163";
const VERIFIED_ROLE_ID = "1474485699522564173";
const EMOJI_NAME = "kralsei_hug_2";
const EMOJI_ID = "1474489822133604355";
// ==================

if (!TOKEN) {
  console.error("TOKEN is missing. Set it in Railway environment variables.");
  process.exit(1);
}

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

gateway.on("debug", (d) => console.log("DEBUG:", d));
gateway.on("error", (e) => console.error("GATEWAY ERROR:", e));

gateway.on("READY", () => {
  console.log("Bot is online and ready.");
});

gateway.on("MESSAGE_REACTION_ADD", async (payload) => {
  console.log("Reaction event received");

  // Ignore wrong message
  if (payload.message_id !== MESSAGE_ID) return;

  // Ignore wrong emoji
  if (payload.emoji.id !== EMOJI_ID) return;

  try {
    await rest.put(
      `/guilds/${payload.guild_id}/members/${payload.user_id}/roles/${VERIFIED_ROLE_ID}`
    );

    console.log(`Role assigned to ${payload.user_id}`);
  } catch (err) {
    console.error("Failed to assign role:", err);
  }
});

console.log("Connecting to gateway...");
gateway.connect();
