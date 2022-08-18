import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Channel } from "./Channel";
import { Message } from "./Message";

@Entity()
@ObjectType()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field((type) => ID)
  id: number;

  @Column("text")
  @Field()
  username: string;

  @Column("text")
  password: string;

  @Column("int", { nullable: true })
  code: number | null;

  @Column("boolean", { default: false })
  @Field()
  verifiedEmail: boolean;

  @Column("text")
  @Field()
  email: string;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field({ nullable: true })
  updatedAt: Date;

  @ManyToMany(() => Channel, (channel) => channel.members)
  @JoinTable()
  @Field((type) => [Channel])
  channels: Channel[];

  @OneToMany(() => Message, (message) => message.user)
  @Field((type) => [Message])
  messages: Message[];

  @ManyToMany(() => Channel, channel => channel.typing)
  channelsTyping: Channel[];
}
