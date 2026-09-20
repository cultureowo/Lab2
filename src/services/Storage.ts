export class Storage {
  /**
   * Retrieves an item from LocalStorage and parses it from JSON.
   */
  static get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return null;
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Storage error reading key "${key}":`, error);
      return null;
    }
  }

  /**
   * Serializes a value to JSON and stores it in LocalStorage.
   */
  static set<T>(key: string, value: T): void {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);
    } catch (error) {
      console.error(`Storage error writing key "${key}":`, error);
    }
  }

  /**
   * Removes an item from LocalStorage.
   */
  static remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Storage error removing key "${key}":`, error);
    }
  }

  /**
   * Clears all items in LocalStorage.
   */
  static clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Storage error clearing localStorage:', error);
    }
  }

  /**
   * Checks if an item exists in LocalStorage.
   */
  static has(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }
}
