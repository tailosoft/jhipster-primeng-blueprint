import { SpyObject } from './spyobject';
import { ConfirmationService, Confirmation } from 'primeng/api';
import Spy = jasmine.Spy;

export class MockConfirmationService extends SpyObject {
  confirmSpy: Spy;

  constructor() {
    super(ConfirmationService);
    this.confirmSpy = this.spy('confirm').andCallFake((confirmation: Confirmation) => confirmation.accept && confirmation.accept());
  }
}
