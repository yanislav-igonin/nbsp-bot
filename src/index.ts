import Telegraf from 'telegraf';
import * as ngrok from 'ngrok';

import { app } from './config';
import { logger } from './modules';
import { CustomContext } from './interface';
import { getCountText, recognizeText } from './utils';

const bot = new Telegraf<CustomContext>(app.botToken);

bot.catch((err: Error) => {
  logger.error(`ERROR: ${err}\n`);
});

bot.start((ctx: CustomContext) => {
  ctx.reply(
    'Привет.\n\n'
    + 'Я вставляю невидимый пробел между двумя переносами строк'
    + ' для создания абзацев в инстаграме.\n\n'
    + 'Отправь мне текст, который требуется обработать.\n\n'
    + 'Также подсчитываю количество символов с пробелами и без',
  );
});

bot.on('text', async (ctx: CustomContext) => {
  const { text } = ctx.update.message;
  const nbspEditedText = text.replace(/\n\n/g, '\n⠀\n');
  await ctx.reply(nbspEditedText);
  await ctx.reply(getCountText(text));
});

bot.on('photo', async (ctx) => {
  const photos = ctx.update.message.photo;
  const largestPhoto = photos[photos.length - 1];
  const largestPhotoId = largestPhoto.file_id;
  const fileUrl = await ctx.telegram.getFileLink(largestPhotoId);
  await ctx.reply('Распознование текста начато. Время ожидания 1-2 минуты.');
  const text = await recognizeText(fileUrl);
  await ctx.reply(text);
  await ctx.reply(getCountText(text));
});

const launch = async () => {
  logger.info('release -', app.release);

  if (app.isWebhookDisabled) {
    await bot.telegram.deleteWebhook();
    bot.startPolling();
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
