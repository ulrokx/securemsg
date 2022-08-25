import { ApolloError } from "apollo-server-core";
import isEmail from "validator/lib/isEmail";
import { RegisterInput } from "../../resolvers/UserResolver";
import zxcvbn from "zxcvbn";
import { User } from "../../models/User";

export const validateRegistration = async (
  data: RegisterInput
) => {
  const { email, password, username } = data;
  if (!isEmail(email)) {
    throw new ApolloError("Invalid email", "INVALID_EMAIL");
  }
  const passwordStrength = zxcvbn(password);
  if (passwordStrength.score < 2) {
    throw new ApolloError(
      "Weak password",
      "INVALID_PASSWORD",
      passwordStrength
    );
  }
  if (username.length <= 3 || username.length > 16) {
    throw new ApolloError(
      "Username must be between 3 and 16 characters",
      "INVALID_USERNAME"
    );
  }
  const existingUsername = await User.findOne({
    where: { username },
  });
  const existingEmail = await User.findOne({ where: { email } });
  if (existingUsername) {
    throw new ApolloError(
      "Username already exists",
      "USERNAME_ALREADY_EXISTS"
    );
  }
};
