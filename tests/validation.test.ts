import { expect } from 'chai';
import { Validation } from '../src/utils/validators';

describe('Validation Namespace Tests', () => {
  describe('isNotEmpty', () => {
    it('should return false for empty or whitespace-only strings', () => {
      expect(Validation.isNotEmpty('')).to.be.false;
      expect(Validation.isNotEmpty('   ')).to.be.false;
      expect(Validation.isNotEmpty(null)).to.be.false;
      expect(Validation.isNotEmpty(undefined)).to.be.false;
    });

    it('should return true for non-empty strings', () => {
      expect(Validation.isNotEmpty('hello')).to.be.true;
      expect(Validation.isNotEmpty(' a ')).to.be.true;
      expect(Validation.isNotEmpty('0')).to.be.true;
    });
  });

  describe('isValidUserId', () => {
    it('should accept valid numeric user IDs', () => {
      expect(Validation.isValidUserId('12345')).to.be.true;
      expect(Validation.isValidUserId('1725533394038')).to.be.true;
      expect(Validation.isValidUserId('0')).to.be.true;
    });

    it('should reject non-numeric characters in user ID', () => {
      expect(Validation.isValidUserId('user123')).to.be.false;
      expect(Validation.isValidUserId('12-34')).to.be.false;
      expect(Validation.isValidUserId('12.34')).to.be.false;
      expect(Validation.isValidUserId('abc')).to.be.false;
      expect(Validation.isValidUserId('')).to.be.false;
    });
  });

  describe('isValidYear', () => {
    it('should accept valid 4-digit publication years', () => {
      expect(Validation.isValidYear('2004')).to.be.true;
      expect(Validation.isValidYear('1999')).to.be.true;
      expect(Validation.isValidYear('2024')).to.be.true;
      expect(Validation.isValidYear(2008)).to.be.true;
    });

    it('should reject invalid year formats and unrealistic years', () => {
      expect(Validation.isValidYear('99')).to.be.false;
      expect(Validation.isValidYear('20244')).to.be.false;
      expect(Validation.isValidYear('year2020')).to.be.false;
      expect(Validation.isValidYear('3000')).to.be.false;
      expect(Validation.isValidYear('')).to.be.false;
    });
  });

  describe('validateBook', () => {
    it('should return empty errors object when book data is valid', () => {
      const errors = Validation.validateBook('Refactoring', 'Martin Fowler', '1999');
      expect(Object.keys(errors)).to.have.lengthOf(0);
    });

    it('should report errors when required fields are missing', () => {
      const errors = Validation.validateBook('', '', '');
      expect(errors.title).to.equal("Це поле є обов'язковим");
      expect(errors.author).to.equal("Це поле є обов'язковим");
      expect(errors.year).to.equal("Це поле є обов'язковим");
    });

    it('should report error when year is not numeric', () => {
      const errors = Validation.validateBook('Test Title', 'Author', 'twenty');
      expect(errors.year).to.equal('Поле повинно містити тільки цифри');
    });

    it('should report error when year is outside valid bounds', () => {
      const errors = Validation.validateBook('Test Title', 'Author', '3500');
      expect(errors.year).to.equal('Введіть коректний рік видання (наприклад, 2024)');
    });
  });

  describe('validateUser', () => {
    it('should return empty errors for valid user data without manual ID', () => {
      const errors = Validation.validateUser('Artem', 'artem@example.com');
      expect(Object.keys(errors)).to.have.lengthOf(0);
    });

    it('should return empty errors for valid user data with valid numeric ID', () => {
      const errors = Validation.validateUser('Artem', 'artem@example.com', '123456');
      expect(Object.keys(errors)).to.have.lengthOf(0);
    });

    it('should reject non-numeric user ID when provided', () => {
      const errors = Validation.validateUser('Artem', 'artem@example.com', 'abc-123');
      expect(errors.id).to.equal('ID користувача повинен містити тільки цифри');
    });

    it('should reject invalid email format', () => {
      const errors = Validation.validateUser('Artem', 'not-an-email');
      expect(errors.email).to.equal('Введіть коректний email');
    });

    it('should require name and email', () => {
      const errors = Validation.validateUser('', '');
      expect(errors.name).to.equal("Це поле є обов'язковим");
      expect(errors.email).to.equal("Це поле є обов'язковим");
    });
  });
});
