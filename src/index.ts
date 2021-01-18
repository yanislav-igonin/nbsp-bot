import Telegraf, { ContextMessageUpdate } from 'telegraf';
import * as ngrok from 'ngrok';

import { app } from './config';
import { logger } from './modules';
import { TextContextMessageUpdate } from './interface';

const getCountText = (text: string) => {
  const { length } = text;
  const lengthWithoutSpaces = text
    .replace(/ /g, '')
    .replace(/\n/g, '')
    .length;
  return `
Количество символов с пробелами - ${length}
Количество символов без пробелов - ${lengthWithoutSpaces}
  `;
};

const bot: Telegraf<TextContextMessageUpdate> = new Telegraf(app.botToken);

bot.catch((err: Error): void => {
  logger.error(`ERROR: ${err}\n`);
});

bot.start((ctx: ContextMessageUpdate): void => {
  ctx.reply(
    'Привет.\n\n'
    + 'Я вставляю невидимый пробел между двумя переносами строк'
    + ' для создания абзацев в инстаграме.\n\n'
    + 'Отправь мне текст, который требуется обработать.',
  );
});

bot.on('text', async (ctx: TextContextMessageUpdate): Promise<void> => {
  const { text } = ctx.update.message;
  const nbspEditedText = text.replace(/\n\n/g, '\n⠀\n');
  await ctx.reply(nbspEditedText);
  await ctx.reply(getCountText(text));
});

const launch = async (): Promise<void> => {
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
  .then((): void => logger.info('all systems nominal'))
  .catch((err: Error): void => {
    logger.error('bot - offline');
    logger.error(err);
  });
