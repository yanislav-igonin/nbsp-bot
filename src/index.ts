import { Telegraf } from 'telegraf';
import * as ngrok from 'ngrok';

import { app } from './config';
import { logger } from './modules';

const getCountText = (text: string) => {
  const { length } = text;
  const lengthWithoutSpaces = text
    .replace(/ |\n/g, '')
    .length;
  return `
Количество символов с пробелами - ${length}
Количество символов без пробелов - ${lengthWithoutSpaces}
  `;
};

const bot = new Telegraf(app.botToken);

bot.catch((err) => {
  logger.error(`ERROR: ${err}\n`);
});

bot.start((ctx) => {
  ctx.reply(
    'Привет.\n\n'
    + 'Я вставляю невидимый пробел между двумя переносами строк'
    + ' для создания абзацев в инстаграме.\n\n'
    + 'Отправь мне текст, который требуется обработать.\n\n'
    + 'Также подсчитываю количество символов с пробелами и без',
  );
});

bot.on('text', async (ctx) => {
  const { text } = ctx.update.message;
  const nbspEditedText = text.replace(/\n\n/g, '\n⠀\n');
  await ctx.reply(nbspEditedText);
  await ctx.reply(getCountText(text));
});

bot.on('photo', (ctx) => {

});

const launch = async () => {
  logger.info('release -', app.release);

  if (app.isWebhookDisabled) {
    await bot.telegram.deleteWebhook();
    bot.launch();
  } else {
    let host: string;
    if (app.env === 'development') {
      host = await ngrok.connect(app.webhookPort);
    } else {
      host = app.webhookHost;
    }

    await bot.launch({
      webhook: {
        domain: host,
        hookPath: app.webhookPath,
        port: app.webhookPort,
      },
    });
  }

  logger.info('bot - online');
};

launch()
  .then(() => logger.info('all systems nominal'))
  .catch((err: Error) => {
    logger.error('bot - offline');
    logger.error(err);
  });
