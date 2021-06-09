require('dotenv').config();
import { ChatUserstate, Client, Options } from "tmi.js";
import connect from './data/dbHelper';
import { TwitchMessageModel, insertMessage } from "./data/Models/twitchMessageModel";

const botUsername: string | undefined = process.env.TWITCH_BOT_USERNAME;
const botAuthToken: string | undefined = process.env.TWITCH_OAUTH_TOKEN;
const botChannel: string | undefined = process.env.TWITCH_BOT_CHANNEL;
const mongoConnectionString: string | undefined = process.env.MONGO_CONNECTION_STRING;

if (botUsername === null || botUsername === undefined)
  throw new TypeError('Please set TWITCH_BOT_USERNAME env variable.')
else if (botAuthToken === null || botAuthToken === undefined)
  throw new TypeError('Please set TWITCH_OAUTH_TOKEN env variable.')
else if (botChannel === null || botChannel === undefined)
  throw new TypeError('Please set TWITCH_BOT_CHANNEL env variable.')
else if (mongoConnectionString === null || mongoConnectionString === undefined)
  throw new TypeError('Please set MONGO_CONNECTION_STRING env variable.')

console.log(`Bot name : ${botUsername}`)
console.log(`Channel name : ${botChannel}`)

// Define configuration options
const opts: Options = {
  identity: {
    username: botUsername,
    password: botAuthToken
  },
  channels: [
    botChannel
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
  console.log(`* Connected to ${opts.channels} on ${address}:${port}`);
});

client.on('disconnected', (reason) => {
  console.log(`* Disconnected. Reason ${reason}`);
});

client.on('reconnect', () => {
  console.log('* Reconnect.');
});

client.on(
  'message',
  async (
    channel: string,
    userstate: ChatUserstate,
    message: string,
    self: boolean,
  ) => {
    if (self) return;

    const doc = new TwitchMessageModel({
      channel: channel,
      userstate: userstate,
      message: message
    });

    await insertMessage(doc).catch(err => console.log(err));

    // if (message.toLowerCase() === '!hello') {
    //   client.say(channel, `@${userstate.username}, heya!`);
    // }
  }
);
const db = mongoConnectionString;
connect({ db });

// Connect to Twitch:
client.connect().catch(console.error);
