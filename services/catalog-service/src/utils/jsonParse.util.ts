export function jsonParse(jsonRecord: any) {
  if (jsonRecord?.result === 'ok') return jsonRecord;
  return JSON.parse(
    Object.values(jsonRecord[0])
      .map((each: string) => {
        return Object.values(each)[0];
      })
      .reduce((acc: string, curr: string) => acc + curr, ''),
  );
}
