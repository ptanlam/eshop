export function jsonParse(jsonRecord: [unknown[], unknown]) {
  return JSON.parse(
    Object.values(jsonRecord[0])
      .map((each: string) => {
        return Object.values(each)[0];
      })
      .reduce((acc: string, curr: string) => acc + curr, ''),
  );
}
