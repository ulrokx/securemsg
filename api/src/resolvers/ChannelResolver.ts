import { ApolloError } from "apollo-server-core";
import {
  Arg,
  Field,
  ID,
  InputType,
  Mutation,
  Resolver,
} from "type-graphql";
import { Channel } from "../models/Channel";
import { dataSource } from "../orm/connect";
import { DatabaseError } from "pg-protocol";

@InputType()
class CreateChannelInput {
  @Field()
  name: string;

  @Field((type) => [ID])
  members: number[];
}

@InputType()
class AddToChannelInput {
  @Field(type => ID)
  userId: number;

  @Field(type => ID)
  channelId: number;
}

@Resolver()
export class ChannelResolver {
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
}
