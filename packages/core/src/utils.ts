export function deepCopy<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export function isObjectEmpty<T>(obj: T) {
  for (let _ in obj) return false;
  return true;
}

export function objectForEach<T>(
  obj: { [k: string]: T },
  fn: (value: T, key?: string) => void,
) {
  for (let key in obj) {
    fn(obj[key], key);
  }
}
