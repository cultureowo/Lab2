import { Validation } from '../../utils/validators';

export interface UserFormData {
  id?: string;
  name: string;
  email: string;
}

export class UserForm {
  private container: HTMLDivElement;
  private onSubmitCallback: (data: UserFormData) => void;

  constructor(onSubmit: (data: UserFormData) => void) {
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
      <h2 class="text-xl font-bold text-gray-900 mb-4">Додати Користувача</h2>
      <form id="add-user-form" class="space-y-4" novalidate>
        <div>
          <label for="user-id" class="sr-only">ID користувача</label>
          <input
            type="text"
            id="user-id"
            name="id"
            placeholder="ID користувача (необов'язково, тільки цифри; згенерується автоматично)"
            class="w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <p id="user-id-error" class="text-red-600 text-xs mt-1 hidden"></p>
        </div>

        <div>
          <label for="user-name" class="sr-only">Ім'я</label>
          <input
            type="text"
            id="user-name"
            name="name"
            placeholder="Ім'я"
            class="w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <p id="user-name-error" class="text-red-600 text-xs mt-1 hidden"></p>
        </div>

        <div>
          <label for="user-email" class="sr-only">Email</label>
          <input
            type="email"
            id="user-email"
            name="email"
            placeholder="Email"
            class="w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <p id="user-email-error" class="text-red-600 text-xs mt-1 hidden"></p>
        </div>

        <button
          type="submit"
          id="btn-add-user"
          class="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium py-2 px-4 rounded transition-colors"
        >
          Додати Користувача
        </button>
      </form>
    `;

    const form = this.container.querySelector('#add-user-form') as HTMLFormElement;
    const idInput = this.container.querySelector('#user-id') as HTMLInputElement;
    const nameInput = this.container.querySelector('#user-name') as HTMLInputElement;
    const emailInput = this.container.querySelector('#user-email') as HTMLInputElement;

    const idError = this.container.querySelector('#user-id-error') as HTMLParagraphElement;
    const nameError = this.container.querySelector('#user-name-error') as HTMLParagraphElement;
    const emailError = this.container.querySelector('#user-email-error') as HTMLParagraphElement;

    idInput.addEventListener('input', () => {
      idError.textContent = '';
      idError.classList.add('hidden');
    });
    nameInput.addEventListener('input', () => {
      nameError.textContent = '';
      nameError.classList.add('hidden');
    });
    emailInput.addEventListener('input', () => {
      emailError.textContent = '';
      emailError.classList.add('hidden');
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const customId = idInput.value.trim();
      const name = nameInput.value.trim();
      const email = emailInput.value.trim();

      const errors = Validation.validateUser(name, email, customId || undefined);

      let hasErrors = false;

      if (errors.id) {
        idError.textContent = errors.id;
        idError.classList.remove('hidden');
        hasErrors = true;
      } else {
        idError.classList.add('hidden');
      }

      if (errors.name) {
        nameError.textContent = errors.name;
        nameError.classList.remove('hidden');
        hasErrors = true;
      } else {
        nameError.classList.add('hidden');
      }

      if (errors.email) {
        emailError.textContent = errors.email;
        emailError.classList.remove('hidden');
        hasErrors = true;
      } else {
        emailError.classList.add('hidden');
      }

      if (hasErrors) return;

      this.onSubmitCallback({
        id: customId || undefined,
        name,
        email,
      });

      form.reset();
    });
  }
}
