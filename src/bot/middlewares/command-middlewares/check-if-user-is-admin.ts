import { usersDb } from '@json-db';
import { CommandMiddleware } from '../../bot';

export const checkIfUserIsAdmin: CommandMiddleware = async ({
  commandData,
  client,
  message,
  query,
}): Promise<boolean> => {
  if (!commandData.allowedUsers) {
    return true;
  }

  if (
    commandData.allowedUsers.length === 1 &&
    commandData.allowedUsers.includes('admin')
  ) {
    const user = usersDb.getFirst({ id: message.sender.id });

    if (user?.role === 'admin') {
      return true;
    }

    await client.reply(
      message.from,
      'Este comando é apenas para administradores.',
      message.id
    );
    return false;
  }

  return true;
};
