export function generateKeyForArray(data: string | number) {
  return `${data}_${new Date().getTime()}`;
}
