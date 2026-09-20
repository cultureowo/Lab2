import { ModalConfig } from '../../types/index';

export class Modal {
  private static instance: Modal | null = null;
  private container: HTMLDivElement;

  private constructor() {
    this.container = document.createElement('div');
    this.container.id = 'modal-root';
    this.container.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 transition-opacity duration-200 hidden';
    document.body.appendChild(this.container);
  }

  static getInstance(): Modal {
    if (!Modal.instance) {
      Modal.instance = new Modal();
    }
    return Modal.instance;
  }

  show(config: ModalConfig): void {
    this.container.innerHTML = '';
    this.container.classList.remove('hidden');

    const dialog = document.createElement('div');
    dialog.className = 'bg-white rounded-lg shadow-xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150 relative border border-gray-200';

    // Header with Title and Close 'X' button
    const header = document.createElement('div');
    header.className = 'flex justify-between items-start gap-2 border-b border-gray-100 pb-3';

    const titleEl = document.createElement('h3');
    titleEl.className = 'text-lg font-semibold text-gray-800 leading-snug';
    titleEl.textContent = config.title;
    header.appendChild(titleEl);

    const closeBtn = document.createElement('button');
    closeBtn.className = 'text-gray-400 hover:text-gray-600 text-xl font-bold p-1 rounded transition-colors';
    closeBtn.textContent = '✕';
    closeBtn.onclick = () => {
      this.close();
      config.onCancel?.();
    };
    header.appendChild(closeBtn);
    dialog.appendChild(header);

    // Body / Content
    const body = document.createElement('div');
    body.className = 'text-gray-700 text-sm leading-relaxed';

    let inputEl: HTMLInputElement | null = null;
    let errorEl: HTMLParagraphElement | null = null;

    if (config.content) {
      if (typeof config.content === 'string') {
        const textP = document.createElement('p');
        textP.className = 'whitespace-pre-line text-base text-gray-700';
        textP.textContent = config.content;
        body.appendChild(textP);
      } else {
        body.appendChild(config.content);
      }
    }

    if (config.showInput) {
      const inputWrapper = document.createElement('div');
      inputWrapper.className = 'mt-3 space-y-1';

      inputEl = document.createElement('input');
      inputEl.type = 'text';
      inputEl.placeholder = config.inputPlaceholder || 'ID';
      inputEl.className = 'w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-base text-gray-800';

      errorEl = document.createElement('p');
      errorEl.className = 'text-red-600 text-xs mt-1 hidden';

      inputWrapper.appendChild(inputEl);
      inputWrapper.appendChild(errorEl);
      body.appendChild(inputWrapper);

      // Auto-focus input
      setTimeout(() => inputEl?.focus(), 50);

      // Submit on Enter
      inputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          handleConfirm();
        }
      });
    }

    dialog.appendChild(body);

    // Footer with buttons
    const footer = document.createElement('div');
    footer.className = 'flex justify-end gap-2 pt-2';

    if (config.cancelText) {
      const cancelBtn = document.createElement('button');
      cancelBtn.className = 'px-4 py-2 text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 rounded transition-colors';
      cancelBtn.textContent = config.cancelText;
      cancelBtn.onclick = () => {
        this.close();
        config.onCancel?.();
      };
      footer.appendChild(cancelBtn);
    }

    const handleConfirm = () => {
      if (config.showInput && inputEl) {
        const val = inputEl.value.trim();
        if (config.inputValidation) {
          const err = config.inputValidation(val);
          if (err) {
            if (errorEl) {
              errorEl.textContent = err;
              errorEl.classList.remove('hidden');
            }
            return;
          }
        }
        this.close();
        config.onConfirm?.(val);
      } else {
        this.close();
        config.onConfirm?.();
      }
    };

    if (config.confirmText) {
      const confirmBtn = document.createElement('button');
      confirmBtn.className = config.confirmButtonClass || 'px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors';
      confirmBtn.textContent = config.confirmText;
      confirmBtn.onclick = handleConfirm;
      footer.appendChild(confirmBtn);
    }

    dialog.appendChild(footer);

    // Backdrop click to close
    this.container.onclick = (e) => {
      if (e.target === this.container) {
        this.close();
        config.onCancel?.();
      }
    };

    this.container.appendChild(dialog);
  }

  close(): void {
    this.container.classList.add('hidden');
    this.container.innerHTML = '';
  }
}
