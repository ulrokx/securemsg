import { ApolloError } from "apollo-server-core";
import { Request } from "express";
import {
  Arg,
  Ctx,
  Field,
  ID,
  InputType,
  Int,
  Mutation,
  Query,
  Resolver,
} from "type-graphql";
import { comparePassword } from "../business-logic/auth/comparePassword";
import { hashPassword } from "../business-logic/auth/hashPassword";
import { validateRegistration } from "../business-logic/auth/validateRegistration";
import { User } from "../models/User";
import { MyContext } from "../types/types";
import { randomInt } from "crypto";
import { verificationCodeEmail } from "../business-logic/email/verificationCodeEmail";
import { sendEmail } from "../business-logic/email/sendEmail";

@InputType()
export class RegisterInput implements Partial<User> {
  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  password: string;
}

@InputType()
export class LoginInput implements Partial<User> {
  @Field()
  username: string;

  @Field()
  password: string;
}

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  async user(@Arg("id", (type) => ID) id: number) {
    const user = await User.findOne({ where: { id } });
    if (!user) {
      throw new ApolloError("User not found", "USER_NOT_FOUND");
    }
  }

  @Mutation(() => User, { nullable: true })
  async register(
    @Arg("data", (type) => RegisterInput) data: RegisterInput
  ) {
    await validateRegistration(data);
    const hash = await hashPassword(data.password);
    const code = randomInt(100000, 999999);
    const user = await User.create({
      username: data.username,
      email: data.email,
      password: hash,
      code,
    }).save();
    const codeEmail = verificationCodeEmail(code);
    await sendEmail({
      email: user.email,
      subject: "Verification Code for SecureMSG",
      html: codeEmail,
      type: "verificationCode",
    });

    return user;
  }

  @Mutation(() => User, { nullable: true })
  async login(
    @Arg("data", (type) => LoginInput) data: LoginInput,
    @Ctx()
    { req }: MyContext
  ) {
    const user = await User.findOne({
      where: { username: data.username },
    });
    if (!user) {
      throw new ApolloError("User not found", "USER_NOT_FOUND");
    }
    const valid = await comparePassword({
      hash: user.password,
      password: data.password,
    });
    if (!valid) {
      throw new ApolloError(
        "Invalid password",
        "INVALID_PASSWORD"
      );
    }
    req.session.userId = user.id;
    return user;
  }

  @Mutation(() => Boolean, { nullable: true })
  async logout(@Ctx() { req }: MyContext) {
    console.log(req.session);
    if (!req.session.userId) {
      return false;
    }
    req.session.destroy((err) => {
      if (err) {
        throw new ApolloError(
          "Error logging out",
          "LOGOUT_ERROR"
        );
      }
    });
    return true;
  }
  @Query(() => User, { nullable: true })
  async me(@Ctx() { req }: MyContext) {
    if (!req.session?.userId) {
      return null;
    }
    const user = await User.findOne({
      where: { id: req.session.userId },
    });
    return user;
  }
}
