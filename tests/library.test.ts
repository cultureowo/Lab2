import { expect } from 'chai';
import { Library } from '../src/services/Library';
import { Identifiable } from '../src/types/index';

interface TestItem extends Identifiable {
  name: string;
  category: string;
}

describe('Library<T> Generic Collection Tests', () => {
  let library: Library<TestItem>;

  beforeEach(() => {
    library = new Library<TestItem>();
  });

  it('should start empty', () => {
    expect(library.size()).to.equal(0);
    expect(library.findAll()).to.deep.equal([]);
  });

  it('should add items to the collection', () => {
    const item1: TestItem = { id: '1', name: 'Item One', category: 'A' };
    const item2: TestItem = { id: '2', name: 'Item Two', category: 'B' };

    library.add(item1);
    library.add(item2);

    expect(library.size()).to.equal(2);
    expect(library.has('1')).to.be.true;
    expect(library.has('2')).to.be.true;
  });

  it('should throw an error when adding an item without an id', () => {
    const invalidItem = { id: '', name: 'No ID', category: 'A' };
    expect(() => library.add(invalidItem as TestItem)).to.throw(
      'Об’єкт повинен мати унікальний id'
    );
  });

  it('should find an item by id', () => {
    const item: TestItem = { id: 'abc', name: 'Alpha', category: 'Greek' };
    library.add(item);

    const found = library.findById('abc');
    expect(found).to.not.be.undefined;
    expect(found?.name).to.equal('Alpha');
  });

  it('should return undefined when searching for a non-existing id', () => {
    const found = library.findById('non-existing');
    expect(found).to.be.undefined;
  });

  it('should remove an item by id', () => {
    const item: TestItem = { id: 'del-1', name: 'Delete Me', category: 'Test' };
    library.add(item);
    expect(library.size()).to.equal(1);

    const removed = library.remove('del-1');
    expect(removed).to.be.true;
    expect(library.size()).to.equal(0);
    expect(library.findById('del-1')).to.be.undefined;
  });

  it('should return false when trying to remove an item that does not exist', () => {
    const removed = library.remove('ghost');
    expect(removed).to.be.false;
  });

  it('should find items by a custom predicate', () => {
    library.add({ id: '1', name: 'Apple', category: 'Fruit' });
    library.add({ id: '2', name: 'Banana', category: 'Fruit' });
    library.add({ id: '3', name: 'Carrot', category: 'Vegetable' });

    const fruits = library.findBy((item) => item.category === 'Fruit');
    expect(fruits.length).to.equal(2);
    expect(fruits.map((f) => f.name)).to.include.members(['Apple', 'Banana']);
  });

  it('should paginate items correctly', () => {
    for (let i = 1; i <= 12; i++) {
      library.add({ id: String(i), name: `Item ${i}`, category: 'Batch' });
    }

    const page1 = library.paginate(1, 5);
    expect(page1.totalItems).to.equal(12);
    expect(page1.totalPages).to.equal(3);
    expect(page1.currentPage).to.equal(1);
    expect(page1.items.length).to.equal(5);
    expect(page1.items[0].id).to.equal('1');

    const page3 = library.paginate(3, 5);
    expect(page3.items.length).to.equal(2);
    expect(page3.items[0].id).to.equal('11');
    expect(page3.items[1].id).to.equal('12');
  });
});
