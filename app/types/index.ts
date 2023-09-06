import { Conversation, Message, User } from "@prisma/client";

export type FullMessageType = Message & {
    sender: User,
    seen: User[]
};


//extends Conversation to returns type of populated users & messages
export type FullConversationType = Conversation & {
    users: User[],
    messages: FullMessageType[],

};