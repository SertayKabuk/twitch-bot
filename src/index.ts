import * as dotenv from 'dotenv';

import { ChatUserstate, Client, Options } from "tmi.js";

dotenv.config();

// Define configuration options
const opts: Options = {
  identity: {
    username: process.env.TWITCH_BOT_USERNAME,
    password: process.env.TWITCH_OAUTH_TOKEN
  },
  channels: [
    process.env.TWITCH_BOT_CHANNEL ?? ""
  ],
  connection: {
    reconnect: true,
    secure: true
  }
};

// Create a client with our options
const client = new Client(opts);


// Register our event handlers (defined below)

client.on('connected', (address, port) => {
  console.log(`* Connected to ${address}:${port}`);
});

client.on(
  'message',
  (
    channel: string,
    userstate: ChatUserstate,
    message: string,
    self: boolean,
  ) => {
    if (self) return;

    if (message.toLowerCase() === '!hello') {
      client.say(channel, `@${userstate.username}, heya!`);
    }
  }
);

// Connect to Twitch:
client.connect().catch(console.error);
