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
  Query,
  Resolver,
  Root,
} from "type-graphql";
import { Channel } from "../models/Channel";
import { dataSource } from "../orm/connect";
import { DatabaseError } from "pg-protocol";
import { User } from "../models/User";
import { PaginationInput } from "./UserResolver";
import { Message } from "../models/Message";
import { MyContext } from "../types/types";

@InputType()
class CreateChannelInput {
  @Field()
  name: string;

  @Field((type) => [ID])
  members: number[];
}

@InputType()
class AddToChannelInput {
  @Field((type) => ID)
  userId: number;

  @Field((type) => ID)
  channelId: number;
}

@Resolver((of) => Channel)
export class ChannelResolver {
  @FieldResolver()
  async name(
    @Root() channel: Channel,
    @Ctx() { req }: MyContext
  ) {
    if (channel.members && channel.members.length == 2) {
      const otherMember = channel.members.filter(
        (member) => member.id !== req.session.userId
      )[0];
      const otherUser = await User.findOne({
        where: { id: otherMember.id },
      });
      return otherUser!.username;
    }
    return channel.name;
  }
  @FieldResolver()
  async members(@Root() channel: Channel) {
    return User.find({
      where: {
        channels: {
          id: channel.id,
        },
      },
    });
  }

  @FieldResolver()
  async messages(
    @Root() channel: Channel,
    @Arg("pagination", { nullable: true })
    pagination: PaginationInput
  ) {
    let limit;
    let offset;
    if (!pagination?.limit || !pagination?.offset) {
      limit = 20;
      offset = 0;
    } else {
      limit = pagination.limit;
      offset = pagination.offset;
    }
    return Message.find({
      where: { channel: { id: channel.id } },
      take: limit,
      skip: offset,
      order: { createdAt: "DESC" },
    });
  }
  @FieldResolver()
  async typing(@Root() channel: Channel) {
    return User.find({
      where: {
        channelsTyping: {
          id: channel.id,
        },
      },
    });
  }
  @Mutation(() => Channel)
  async addToChannel(@Arg("data") data: AddToChannelInput) {
    try {
      const { addedToChannel } = await dataSource.transaction(
        async (trx) => {
          const channel = await trx.findOne(Channel, {
            where: { id: data.channelId },
          });
          if (!channel) {
            throw new ApolloError(
              "Channel not found",
              "CHANNEL_NOT_FOUND"
            );
          }
          await trx
            .createQueryBuilder()
            .relation(Channel, "members")
            .of(channel.id)
            .add(data.userId);
          return { addedToChannel: channel };
        }
      );
      if (!addedToChannel) {
        throw new ApolloError(
          "User not added to channel",
          "USER_NOT_ADDED_TO_CHANNEL"
        );
      }
      return addedToChannel;
    } catch (e) {
      const error = e as DatabaseError;
      if (
        error.detail?.includes('not present in table "user"')
      ) {
        const userId = error.detail.slice(14, -1).split(")")[0];
        throw new ApolloError(
          `User with id ${userId} not found`,
          "USER_NOT_FOUND"
        );
      }
    }
  }

  @Mutation(() => Channel)
  async createChannel(@Arg("data") data: CreateChannelInput) {
    try {
      const { createdChannel } = await dataSource.transaction(
        async (trx) => {
          const channel = Channel.create({
            name: data.name,
          });
          const createdChannel = await trx.save(channel);
          await trx
            .createQueryBuilder()
            .relation(Channel, "members")
            .of(channel.id)
            .add(data.members);
          return { createdChannel };
        }
      );
      if (!createdChannel) {
        throw new ApolloError(
          "Channel not created",
          "CHANNEL_NOT_CREATED"
        );
      }
      return createdChannel;
    } catch (e) {
      const error = e as DatabaseError;
      if (
        error.detail?.includes('not present in table "user"')
      ) {
        const userId = error.detail.slice(14, -1).split(")")[0];
        throw new ApolloError(
          `User with id ${userId} not found`,
          "USER_NOT_FOUND"
        );
      }
    }
  }

  @Query(() => Channel)
  async channel(@Arg("id", () => ID) id: number) {
    return Channel.findOne({
      where: { id },
      relations: [
        "typing",
        "members",
        "messages",
      ],
    });
  }

  @Authorized(["UNVERIFIED_USER"])
  @Query(() => [Channel])
  async channels(
    @Arg("pagination", { nullable: true })
    pagination: PaginationInput
  ) {
    let limit;
    let offset;
    if (!pagination?.limit || !pagination?.offset) {
      limit = 20;
      offset = 0;
    } else {
      limit = pagination.limit;
      offset = pagination.offset;
    }
    return Channel.find({
      take: limit,
      skip: offset,
      relations: ["typing", "members"],
    });
  }
}
