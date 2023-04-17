interface IColumn {
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUser extends IColumn {
  name: string;
  email: string;
  password: string;
  id: number;
}

export interface ICategory extends IColumn {
  id?: number;
  name: string;
}

export interface IJoke extends IColumn {
  id: number;
  userId: number;
  content: string;
  categoryId: number;
}

type IJokeClass = Omit<IJoke, 'id'>;

export interface IComment extends IColumn {
  id?: number;
  userId: number;
  content: string;
  jokeId: number;
}

type ICommentClass = Omit<IComment, 'id'>;

export interface IRating extends IColumn {
  id?: number;
  rate: number;
  jokeId: number;
  userId: number;
}

type IRatingClass = Omit<IRating, 'id'>;

export class User implements IUser {
  name: string;
  email: string;
  password: string;
  id: number;

  constructor(data: IUser) {
    this.name = data.name;
    this.email = data.email;
    this.password = data.password;
    this.id = data.id;
  }
}

export class Category implements ICategory {
  name: string;
  id?: number;

  constructor(data: ICategory) {
    this.id = data?.id;
    this.name = data?.name;
  }
}

export class Joke implements IJokeClass {
  userId: number;
  content: string;
  categoryId: number;

  constructor(data: IJoke) {
    this.userId = data?.userId;
    this.content = data?.content;
    this.categoryId = data?.categoryId;
  }
}

export class Comment implements ICommentClass {
  userId: number;
  content: string;
  jokeId: number;

  constructor(data: IComment) {
    this.userId = data?.userId;
    this.content = data?.content || data?.content;
    this.jokeId = data?.jokeId;
  }
}

export class Rating implements IRatingClass {
  rate: number;
  jokeId: number;
  userId: number;

  constructor(data: IRating) {
    this.rate = data?.rate;
    this.jokeId = data?.jokeId;
    this.userId = data?.userId;
  }
}
