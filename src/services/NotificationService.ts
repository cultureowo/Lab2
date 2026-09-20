import { Modal } from '../ui/components/Modal';
import { Validation } from '../utils/validators';

export class NotificationService {
  private static modal = Modal.getInstance();

  /**
   * Prompts user for User ID with validation (digits only).
   */
  static promptUserId(
    bookTitle: string,
    onConfirm: (userId: string) => void
  ): void {
    this.modal.show({
      title: 'Введіть ID користувача для позичення книги:',
      showInput: true,
      inputPlaceholder: 'ID',
      cancelText: 'Скасувати',
      confirmText: 'Зберегти',
      confirmButtonClass: 'px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors',
      inputValidation: (val: string) => {
        if (!Validation.isNotEmpty(val)) {
          return "Поле ID є обов'язковим";
        }
        if (!Validation.isValidUserId(val)) {
          return 'ID користувача повинен містити тільки цифри';
        }
        return null;
      },
      onConfirm: (val) => {
        if (val) onConfirm(val);
      },
    });
  }

  /**
   * Shows notification that book has been borrowed (matching manual page 7).
   */
  static showBorrowedSuccess(bookFormatted: string, userFormatted: string): void {
    this.modal.show({
      title: 'Книгу успішно позичено',
      content: `${bookFormatted} has been borrowed by ${userFormatted}.`,
      confirmText: 'Зрозуміло!',
      confirmButtonClass: 'px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors',
    });
  }

  /**
   * Shows notification that book has been returned (matching manual page 7).
   */
  static showReturnedSuccess(bookFormatted: string): void {
    this.modal.show({
      title: 'Книгу успішно повернено',
      content: `${bookFormatted} has been returned.`,
      confirmText: 'Закрити',
      confirmButtonClass: 'px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors',
    });
  }

  /**
   * Shows warning when user has reached the 3-book borrow limit.
   */
  static showLimitExceeded(userName: string, userId: string): void {
    this.modal.show({
      title: 'Перевищено ліміт позичання',
      content: `Користувач ${userName} (${userId}) вже позичив 3 книги! Кожен юзер може позичити не більше 3-х книг.`,
      confirmText: 'Зрозуміло!',
      confirmButtonClass: 'px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors',
    });
  }

  /**
   * Shows general error notification.
   */
  static showError(message: string, title: string = 'Помилка'): void {
    this.modal.show({
      title,
      content: message,
      confirmText: 'Закрити',
      confirmButtonClass: 'px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded transition-colors',
    });
  }

  /**
   * Shows general notification.
   */
  static showInfo(message: string, title: string = 'Повідомлення'): void {
    this.modal.show({
      title,
      content: message,
      confirmText: 'Зрозуміло',
      confirmButtonClass: 'px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors',
    });
  }
}
