export function get<T extends object, K extends keyof T>(o: T, name: K): T[K] {
  return o[name];
}

////////////////////// 类型定义
type Partial<T> = {
  [P in keyof T]?: T[P];
};

type Required<T> = {
  [P in keyof T]-?: T[P];
};

type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

interface User {
  id: number;
  age: number;
  name: string;
};

// 相当于: type PartialUser = { id?: number; age?: number; name?: string; }
type PartialUser = Partial<User>;

// 相当于: type PickUser = { id: number; age: number; }
type PickUser = Pick<User, "id" | "age">;
////////////////////////

/////////////////////// 类型定义
// T extends U ? X : Y

type isTrue<T> = T extends true ? true : false
// 相当于 type t = false
type t = isTrue<number>

// 相当于 type t = false
type t1 = isTrue<false>
/////////////////////////////


///////////////////////// 类型定义
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;

interface User {
  id: number;
  age: number;
  name: string;
};

// 相当于: type PickUser = { age: number; name: string; }
type OmitUser = Omit<User, "id">

type Exclude<T, U> = T extends U ? never : T;

// 相当于: type A = 'a'
type A = Exclude<'x' | 'a', 'x' | 'y' | 'z'>

/////////////////////////////




///////////////////////////// typeof
// import logger from './logger'
// import utils from './utils'

// interface Context extends KoaContect {
//   logger: typeof logger,
//   utils: typeof utils
// }

// app.use((ctx: Context) => {
//   ctx.logger.info('hello, world')

//   // 会报错，因为 logger.ts 中没有暴露此方法，可以最大限度的避免拼写错误
//   ctx.loger.info('hello, world')
// })
///////////////////////////////