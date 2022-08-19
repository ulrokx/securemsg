import { Channel } from "../../models/Channel";

export const userInChannel = async ({
  userId,
  channelId,
}: {
  userId: number;
  channelId: number;
}) => {
  const channel = await Channel.findOne({
    where: { id: channelId },
    relations: ["members"],
  });
  if (!channel) {
    return false;
  }
  return channel.members.find((user) => user.id === userId);
};
