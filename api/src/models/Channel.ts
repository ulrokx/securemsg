import { ObjectType, Field, ID } from "type-graphql";
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
import { Message } from "./Message";
import { User } from "./User";

@Entity()
@ObjectType()
export class Channel extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field((type) => ID)
  id: number;

  @Column("text")
  @Field()
  name: string;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field({ nullable: true })
  updatedAt: Date;

  @ManyToMany(() => User, (user) => user.channels)
  @Field((type) => [User])
  members: User[];

  @OneToMany(() => Message, (message) => message.channel)
  @Field((type) => [Message])
  messages: Message[];

  @ManyToMany(() => User, (user) => user.channelsTyping)
  @JoinTable()
  @Field((type) => [User])
  typing: User[];
}
