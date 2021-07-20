import * as googleTTS from 'google-tts-api';
import { Command, CommandData, CommandType } from '@command-protocols';
import { outputErrorMessage } from '../../utils/output-error-message';
import { getTextFromValueOrQuoted } from 'src/bot/utils/get-text-from-message-or-quoted';

const supportedLanguages = [
  'af-ZA',
  'ar-XA',
  'bn-IN',
  'bg-BG',
  'ca-ES',
  'yue-HK',
  'cs-CZ',
  'da-DK',
  'nl-BE',
  'nl-NL',
  'en-US',
  'en-AU',
  'en-IN',
  'en-GB',
  'fil-PH',
  'fi-FI',
  'fr-CA',
  'fr-FR',
  'de-DE',
  'el-GR',
  'gu-IN',
  'hi-IN',
  'hu-HU',
  'is-IS',
  'id-ID',
  'it-IT',
  'ja-JP',
  'kn-IN',
  'ko-KR',
  'lv-LV',
  'ms-MY',
  'ml-IN',
  'cmn-CN',
  'cmn-TW',
  'nb-NO',
  'pl-PL',
  'pt-BR',
  'pt-PT',
  'ro-RO',
  'ru-RU',
  'sr-RS',
  'sk-SK',
  'es-ES',
  'es-US',
  'sv-SE',
  'ta-IN',
  'te-IN',
  'th-TH',
  'tr-TR',
  'uk-UA',
  'vi-VN',
];

interface MappedLangAndText {
  lang: string | null;
  text: string | null | 'wrongFormat';
}
function getLangCodeAndTextFromQuery(
  query: string | undefined
): MappedLangAndText {
  const getLangRegex = /#([a-z]{2,3}|[a-z]{4,5}|[a-z]{2,3}-[a-z]{2})$/i;

  let lang = null;
  let text = query && query.trim() ? query : null;

  if (text && getLangRegex.test(text)) {
    let langCode = (text.match(getLangRegex) as RegExpMatchArray)[0]
      .replace('#', '')
      .replace('-', '');

    if (langCode.length > 3) {
      langCode =
        langCode.length === 5
          ? `${langCode.slice(0, 3).toLowerCase()}-${langCode
              .slice(2)
              .toUpperCase()}`
          : `${langCode.slice(0, 2).toLowerCase()}-${langCode
              .slice(2)
              .toUpperCase()}`;
    }

    const lowerCasedLangCode = langCode.toLowerCase();
    const targetLangCode = supportedLanguages.filter((lang) =>
      langCode.length < 4
        ? lang.indexOf(lowerCasedLangCode) === 0 ||
          lang.split('-')[1].toLowerCase().indexOf(lowerCasedLangCode) === 0
        : lang === langCode
    )[0];

    const langCodeIsValid = typeof targetLangCode === 'string';
    if (langCodeIsValid) {
      lang = targetLangCode;
    }
  }

  text = typeof text === 'string' ? text.replace(getLangRegex, '') : null;

  return {
    lang,
    text,
  };
}

const func: Command = async ({ value, client, message }) => {
  let lang = 'pt-BR';

  let { lang: langCode, text } = getLangCodeAndTextFromQuery(value);

  text = !text ? getTextFromValueOrQuoted(message, text) : text;

  if (!text) {
    outputErrorMessage(
      client,
      message,
      'Tem que mandar um texto para eu imitar, pô'
    );
    return;
  }

  if (text.length > 200) {
    client.reply(
      message.from,
      'A sua mensagem ultrapassou 200 caracteres, infelizmente vou ter que cortar um pedaço dela 😞✂️',
      message.id
    );
    text = text.slice(0, 200);
  }

  if (langCode === 'wrongFormat') {
    client.reply(
      message.from,
      'O código informado não é válido, o áudio será enviado em português 🇧🇷. Aguarde...',
      message.id
    );
  } else {
    lang = langCode !== null ? langCode : lang;
    await client.reply(
      message.from,
      'Estou procurando o áudio 🧐🔎, aguarde.',
      message.id
    );
  }

  let audioUrl: string = '';
  try {
    audioUrl = googleTTS.getAudioUrl(text, {
      lang,
      host: 'https://translate.google.com',
    });
  } catch (error) {
    client.reply(
      message.from,
      'Aconteceu um erro enquanto eu tentava baixar o áudio, tente novamente em alguns instantes.',
      message.id
    );
  }

  if (!audioUrl) {
    client.reply(
      message.from,
      'Não consegui encontrar um áudio para o texto fornecido 😞',
      message.id
    );
  }

  await client.sendAudio(message.chatId, audioUrl, message.id);
};

const fala: CommandData = {
  func,
  command: '.fala',
  description:
    'Transforma um texto digitado em áudio do zap.\nVocê pode informar o código do idioma com "#codigo_idioma" ex: .fala hello #enus ou #en-US',
  onlyForGroups: false,
  category: CommandType.FUNNY,
  detailedDescription: `Idiomas disponíveis:\n\n${supportedLanguages.join(
    '\n'
  )}`,
};

export default fala;
