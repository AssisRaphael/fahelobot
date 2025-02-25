import { decryptMedia, Message } from '@open-wa/wa-automate';
import { Command, CommandData, CommandType } from '@command-protocols';

const func: Command = async ({ value, client, message }) => {
  let mediaMsg: Message = message;

  const quotedMessage = message.quotedMsg;
  if (quotedMessage) {
    mediaMsg = quotedMessage;
  }

  if (mediaMsg.mimetype) {
    console.log("SENDER ID: ", message.sender)
    const mediaData = await decryptMedia(mediaMsg);

    const imageBase64 = `data:${mediaMsg.mimetype};base64,${mediaData.toString(
      'base64'
    )}`;

    if (mediaMsg.mimetype.includes('mp4')) {
      await client.sendMp4AsSticker(
        message.from,
        imageBase64,
        {},
        {
          author: 'culio.CROSS_BOT',
          keepScale: true,
          pack: `BOT - Pedido por [${message.sender.pushname}]`,
          circle: value?.includes('circle'),
          removebg: value?.includes('removebg'),
        }
      );
    } else {
      await client.sendImageAsSticker(message.from, imageBase64, {
        author: 'culio.CROSS_BOT',
        keepScale: true,
        pack: `BOT - Pedido por [${message.sender.pushname}]`,
        circle: value?.includes('circle'),
        removebg: value?.includes('removebg'),
      });
    }

    await client.sendText(message.from, 'De nada.');
    // await client.sendText(message.from, quotedMessage.mimetype);
  } else {
    await client.reply(
      message.from,
      'Você precisa me enviar uma imagem, zé ruela.',
      message.id
    );
  }
};

const search: CommandData = {
  command: ['.fig'],
  func,
  category: CommandType.UTILS,
  description: 'Cria uma figurinha a partir de uma imagem',
  detailedDescription:
    'Parâmetros opcionais:\ncircle: a figurinha vem redonda, ex.: .fig circle',
  allowInGroups: true,
  allowInPrivate: true,
};

export default search;
