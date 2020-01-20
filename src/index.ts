import Telegraf, { ContextMessageUpdate } from 'telegraf';
import * as ngrok from 'ngrok';
import * as crypto from 'crypto';

import { app } from './config';
import { logger } from './modules';
import { TextContextMessageUpdate } from './interface';

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

bot.on('text', (ctx: TextContextMessageUpdate): void => {
  const newMessage = ctx.update.message.text?.replace(/\n\n/g, '\n⠀\n');
  ctx.reply(newMessage);
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

    const hookPath = `/bots/telegram/${crypto.randomBytes(32).toString('hex')}`;

    await bot.launch({
      webhook: {
        domain: host,
        hookPath,
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
