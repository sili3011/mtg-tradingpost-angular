import Dexie from 'dexie';

interface IHashtable {
  code: string;
  data: JSON;
}

export class HashtablesDatabase extends Dexie {
  hashtables: Dexie.Table<IHashtable, number>;

  constructor() {
    super('hashtablesDatabase');
    this.version(1).stores({
      hashtables: 'code,data',
    });
    this.hashtables = this.table('hashtables');
  }
}
