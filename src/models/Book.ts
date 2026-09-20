import { IBook } from './interfaces/IBook';
import { Identifiable } from '../types/index';

export class Book implements IBook, Identifiable {
  private _id: string;
  private _title: string;
  private _author: string;
  private _year: number;
  private _isBorrowed: boolean;
  private _borrowedBy: string | null;
  private _borrowDate: string | null;

  constructor(
    id: string,
    title: string,
    author: string,
    year: number,
    isBorrowed: boolean = false,
    borrowedBy: string | null = null,
    borrowDate: string | null = null
  ) {
    this._id = id;
    this._title = title.trim();
    this._author = author.trim();
    this._year = year;
    this._isBorrowed = isBorrowed;
    this._borrowedBy = borrowedBy;
    this._borrowDate = borrowDate;
  }

  // Getters and Setters
  get id(): string {
    return this._id;
  }

  get title(): string {
    return this._title;
  }

  set title(val: string) {
    this._title = val.trim();
  }

  get author(): string {
    return this._author;
  }

  set author(val: string) {
    this._author = val.trim();
  }

  get year(): number {
    return this._year;
  }

  set year(val: number) {
    this._year = val;
  }

  get isBorrowed(): boolean {
    return this._isBorrowed;
  }

  set isBorrowed(val: boolean) {
    this._isBorrowed = val;
  }

  get borrowedBy(): string | null {
    return this._borrowedBy;
  }

  set borrowedBy(val: string | null) {
    this._borrowedBy = val;
  }

  get borrowDate(): string | null {
    return this._borrowDate;
  }

  set borrowDate(val: string | null) {
    this._borrowDate = val;
  }

  // Business logic methods
  borrow(userId: string): void {
    if (this._isBorrowed) {
      throw new Error(`Книга "${this._title}" вже позичена.`);
    }
    this._isBorrowed = true;
    this._borrowedBy = userId;
    this._borrowDate = new Date().toISOString();
  }

  returnBook(): void {
    if (!this._isBorrowed) {
      throw new Error(`Книга "${this._title}" не була позичена.`);
    }
    this._isBorrowed = false;
    this._borrowedBy = null;
    this._borrowDate = null;
  }

  getFormattedInfo(): string {
    return `${this._title} by ${this._author} (${this._year})`;
  }

  toJSON(): IBook {
    return {
      id: this._id,
      title: this._title,
      author: this._author,
      year: this._year,
      isBorrowed: this._isBorrowed,
      borrowedBy: this._borrowedBy,
      borrowDate: this._borrowDate,
    };
  }

  static fromJSON(data: IBook): Book {
    return new Book(
      data.id,
      data.title,
      data.author,
      data.year,
      data.isBorrowed,
      data.borrowedBy,
      data.borrowDate
    );
  }
}
