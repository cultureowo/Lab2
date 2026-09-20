import { Book } from '../../models/Book';
import { PaginatedResult } from '../../types/index';

export interface BookListCallbacks {
  onBorrow: (book: Book) => void;
  onReturn: (book: Book) => void;
  onDelete: (bookId: string) => void;
  onSearch: (query: string) => void;
  onPageChange: (page: number) => void;
}

export class BookList {
  private container: HTMLDivElement;
  private callbacks: BookListCallbacks;
  private currentSearch: string = '';

  constructor(callbacks: BookListCallbacks) {
    this.callbacks = callbacks;
    this.container = document.createElement('div');
    this.container.className = 'bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6';
  }

  get element(): HTMLElement {
    return this.container;
  }

  render(paginatedData: PaginatedResult<Book>): void {
    const { items, totalPages, currentPage, totalItems } = paginatedData;

    this.container.innerHTML = `
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <h2 class="text-xl font-bold text-gray-900">Список Книг (${totalItems})</h2>
        <div class="w-full sm:w-64">
          <input
            type="text"
            id="book-search-input"
            value="${this.escapeHtml(this.currentSearch)}"
            placeholder="Пошук за назвою або автором..."
            class="w-full px-3 py-1.5 text-sm border border-gray-300 rounded text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      <div id="books-container" class="divide-y divide-gray-100 min-h-[120px]">
        ${
          items.length === 0
            ? `<div class="text-center py-8 text-gray-400 text-sm">Не знайдено жодної книги</div>`
            : items
                .map((book) => {
                  return `
            <div class="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3" data-book-id="${book.id}">
              <div class="text-sm font-medium text-gray-800">
                <span>${this.escapeHtml(book.title)} by ${this.escapeHtml(book.author)} (${book.year})</span>
                ${
                  book.isBorrowed
                    ? `<span class="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                        Позичено: ${this.escapeHtml(book.borrowedBy || '')}
                       </span>`
                    : ''
                }
              </div>
              <div class="flex items-center gap-2 shrink-0">
                ${
                  book.isBorrowed
                    ? `<button
                        class="btn-return px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded shadow-sm transition-colors"
                        data-id="${book.id}"
                      >
                        Повернути
                      </button>`
                    : `<button
                        class="btn-borrow px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded shadow-sm transition-colors"
                        data-id="${book.id}"
                      >
                        Позичити
                      </button>`
                }
                <button
                  class="btn-delete-book px-2.5 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-medium rounded transition-colors"
                  data-id="${book.id}"
                  title="Видалити книгу"
                >
                  Видалити
                </button>
              </div>
            </div>
          `;
                })
                .join('')
        }
      </div>

      ${
        totalPages > 1
          ? `
        <div class="flex items-center justify-between border-t border-gray-100 pt-4 mt-3">
          <span class="text-xs text-gray-500">
            Сторінка ${currentPage} з ${totalPages}
          </span>
          <div class="flex items-center gap-1">
            <button
              id="btn-prev-page"
              class="px-2.5 py-1 text-xs font-medium rounded border border-gray-200 ${
                currentPage === 1 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-50 text-gray-700'
              }"
              ${currentPage === 1 ? 'disabled' : ''}
            >
              « Попередня
            </button>
            ${Array.from({ length: totalPages }, (_, i) => i + 1)
              .map(
                (p) => `
              <button
                class="btn-page px-2.5 py-1 text-xs font-medium rounded ${
                  p === currentPage
                    ? 'bg-blue-600 text-white'
                    : 'border border-gray-200 hover:bg-gray-50 text-gray-700'
                }"
                data-page="${p}"
              >
                ${p}
              </button>
            `
              )
              .join('')}
            <button
              id="btn-next-page"
              class="px-2.5 py-1 text-xs font-medium rounded border border-gray-200 ${
                currentPage === totalPages ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-50 text-gray-700'
              }"
              ${currentPage === totalPages ? 'disabled' : ''}
            >
              Наступна »
            </button>
          </div>
        </div>
      `
          : ''
      }
    `;

    // Event listeners
    const searchInput = this.container.querySelector('#book-search-input') as HTMLInputElement;
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.currentSearch = (e.target as HTMLInputElement).value;
        this.callbacks.onSearch(this.currentSearch);
      });
      // Keep cursor position if active
      if (document.activeElement?.id === 'book-search-input') {
        const len = searchInput.value.length;
        searchInput.focus();
        searchInput.setSelectionRange(len, len);
      }
    }

    // Borrow buttons
    this.container.querySelectorAll('.btn-borrow').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = (btn as HTMLElement).dataset.id;
        const book = items.find((b) => b.id === id);
        if (book) this.callbacks.onBorrow(book);
      });
    });

    // Return buttons
    this.container.querySelectorAll('.btn-return').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = (btn as HTMLElement).dataset.id;
        const book = items.find((b) => b.id === id);
        if (book) this.callbacks.onReturn(book);
      });
    });

    // Delete buttons
    this.container.querySelectorAll('.btn-delete-book').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = (btn as HTMLElement).dataset.id;
        if (id) this.callbacks.onDelete(id);
      });
    });

    // Pagination events
    const prevBtn = this.container.querySelector('#btn-prev-page');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (currentPage > 1) this.callbacks.onPageChange(currentPage - 1);
      });
    }

    const nextBtn = this.container.querySelector('#btn-next-page');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages) this.callbacks.onPageChange(currentPage + 1);
      });
    }

    this.container.querySelectorAll('.btn-page').forEach((btn) => {
      btn.addEventListener('click', () => {
        const page = parseInt((btn as HTMLElement).dataset.page || '1', 10);
        this.callbacks.onPageChange(page);
      });
    });
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}
