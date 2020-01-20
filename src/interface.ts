import { ContextMessageUpdate } from 'telegraf';
import { User, Message, Update } from 'telegraf/typings/telegram-types.d';

interface TextMessage extends Message {
  text: string;
  from: User;
}

interface TextUpdate extends Update {
  message: TextMessage;
}

export interface TextContextMessageUpdate extends ContextMessageUpdate {
  update: TextUpdate;
}
