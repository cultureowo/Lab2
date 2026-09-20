import { Identifiable, PaginatedResult } from '../types/index';

/**
 * Generic Library<T> class for managing collections of identifiable objects.
 */
export class Library<T extends Identifiable> {
  private items: Map<string, T> = new Map();

  constructor(initialItems: T[] = []) {
    initialItems.forEach((item) => this.add(item));
  }

  /**
   * Adds an item to the collection.
   */
  add(item: T): void {
    if (!item.id) {
      throw new Error('Об’єкт повинен мати унікальний id');
    }
    this.items.set(item.id, item);
  }

  /**
   * Removes an item by its ID.
   * Returns true if the item was found and removed, false otherwise.
   */
  remove(id: string): boolean {
    return this.items.delete(id);
  }

  /**
   * Finds an item by its ID.
   */
  findById(id: string): T | undefined {
    return this.items.get(id);
  }

  /**
   * Returns all items in the collection.
   */
  findAll(): T[] {
    return Array.from(this.items.values());
  }

  /**
   * Finds items that match a predicate function.
   */
  findBy(predicate: (item: T) => boolean): T[] {
    return this.findAll().filter(predicate);
  }

  /**
   * Checks if an item exists in the collection.
   */
  has(id: string): boolean {
    return this.items.has(id);
  }

  /**
   * Returns the count of items in the collection.
   */
  size(): number {
    return this.items.size;
  }

  /**
   * Clears the collection.
   */
  clear(): void {
    this.items.clear();
  }

  /**
   * Loads an array of items into the collection.
   */
  load(items: T[]): void {
    this.items.clear();
    items.forEach((item) => this.add(item));
  }

  /**
   * Provides pagination for items.
   */
  paginate(page: number = 1, limit: number = 5, sourceItems?: T[]): PaginatedResult<T> {
    const list = sourceItems ?? this.findAll();
    const totalItems = list.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / limit));
    const normalizedPage = Math.max(1, Math.min(page, totalPages));

    const startIndex = (normalizedPage - 1) * limit;
    const items = list.slice(startIndex, startIndex + limit);

    return {
      items,
      totalItems,
      totalPages,
      currentPage: normalizedPage,
    };
  }
}
