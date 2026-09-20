export interface IUser {
  id: string; // digits only as required by manual
  name: string;
  email: string;
  borrowedBooks: string[]; // IDs of borrowed books (max 3)
}
