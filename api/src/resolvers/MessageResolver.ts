import { ApolloError } from "apollo-server-core";
import {
  Arg,
  Args,
  Authorized,
  Ctx,
  Field,
  FieldResolver,
  ID,
  InputType,
  Mutation,
  Publisher,
  PubSub,
  Resolver,
  Root,
  Subscription,
} from "type-graphql";
import { userInChannel } from "../business-logic/channel/userInChannel";
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
    console.log(message)
    return User.findOne({ where: { id: message.user.id } });
  }

  @FieldResolver()
  async channel(@Root() message: Message) {
    return Channel.findOne({
      where: { id: message.channel.id },
      relations: ["members", "messages"],
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
      channel.typing = channel.typing.filter(
        (user) => user.id !== userId
      );
      return channel.save();
    }, 5000);
    return channel;
  }

  @Mutation(() => Message)
  async sendMessage(
    @Arg("data") data: SendMessageInput,
    @Ctx() { req }: MyContext,
    @PubSub("NEW_MESSAGE") publish: Publisher<Message>
  ) {
    try {
      const channel = await Channel.findOne({
        where: { id: data.channelId },
        relations: ["typing"],
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
      await publish(message);
      return message;
    } catch (e) {
      console.error(e);
      throw new ApolloError(
        "Message not sent",
        "MESSAGE_NOT_SENT"
      );
    }
  }
  @Subscription({
    topics: "NEW_MESSAGE",
    filter: ({ args, payload }) =>
      args.id === payload.channel.id,
  })
  newMessage(
    @Root() message: Message,
    @Arg("id", () => ID) id: number
  ): Message {
    return {
      ...message,
      createdAt: new Date(message.createdAt),
    } as Message;
  }
}
