import Tesseract from 'tesseract.js';

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

export const recognizeText = async (url: string) => {
  const result = await Tesseract.recognize(
    url,
    'rus',
  );
  return result.data.text;
};
