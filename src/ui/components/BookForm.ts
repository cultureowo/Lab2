import { Validation } from '../../utils/validators';

export interface BookFormData {
  title: string;
  author: string;
  year: number;
}

export class BookForm {
  private container: HTMLDivElement;
  private onSubmitCallback: (data: BookFormData) => void;

  constructor(onSubmit: (data: BookFormData) => void) {
    this.onSubmitCallback = onSubmit;
    this.container = document.createElement('div');
    this.container.className = 'bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6';
    this.render();
  }

  get element(): HTMLElement {
    return this.container;
  }

  private render(): void {
    this.container.innerHTML = `
      <h2 class="text-xl font-bold text-gray-900 mb-4">Додати Книгу</h2>
      <form id="add-book-form" class="space-y-4" novalidate>
        <div>
          <label for="book-title" class="sr-only">Назва книги</label>
          <input
            type="text"
            id="book-title"
            name="title"
            placeholder="Назва книги"
            class="w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <p id="book-title-error" class="text-red-600 text-xs mt-1 hidden"></p>
        </div>

        <div>
          <label for="book-author" class="sr-only">Автор</label>
          <input
            type="text"
            id="book-author"
            name="author"
            placeholder="Автор"
            class="w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <p id="book-author-error" class="text-red-600 text-xs mt-1 hidden"></p>
        </div>

        <div>
          <label for="book-year" class="sr-only">Рік видання</label>
          <input
            type="text"
            id="book-year"
            name="year"
            placeholder="Рік видання"
            class="w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <p id="book-year-error" class="text-red-600 text-xs mt-1 hidden"></p>
        </div>

        <button
          type="submit"
          id="btn-add-book"
          class="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium py-2 px-4 rounded transition-colors"
        >
          Додати Книгу
        </button>
      </form>
    `;

    const form = this.container.querySelector('#add-book-form') as HTMLFormElement;
    const titleInput = this.container.querySelector('#book-title') as HTMLInputElement;
    const authorInput = this.container.querySelector('#book-author') as HTMLInputElement;
    const yearInput = this.container.querySelector('#book-year') as HTMLInputElement;

    const titleError = this.container.querySelector('#book-title-error') as HTMLParagraphElement;
    const authorError = this.container.querySelector('#book-author-error') as HTMLParagraphElement;
    const yearError = this.container.querySelector('#book-year-error') as HTMLParagraphElement;

    // Real-time error clearing on input
    titleInput.addEventListener('input', () => {
      titleError.textContent = '';
      titleError.classList.add('hidden');
    });
    authorInput.addEventListener('input', () => {
      authorError.textContent = '';
      authorError.classList.add('hidden');
    });
    yearInput.addEventListener('input', () => {
      yearError.textContent = '';
      yearError.classList.add('hidden');
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const title = titleInput.value.trim();
      const author = authorInput.value.trim();
      const yearStr = yearInput.value.trim();

      const errors = Validation.validateBook(title, author, yearStr);

      let hasErrors = false;

      if (errors.title) {
        titleError.textContent = errors.title;
        titleError.classList.remove('hidden');
        hasErrors = true;
      } else {
        titleError.classList.add('hidden');
      }

      if (errors.author) {
        authorError.textContent = errors.author;
        authorError.classList.remove('hidden');
        hasErrors = true;
      } else {
        authorError.classList.add('hidden');
      }

      if (errors.year) {
        yearError.textContent = errors.year;
        yearError.classList.remove('hidden');
        hasErrors = true;
      } else {
        yearError.classList.add('hidden');
      }

      if (hasErrors) return;

      this.onSubmitCallback({
        title,
        author,
        year: parseInt(yearStr, 10),
      });

      form.reset();
    });
  }
}
