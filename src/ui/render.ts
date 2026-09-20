import { Book } from '../models/Book';
import { User } from '../models/User';
import { Library } from '../services/Library';
import { Storage } from '../services/Storage';
import { NotificationService } from '../services/NotificationService';
import { IdGenerator } from '../utils/idGenerator';
import { BookForm, BookFormData } from './components/BookForm';
import { UserForm, UserFormData } from './components/UserForm';
import { BookList } from './components/BookList';
import { UserList } from './components/UserList';
import { IBook } from '../models/interfaces/IBook';
import { IUser } from '../models/interfaces/IUser';

export class AppRenderer {
  private mountElement: HTMLElement;
  private bookLibrary: Library<Book>;
  private userLibrary: Library<User>;

  // UI Components
  private bookForm!: BookForm;
  private userForm!: UserForm;
  private bookList!: BookList;
  private userList!: UserList;

  // State
  private bookSearchQuery: string = '';
  private currentBookPage: number = 1;
  private currentUserPage: number = 1;
  private readonly ITEMS_PER_PAGE = 5;

  private static readonly STORAGE_BOOKS_KEY = 'library_app_books';
  private static readonly STORAGE_USERS_KEY = 'library_app_users';

  constructor(mountElement: HTMLElement) {
    this.mountElement = mountElement;
    this.bookLibrary = new Library<Book>();
    this.userLibrary = new Library<User>();

    this.loadData();
    this.initUI();
  }

  private loadData(): void {
    const rawBooks = Storage.get<IBook[]>(AppRenderer.STORAGE_BOOKS_KEY);
    const rawUsers = Storage.get<IUser[]>(AppRenderer.STORAGE_USERS_KEY);

    if (rawBooks && rawBooks.length > 0) {
      this.bookLibrary.load(rawBooks.map((b) => Book.fromJSON(b)));
    } else {
      // Seed initial data from the manual's screenshots (pages 5 & 6)
      const initialBooks = [
        new Book('b1', 'Code Complete', 'Steve McConnell', 2004),
        new Book(
          'b2',
          'Clean Code: A Handbook of Agile Software Craftsmanship',
          'Роберт Мартін',
          2008
        ),
        new Book(
          'b3',
          'The Pragmatic Programmer: Your Journey to Mastery',
          'Ендрю Хансон, Девід Томас',
          1999
        ),
      ];
      this.bookLibrary.load(initialBooks);
      this.saveBooks();
    }

    if (rawUsers && rawUsers.length > 0) {
      this.userLibrary.load(rawUsers.map((u) => User.fromJSON(u)));
    } else {
      // Seed initial users matching page 5 screenshot
      const initialUsers = [
        new User('1725533394038', 'Артем', 'artemkarachevtsev@gmail.com'),
        new User('1725533437798', 'Мартін', 'softwar@gmail.com'),
      ];
      this.userLibrary.load(initialUsers);
      this.saveUsers();
    }
  }

  private saveBooks(): void {
    const data = this.bookLibrary.findAll().map((b) => b.toJSON());
    Storage.set(AppRenderer.STORAGE_BOOKS_KEY, data);
  }

  private saveUsers(): void {
    const data = this.userLibrary.findAll().map((u) => u.toJSON());
    Storage.set(AppRenderer.STORAGE_USERS_KEY, data);
  }

  private initUI(): void {
    this.mountElement.innerHTML = '';

    // Outer container matching screenshot style (clean card-based column)
    const wrapper = document.createElement('div');
    wrapper.className = 'max-w-3xl mx-auto px-4 py-8 space-y-6';

    // Application Title
    const titleHeader = document.createElement('h1');
    titleHeader.className = 'text-2xl sm:text-3xl font-bold text-center text-gray-900 tracking-tight mb-8';
    titleHeader.textContent = 'Система Управління Бібліотекою';
    wrapper.appendChild(titleHeader);

    // 1. BookForm Component
    this.bookForm = new BookForm((data: BookFormData) => this.handleCreateBook(data));
    wrapper.appendChild(this.bookForm.element);

    // 2. UserForm Component
    this.userForm = new UserForm((data: UserFormData) => this.handleCreateUser(data));
    wrapper.appendChild(this.userForm.element);

    // 3. BookList Component
    this.bookList = new BookList({
      onBorrow: (book) => this.handleBorrowBook(book),
      onReturn: (book) => this.handleReturnBook(book),
      onDelete: (bookId) => this.handleDeleteBook(bookId),
      onSearch: (query) => this.handleBookSearch(query),
      onPageChange: (page) => {
        this.currentBookPage = page;
        this.updateBookListView();
      },
    });
    wrapper.appendChild(this.bookList.element);

    // 4. UserList Component
    this.userList = new UserList({
      onDelete: (userId) => this.handleDeleteUser(userId),
      onPageChange: (page) => {
        this.currentUserPage = page;
        this.updateUserListView();
      },
    });
    wrapper.appendChild(this.userList.element);

    this.mountElement.appendChild(wrapper);

    // Initial render of lists
    this.updateBookListView();
    this.updateUserListView();
  }

  private updateBookListView(): void {
    let books = this.bookLibrary.findAll();

    if (this.bookSearchQuery.trim()) {
      const q = this.bookSearchQuery.toLowerCase().trim();
      books = books.filter(
        (b) => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)
      );
    }

    const paginated = this.bookLibrary.paginate(
      this.currentBookPage,
      this.ITEMS_PER_PAGE,
      books
    );
    this.bookList.render(paginated);
  }

  private updateUserListView(): void {
    const users = this.userLibrary.findAll();
    const paginated = this.userLibrary.paginate(
      this.currentUserPage,
      this.ITEMS_PER_PAGE,
      users
    );
    this.userList.render(paginated);
  }

  // Action Handlers
  private handleCreateBook(data: BookFormData): void {
    const newBook = new Book(
      IdGenerator.generateId('book'),
      data.title,
      data.author,
      data.year
    );
    this.bookLibrary.add(newBook);
    this.saveBooks();
    this.updateBookListView();
  }

  private handleCreateUser(data: UserFormData): void {
    const userId = data.id || IdGenerator.generateNumericId();

    if (this.userLibrary.findById(userId)) {
      NotificationService.showError(`Користувач з ID "${userId}" вже існує.`);
      return;
    }

    const newUser = new User(userId, data.name, data.email);
    this.userLibrary.add(newUser);
    this.saveUsers();
    this.updateUserListView();
  }

  private handleBorrowBook(book: Book): void {
    NotificationService.promptUserId(book.title, (userId: string) => {
      const user = this.userLibrary.findById(userId);

      if (!user) {
        NotificationService.showError(
          `Користувача з ID ${userId} не знайдено в системі! Спочатку додайте користувача.`
        );
        return;
      }

      if (!user.canBorrow()) {
        NotificationService.showLimitExceeded(user.name, user.id);
        return;
      }

      try {
        book.borrow(user.id);
        user.addBorrowedBook(book.id);

        this.saveBooks();
        this.saveUsers();

        this.updateBookListView();
        this.updateUserListView();

        NotificationService.showBorrowedSuccess(
          book.getFormattedInfo(),
          user.getFormattedInfo()
        );
      } catch (err: unknown) {
        NotificationService.showError(
          err instanceof Error ? err.message : 'Не вдалося позичити книгу'
        );
      }
    });
  }

  private handleReturnBook(book: Book): void {
    const userId = book.borrowedBy;
    try {
      if (userId) {
        const user = this.userLibrary.findById(userId);
        if (user) {
          user.removeBorrowedBook(book.id);
          this.saveUsers();
        }
      }

      book.returnBook();
      this.saveBooks();

      this.updateBookListView();
      this.updateUserListView();

      NotificationService.showReturnedSuccess(book.getFormattedInfo());
    } catch (err: unknown) {
      NotificationService.showError(
        err instanceof Error ? err.message : 'Не вдалося повернути книгу'
      );
    }
  }

  private handleDeleteBook(bookId: string): void {
    const book = this.bookLibrary.findById(bookId);
    if (!book) return;

    if (book.isBorrowed && book.borrowedBy) {
      const user = this.userLibrary.findById(book.borrowedBy);
      if (user) {
        user.removeBorrowedBook(bookId);
        this.saveUsers();
      }
    }

    this.bookLibrary.remove(bookId);
    this.saveBooks();
    this.updateBookListView();
    this.updateUserListView();
  }

  private handleDeleteUser(userId: string): void {
    const user = this.userLibrary.findById(userId);
    if (!user) return;

    if (user.borrowedBooksCount > 0) {
      NotificationService.showError(
        `Неможливо видалити користувача ${user.name}: за ним закріплено ${user.borrowedBooksCount} позичених книг. Спочатку поверніть книги!`
      );
      return;
    }

    this.userLibrary.remove(userId);
    this.saveUsers();
    this.updateUserListView();
  }

  private handleBookSearch(query: string): void {
    this.bookSearchQuery = query;
    this.currentBookPage = 1;
    this.updateBookListView();
  }
}

export function renderApp(mountElement: HTMLElement): AppRenderer {
  return new AppRenderer(mountElement);
}
