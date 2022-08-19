import { AuthChecker } from "type-graphql";
import { Channel } from "../models/Channel";
import { User } from "../models/User";
import { MyContext } from "../types/types";

const ROLES = ["VERIFIED_USER", "UNVERIFIED_USER"];

export const authChecker: AuthChecker<MyContext> = async (
  { context, args },
  roles
) => {
  roles.forEach((role) => {
    if (!ROLES.includes(role)) {
      throw new Error(`Role ${role} does not exist`);
    }
  });
  if (!context.req.session.userId) {
    return false;
  }
  const userId = context.req.session.userId;
  const user = await User.findOne({ where: { id: userId } });
  if (!user) {
    throw new Error(`User with id ${userId} not found`);
  }
  if (roles.includes("VERIFIED_USER")) {
    if (!user.verifiedEmail) {
      return false;
    }
  }
  return true;
};
