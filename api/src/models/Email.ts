import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class Email extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text")
  to: string;

  @Column("text")
  from: string;

  @Column("text")
  messageId: string;

  @Column("text")
  type: string;

  @CreateDateColumn()
  sent: Date;
}
