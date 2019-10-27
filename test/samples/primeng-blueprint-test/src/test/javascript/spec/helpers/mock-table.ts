import { SpyObject } from './spyobject';
import { Table } from 'primeng/table';

export class MockTable extends SpyObject {
  constructor() {
    super(Table);
    this.spy('createLazyLoadMetadata').andReturn({});
  }
}
