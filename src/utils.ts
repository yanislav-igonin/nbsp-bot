import path from 'path';
import fs from 'fs';

export const getCountText = (text: string) => {
  const { length } = text;
  const lengthWithoutSpaces = text
    .replace(/ |\n/g, '')
    .length;
  return `
Количество символов с пробелами - ${length}
Количество символов без пробелов - ${lengthWithoutSpaces}
  `;
};


export const createDownloadsDir = () => new Promise<void>((resolve) => {
  const dirPath = path.resolve(__dirname, '..', 'downloads');
  fs.mkdir(dirPath, () => resolve());
});
