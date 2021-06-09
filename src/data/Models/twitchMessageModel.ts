import { Schema, model } from "mongoose";
import { ChatUserstate } from "tmi.js";

// 1. Create an interface representing a document in MongoDB.
interface TwitchMessage {
    channel: string;
    userstate: ChatUserstate;
    message: string;
}

// 2. Create a Schema corresponding to the document interface.
const schema = new Schema<TwitchMessage>({
    channel: { type: String, required: true },
    userstate: { type: Schema.Types.Mixed, required: true },
    message: { type: String, required: true }
});

// 3. Create a Model.
export const TwitchMessageModel = model<TwitchMessage>('messsage', schema);

export async function insertMessage(twitchMessage: TwitchMessage): Promise<void> {
    const doc = new TwitchMessageModel(twitchMessage);
    await doc.save();
}