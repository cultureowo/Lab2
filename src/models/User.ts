import { IUser } from './interfaces/IUser';
import { Identifiable } from '../types/index';

export class User implements IUser, Identifiable {
  private _id: string;
  private _name: string;
  private _email: string;
  private _borrowedBooks: string[];

  public static readonly MAX_BORROW_LIMIT = 3;

  constructor(
    id: string,
    name: string,
    email: string,
    borrowedBooks: string[] = []
  ) {
    this._id = id.trim();
    this._name = name.trim();
    this._email = email.trim();
    this._borrowedBooks = [...borrowedBooks];
  }

  // Getters and Setters
  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  set name(val: string) {
    this._name = val.trim();
  }

  get email(): string {
    return this._email;
  }

  set email(val: string) {
    this._email = val.trim();
  }

  get borrowedBooks(): string[] {
    return [...this._borrowedBooks];
  }

  get borrowedBooksCount(): number {
    return this._borrowedBooks.length;
  }

  // Business logic methods
  canBorrow(): boolean {
    return this._borrowedBooks.length < User.MAX_BORROW_LIMIT;
  }

  addBorrowedBook(bookId: string): void {
    if (!this.canBorrow()) {
      throw new Error(`Користувач не може позичити більше ${User.MAX_BORROW_LIMIT}-х книг.`);
    }
    if (!this._borrowedBooks.includes(bookId)) {
      this._borrowedBooks.push(bookId);
    }
  }

  removeBorrowedBook(bookId: string): void {
    this._borrowedBooks = this._borrowedBooks.filter((id) => id !== bookId);
  }

  getFormattedInfo(): string {
    return `${this._id} ${this._name} (${this._email})`;
  }

  toJSON(): IUser {
    return {
      id: this._id,
      name: this._name,
      email: this._email,
      borrowedBooks: [...this._borrowedBooks],
    };
  }

  static fromJSON(data: IUser): User {
    return new User(data.id, data.name, data.email, data.borrowedBooks || []);
  }
}
