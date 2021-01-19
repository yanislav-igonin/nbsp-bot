import path from 'path';
import fs from 'fs';
import https from 'https';

const downloadsDirPath = path.resolve(__dirname, '..', 'downloads');

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
  fs.mkdir(downloadsDirPath, () => resolve());
});

export const downloadFile = (
  url: string, name: string | undefined,
) => new Promise<string>((resolve, reject) => {
  const filePath = `${downloadsDirPath}/${name}`;
  const file = fs.createWriteStream(filePath);

  https.get(url, (res) => {
    res.pipe(file);
    file.on('finish', () => {
      file.close();
      resolve(filePath);
    });
  }).on('error', (err) => {
    fs.unlink(filePath, () => {
      reject(err);
    });
  });
});
