import { User } from '../../models/User';
import { PaginatedResult } from '../../types/index';

export interface UserListCallbacks {
  onDelete: (userId: string) => void;
  onPageChange: (page: number) => void;
}

export class UserList {
  private container: HTMLDivElement;
  private callbacks: UserListCallbacks;

  constructor(callbacks: UserListCallbacks) {
    this.callbacks = callbacks;
    this.container = document.createElement('div');
    this.container.className = 'bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6';
  }

  get element(): HTMLElement {
    return this.container;
  }

  render(paginatedData: PaginatedResult<User>): void {
    const { items, totalPages, currentPage, totalItems } = paginatedData;

    this.container.innerHTML = `
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold text-gray-900">Список Користувачів (${totalItems})</h2>
      </div>

      <div id="users-container" class="divide-y divide-gray-100 min-h-[80px]">
        ${
          items.length === 0
            ? `<div class="text-center py-6 text-gray-400 text-sm">Немає зареєстрованих користувачів</div>`
            : items
                .map((user) => {
                  return `
            <div class="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3" data-user-id="${user.id}">
              <div class="text-sm font-medium text-gray-800">
                <span class="font-mono text-gray-600 text-xs">${this.escapeHtml(user.id)}</span>
                <span class="ml-1 text-gray-900">${this.escapeHtml(user.name)}</span>
                <span class="text-gray-500 font-normal">(${this.escapeHtml(user.email)})</span>
                <span class="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs ${
                  user.borrowedBooksCount === 3
                    ? 'bg-red-100 text-red-800 font-semibold'
                    : user.borrowedBooksCount > 0
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-600'
                }">
                  Книг: ${user.borrowedBooksCount}/3
                </span>
              </div>
              <div class="flex items-center gap-2 shrink-0">
                <button
                  class="btn-delete-user px-2.5 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-medium rounded transition-colors"
                  data-id="${user.id}"
                  title="Видалити користувача"
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
              id="btn-user-prev-page"
              class="px-2.5 py-1 text-xs font-medium rounded border border-gray-200 ${
                currentPage === 1 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-50 text-gray-700'
              }"
              ${currentPage === 1 ? 'disabled' : ''}
            >
              «
            </button>
            ${Array.from({ length: totalPages }, (_, i) => i + 1)
              .map(
                (p) => `
              <button
                class="btn-user-page px-2.5 py-1 text-xs font-medium rounded ${
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
              id="btn-user-next-page"
              class="px-2.5 py-1 text-xs font-medium rounded border border-gray-200 ${
                currentPage === totalPages ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-50 text-gray-700'
              }"
              ${currentPage === totalPages ? 'disabled' : ''}
            >
              »
            </button>
          </div>
        </div>
      `
          : ''
      }
    `;

    // Delete buttons
    this.container.querySelectorAll('.btn-delete-user').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = (btn as HTMLElement).dataset.id;
        if (id) this.callbacks.onDelete(id);
      });
    });

    // Pagination events
    const prevBtn = this.container.querySelector('#btn-user-prev-page');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (currentPage > 1) this.callbacks.onPageChange(currentPage - 1);
      });
    }

    const nextBtn = this.container.querySelector('#btn-user-next-page');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages) this.callbacks.onPageChange(currentPage + 1);
      });
    }

    this.container.querySelectorAll('.btn-user-page').forEach((btn) => {
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
