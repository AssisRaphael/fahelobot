import { getNumberFromContactId } from '@bot-utils';
import { Command, CommandData, CommandType } from '@command-protocols';
import { getRandom, getImage } from '@utils';

const imageDataURI = require('image-data-uri');

const names = [
  'Maki Zenin',
  'Satoru Gojo',
  'Nico Robin',
  'Sanji Vinsmoke',
  'Yuta Okkotsu',
  'Megumi Fushiguro',
  'Sukuna Ryomen',
  'Monkey D. Luffy',
  'Roronoa Zoro',
  'Goro Majima',
  'Uraraka',
  'Izuku Midoriya',
  'Kim Dahyun',
  'Minatozaki Sana',
  'Park Jihyo',
  'Hirai Momo',
  'Kim Ji Woo (Chuu)',
  'Harry Styles',
  'Zayn Malik',
  'Felipe Neto',
  'Carlos Bolsonaro',
  'Renan Bolsonaro',
  'Eduardo Bolsonaro',
  'Jair Messias Bolsonaro',
  'Lula',
  'Fátima Bernardes',
  'Ednaldo Pereira',
  'Agostinho Carrara',
  'Glória Maria do Fantástico',
  'Gil da Esfiha',
  'Cr7 de Facão',
  'Gil do BBB21',
  'Messi Careca',
  'Juliette do BBB21',
  'Monark',
  'Véio da Havan',
  'Nunes Filho',
  'Galo Cego',
  'Padre Marcelo Rossi',
  'Galo de Kalsa',
  'Galo de Tênis',
  'Lázaro Barbosa do DF',
  'Bicha Muda',
  'Bluezão',
  'Kid Bengala',
];

const func: Command = async (params) => {
  const { value, client, message } = params;

  const marriagePartner = getRandom(names);

  let groupMembers = await client.getGroupMembers(message.chat.id as any);

  let filtered = groupMembers.filter((member) => {
    return !member.isMe;
  });

  const member = getRandom(filtered);

  const contactNumber = getNumberFromContactId(member.id);

  let imgUrl = await getImage(marriagePartner)
    .then((url) => url)
    .catch(() => {
      return false;
    });

  const imageName = imgUrl as string;
  const dataUri = await imageDataURI.encodeFromURL(imgUrl);

  await client.sendImage(
    message.from,
    dataUri,
    Date.now() + '.jpg',
    `💑 O 💍 casamento 💍 entre @${contactNumber} e *${marriagePartner}* está prestes a acontecer, vamos desejar felicidades ao casal. ✨ ✨ ✨`,
    message.id
  );
};

const marry: CommandData = {
  command: ['.marry'],
  category: CommandType.FUNNY,
  description:
    'Um casamento aleatorio entre um membro do grupo e um personagem de anime',
  func,
  allowInGroups: true,
  allowInPrivate: false,
};

export default marry;
