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

@Resolver((of) => Message)
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
  @Mutation(() => Channel)
  async typing(
    @Ctx() { req }: MyContext,
    @Arg("id", () => ID) id: number
  ) {
    const userId = req.session.userId;
    const channel = await Channel.findOne({
      where: { id },
      relations: ["typing"],
    });
    if (!channel) {
      throw new ApolloError(
        "Channel not found",
        "CHANNEL_NOT_FOUND"
      );
    }
    const user = await User.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new ApolloError("User not found", "USER_NOT_FOUND");
    }
    channel.typing.push(user);
    await channel.save();
    setTimeout(() => {
      console.log("heree");
      channel.typing = channel.typing.filter(
        (user) => user.id !== userId
      );
      return channel.save();
    }, 5000);
    return channel;
  }

  @Authorized("VERIFIED_USER")
  @Mutation(() => Message)
  async sendMessage(
    @Arg("data") data: SendMessageInput,
    @Ctx() { req }: MyContext
  ) {
    try {
      const channel = await Channel.findOne({
        where: { id: data.channelId },
      });
      if (!channel) {
        throw new ApolloError(
          "Channel not found",
          "CHANNEL_NOT_FOUND"
        );
      }
      const user = await User.findOne({
        where: { id: req.session.userId },
      });
      if (!user) {
        throw new ApolloError(
          "User not found",
          "USER_NOT_FOUND"
        );
      }
      channel.typing.filter(
        (user) => user.id !== req.session.userId
      );
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
