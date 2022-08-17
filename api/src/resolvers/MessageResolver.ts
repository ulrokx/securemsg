import { ApolloError } from "apollo-server-core";
import {
  Arg,
  Authorized,
  Ctx,
  Field,
  FieldResolver,
  ID,
  InputType,
  Mutation,
  Resolver,
  Root,
} from "type-graphql";
import { Channel } from "../models/Channel";
import { Message } from "../models/Message";
import { User } from "../models/User";
import { MyContext } from "../types/types";

@InputType()
class SendMessageInput {
  @Field()
  text: string;

  @Field((type) => ID)
  channelId: number;
}

@Resolver(of => Message)
export class MessageResolver {
  @FieldResolver()
  async user(@Root() message: Message) {
    return User.findOne({ where: { id: message.user.id } });
  }

  @FieldResolver()
  async channel(@Root() message: Message) {
    return Channel.findOne({
      where: { id: message.channel.id },
    });
  }

  @Authorized("VERIFIED_USER")
  @Mutation(() => Message)
  async sendMessage(
    @Arg("data") data: SendMessageInput,
    @Ctx() { req }: MyContext
  ) {
    try {
      const userId = req.session.userId;
      const message = await Message.create({
        channel: { id: data.channelId },
        user: { id: userId },
        text: data.text,
      }).save();
      return message;
    } catch (e) {
      console.error(e);
      throw new ApolloError(
        "Message not sent",
        "MESSAGE_NOT_SENT"
      );
    }
  }
}
