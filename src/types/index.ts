export interface Identifiable {
  id: string;
}

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  items: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

export interface ModalConfig {
  title: string;
  content?: HTMLElement | string;
  confirmText?: string;
  cancelText?: string;
  confirmButtonClass?: string;
  onConfirm?: (value?: string) => void;
  onCancel?: () => void;
  showInput?: boolean;
  inputPlaceholder?: string;
  inputValidation?: (value: string) => string | null;
}
