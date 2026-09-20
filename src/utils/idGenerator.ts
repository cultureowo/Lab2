export class IdGenerator {
  /**
   * Generates a numeric ID (timestamp + random digits) matching the requirements and screenshots
   * e.g. 1725533394038
   */
  static generateNumericId(): string {
    const timestamp = Date.now().toString();
    const randomSuffix = Math.floor(Math.random() * 900 + 100).toString();
    return `${timestamp}${randomSuffix}`.slice(0, 13);
  }

  /**
   * Generates a general ID (for books or other entities)
   */
  static generateId(prefix: string = 'id'): string {
    return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }
}
