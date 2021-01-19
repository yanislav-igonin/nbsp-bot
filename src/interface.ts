import { Context } from 'telegraf';
import {
  User, Message, Update, PhotoSize,
} from 'telegraf/typings/telegram-types.d';

interface CustomMessage extends Message {
  text: string;
  from: User;
  photo: PhotoSize[];
}

interface CustomUpdate extends Update {
  message: CustomMessage;
}

export interface CustomContext extends Context {
  update: CustomUpdate;
}
