import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Channel } from "./Channel";
import { User } from "./User";

@Entity()
@ObjectType()
export class Message extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field((type) => ID)
  id: number;

  @Column("text")
  @Field()
  text: string;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.messages, {eager: true})
  @Field((type) => User)
  user: User;

  @ManyToOne(() => Channel, (channel) => channel.messages)
  @Field((type) => Channel)
  channel: Channel;
}
