export const getHash = (input) => {
  let hash = 0;
  const len = input.length;
  for (let i = 0; i < len; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0; // to 32bit integer
  }
  return hash;
};

export const makeId = () => {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < 10; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const addDaysToDate = (date, days) => {
  const res = new Date(date);
  res.setDate(res.getDate() + days);
  return res;
};

export const removeByValue = (array, val) => {
  for (let i = 0; i < array.length; i++) {
    if (array[i] === val) {
      array.splice(i, 1);
      i--;
    }
  }
  return array;
};

export const isNavigationKey = (key: string) =>
  key === 'Home' ||
  key === 'End' ||
  key.indexOf('Arrow') === 0 ||
  key.indexOf('Page') === 0 ||
  key === ' ';