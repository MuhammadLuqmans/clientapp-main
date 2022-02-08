export const returnMockApiResponse = <T>(data: T[]): Promise<T[]> =>
  new Promise((resolve) => {
    setTimeout(() => resolve(data), 500);
  });
