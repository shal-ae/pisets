// import { deepClone } from './deep-clone'
//
// export function deepCopy<T>(value: T): T {
//   if (typeof value !== 'object' || value === null) {
//     return value;
//   }
//   if (Array.isArray(value)) {
//     return deepArray(value);
//   }
//   return deepObject(value);
// }
//
// function deepObject<T extends object>(source: T): T {
//   const result: Partial<T> = {};
//   Object.keys(source).forEach((key) => {
//     const value = source[key];
//     result[key] = deepClone(value);
//   }, {});
//   return result as T;
// }
//
// function deepArray<T extends any[]>(collection: T): any {
//   return collection.map((value) => {
//     return deepClone(value);
//   });
// }
